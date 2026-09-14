"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { NowPlaying } from "contract";

const AFTER_END_MS = 1000;
const ENDED_RETRY_MS = 4 * 1000;
const EVERY_MS = 15 * 1000;

function delayFor(now: NowPlaying | null): number {
  if (now === null) {
    return EVERY_MS;
  }
  if (!now.playing) {
    return EVERY_MS;
  }
  const since = Date.now() - now.at;
  const remaining = now.durationMs - now.progressMs - since;
  if (remaining <= 0) {
    return ENDED_RETRY_MS;
  }
  return Math.min(EVERY_MS, remaining + AFTER_END_MS);
}

export function useNowRefresh(now: NowPlaying | null, pending: boolean): void {
  const router = useRouter();

  useEffect(() => {
    if (pending) {
      return;
    }
    const delay = delayFor(now);
    const timer = window.setTimeout(() => {
      router.refresh();
    }, delay);
    return () => {
      window.clearTimeout(timer);
    };
  }, [now, pending, router]);
}
