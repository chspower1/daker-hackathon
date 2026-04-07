const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const host = process.env.PPT_DECK_HOST ?? '127.0.0.1';
const outputPath = path.join(projectRoot, 'public/HackPlatform-Deck.pdf');

function findAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, host, () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Failed to resolve an available port.')));
        return;
      }
      const { port } = address;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });
  });
}

function startPreviewServer(port) {
  const preview = spawn(
    'pnpm',
    ['exec', 'vite', 'preview', '--host', host, '--port', String(port), '--strictPort'],
    {
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
    },
  );

  let logs = '';
  preview.stdout.on('data', (chunk) => {
    logs += chunk.toString();
  });
  preview.stderr.on('data', (chunk) => {
    logs += chunk.toString();
  });

  return { preview, getLogs: () => logs };
}

function waitForServer(url, preview, getLogs) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const check = () => {
      if (preview.exitCode !== null) {
        reject(new Error(`Preview server exited early.\n${getLogs()}`));
        return;
      }

      const request = http.get(url, (response) => {
        response.resume();
        if (response.statusCode === 200) {
          resolve();
          return;
        }
        retry();
      });

      request.on('error', retry);
      request.setTimeout(1000, () => {
        request.destroy();
        retry();
      });
    };

    const retry = () => {
      if (Date.now() - startedAt > 30000) {
        reject(new Error(`Timed out waiting for preview server at ${url}.\n${getLogs()}`));
        return;
      }
      setTimeout(check, 250);
    };

    check();
  });
}

async function exportPDF() {
  const port = Number(process.env.PPT_DECK_PORT ?? await findAvailablePort());
  const baseUrl = `http://${host}:${port}`;
  const exportUrl = process.env.PPT_DECK_URL ?? `${baseUrl}/?export=true`;
  const { preview, getLogs } = startPreviewServer(port);
  let browser;

  try {
    await waitForServer(baseUrl, preview, getLogs);
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    console.log(`Navigating to ${exportUrl}`);
    await page.goto(exportUrl, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });

    console.log('Generating PDF...');
    await page.pdf({
      path: outputPath,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    console.log(`PDF successfully generated at: ${outputPath}`);
  } catch (error) {
    console.error('PDF export failed.');
    console.error(error);
    if (getLogs()) {
      console.error(getLogs());
    }
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
    if (preview.exitCode === null) {
      preview.kill('SIGTERM');
      await new Promise((resolve) => preview.once('exit', resolve));
    }
  }

  if (process.exitCode && process.exitCode !== 0) {
    process.exit(process.exitCode);
  }
}

void exportPDF();
