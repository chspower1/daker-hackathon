import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { defaultLocale, isLocale, localeCookieName, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Providers } from "@/lib/i18n/Providers";
import { themeStorageKey } from "@/lib/theme/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeFromCookie = cookieStore.get(localeCookieName)?.value;

  return isLocale(localeFromCookie) ? localeFromCookie : defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function() {
            var systemTheme = 'light';

            try {
              systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            } catch {}

            function applyTheme(theme) {
              document.documentElement.dataset.theme = theme;
              document.documentElement.style.colorScheme = theme;
              document.documentElement.classList.toggle('dark', theme === 'dark');
            }

            try {
              var storedTheme = window.localStorage.getItem('${themeStorageKey}');
              var theme = storedTheme === 'dark' || storedTheme === 'light'
                ? storedTheme
                : systemTheme;
              applyTheme(theme);
            } catch {
              applyTheme(systemTheme);
            }
          })();`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers initialLocale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
