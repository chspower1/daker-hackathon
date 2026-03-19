"use client";

import { useEffect, useMemo, useState } from "react";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*?#";
const SCRAMBLE_DURATION_MS = 440;
const HOLD_DURATION_MS = 4020;
const START_DELAY_MS = 0;

function buildAlphabet(phrases: string[]) {
  const alphabet = new Set(SCRAMBLE_CHARS.split(""));

  for (const phrase of phrases) {
    for (const char of Array.from(phrase)) {
      if (char.trim().length > 0) {
        alphabet.add(char);
      }
    }
  }

  return Array.from(alphabet);
}

function getRandomChar(alphabet: string[]) {
  return alphabet[Math.floor(Math.random() * alphabet.length)] ?? "#";
}

function scramblePhrase(target: string, progress: number, alphabet: string[]) {
  const targetChars = Array.from(target);
  const revealCount = Math.floor(progress * targetChars.length);

  return targetChars
    .map((char, index) => {
      if (char.trim().length === 0) {
        return char;
      }

      return index < revealCount ? char : getRandomChar(alphabet);
    })
    .join("");
}

export function ScrambleHeadline({ phrases }: { phrases: string[] }) {
  const fallbackPhrase = phrases[0] ?? "";
  const [displayText, setDisplayText] = useState(fallbackPhrase);
  const alphabet = useMemo(() => buildAlphabet(phrases), [phrases]);

  useEffect(() => {
    if (phrases.length === 0) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shouldReduceMotion = mediaQuery.matches;

    let isCancelled = false;
    let animationFrameId = 0;
    let timeoutId = 0;

    const clearScheduledWork = () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(timeoutId);
    };

    const showStaticHeadline = () => {
      clearScheduledWork();
      setDisplayText(fallbackPhrase);
    };

    const runPhrase = (index: number) => {
      const targetPhrase = phrases[index] ?? fallbackPhrase;
      const start = performance.now();

      const tick = (now: number) => {
        if (isCancelled) {
          return;
        }

        const progress = Math.min((now - start) / SCRAMBLE_DURATION_MS, 1);
        setDisplayText(scramblePhrase(targetPhrase, progress, alphabet));

        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(tick);
          return;
        }

        setDisplayText(targetPhrase);

        if (phrases.length > 1) {
          timeoutId = window.setTimeout(() => {
            runPhrase((index + 1) % phrases.length);
          }, HOLD_DURATION_MS);
        }
      };

      animationFrameId = window.requestAnimationFrame(tick);
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        showStaticHeadline();
        return;
      }

      timeoutId = window.setTimeout(() => {
        runPhrase(0);
      }, START_DELAY_MS);
    };

    if (shouldReduceMotion || phrases.length === 1) {
      showStaticHeadline();
    } else {
      timeoutId = window.setTimeout(() => {
        runPhrase(0);
      }, START_DELAY_MS);
    }

    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      isCancelled = true;
      clearScheduledWork();
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, [alphabet, fallbackPhrase, phrases]);

  return (
    <>
      <span aria-hidden="true">{displayText}</span>
      <span className="sr-only">{fallbackPhrase}</span>
    </>
  );
}
