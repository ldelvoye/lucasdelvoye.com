"use client";

import { useEffect, useState } from "react";
import type { NowPlaying } from "@/features/spotify/model";

const TICK_MS = 1000;

function baseElapsed(now: NowPlaying | null): number {
  if (now === null) {
    return 0;
  }
  return now.progressMs;
}

export function useTicker(now: NowPlaying | null): number {
  const [elapsed, setElapsed] = useState(() => baseElapsed(now));

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
      setElapsed(capped);
    }, TICK_MS);
    return () => {
      window.clearInterval(timer);
    };
  }, [now]);

  return elapsed;
}
