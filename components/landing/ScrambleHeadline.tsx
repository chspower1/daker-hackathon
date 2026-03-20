"use client";

import { useEffect, useState } from "react";

// bkit.ai style scramble characters
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_\\/[]{}=+*^?#";
const HOLD_DURATION_MS = 3000;

export function ScrambleHeadline({ phrases }: { phrases: string[] }) {
  const [displayText, setDisplayText] = useState(phrases[0] || "");
  const fallbackPhrase = phrases[0] ?? "";

  useEffect(() => {
    if (phrases.length === 0) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches || phrases.length === 1) {
      setDisplayText(fallbackPhrase);
      return;
    }

    let isCancelled = false;
    let frameRequest = 0;
    let timeoutId = 0;

    let currentPhraseIndex = 0;

    const runScramble = (oldText: string, newText: string, onComplete: () => void) => {
      const length = Math.max(oldText.length, newText.length);
      const queue: Array<{ from: string; to: string; start: number; end: number; char?: string }> = [];

      for (let i = 0; i < length; i++) {
        const from = oldText[i] || "";
        const to = newText[i] || "";
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        queue.push({ from, to, start, end });
      }

      let frame = 0;

      const update = () => {
        if (isCancelled) return;

        let output = "";
        let complete = 0;

        for (let i = 0; i < queue.length; i++) {
          const item = queue[i];
          if (frame >= item.end) {
            complete++;
            output += item.to;
          } else if (frame >= item.start) {
            if (!item.char || Math.random() < 0.28) {
              item.char = CHARS[Math.floor(Math.random() * CHARS.length)];
            }
            output += item.char;
          } else {
            output += item.from;
          }
        }

        setDisplayText(output);

        if (complete === queue.length) {
          onComplete();
        } else {
          frameRequest = requestAnimationFrame(update);
          frame++;
        }
      };

      update();
    };

    const nextPhrase = () => {
      if (isCancelled) return;
      const oldText = phrases[currentPhraseIndex];
      currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      const newText = phrases[currentPhraseIndex];

      runScramble(oldText, newText, () => {
        if (!isCancelled) {
          timeoutId = window.setTimeout(nextPhrase, HOLD_DURATION_MS);
        }
      });
    };

    timeoutId = window.setTimeout(nextPhrase, HOLD_DURATION_MS);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(frameRequest);
      clearTimeout(timeoutId);
    };
  }, [phrases, fallbackPhrase]);

  return (
    <>
      <span aria-hidden="true" className="inline-block whitespace-nowrap">{displayText}</span>
      <span className="sr-only">{fallbackPhrase}</span>
    </>
  );
}
