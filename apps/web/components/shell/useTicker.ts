"use client";

import { useEffect, useState } from "react";
import type { NowPlaying } from "contract";

const TICK_MS = 1000;

type Ticker = { source: NowPlaying | null; elapsed: number };

function baseElapsed(now: NowPlaying | null): number {
  if (now === null) {
    return 0;
  }
  return now.progressMs;
}

export function useTicker(now: NowPlaying | null): number {
  const [ticker, setTicker] = useState<Ticker>(() => {
    return { source: now, elapsed: baseElapsed(now) };
  });

  let elapsed = ticker.elapsed;
  if (ticker.source !== now) {
    const reset = baseElapsed(now);
    setTicker({ source: now, elapsed: reset });
    elapsed = reset;
  }

  useEffect(() => {
    if (now === null) {
      return;
    }
    if (!now.playing) {
      return;
    }
    const timer = window.setInterval(() => {
      const since = Date.now() - now.at;
      const raw = now.progressMs + since;
      const capped = Math.min(now.durationMs, raw);
      setTicker({ source: now, elapsed: capped });
    }, TICK_MS);
    return () => {
      window.clearInterval(timer);
    };
  }, [now]);

  return elapsed;
}
