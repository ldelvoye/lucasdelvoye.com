"use client";

import type { ReactElement, ReactNode } from "react";
import { Box } from "@/components/ui/Box";
import { CharBar } from "@/components/ui/CharBar";
import { Cover } from "@/features/spotify/Cover";
import type { NowPlaying } from "@/features/spotify/model";
import { useNowRefresh } from "./useNowRefresh";
import { useTicker } from "./useTicker";
import styles from "./Player.module.css";

const BAR_CELLS = 18;

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const rest = totalSeconds % 60;
  const padded = String(rest).padStart(2, "0");
  return `${minutes}:${padded}`;
}

export function PlayerDock({ drawn, children }: { drawn: boolean; children: ReactNode }): ReactElement {
  return (
    <div className={styles.dockwrap} data-region="player" data-drawn={drawn}>
      {children}
    </div>
  );
}

export function Player({ now, pending }: { now: NowPlaying | null; pending: boolean }): ReactElement {
  const elapsedMs = useTicker(now);
  useNowRefresh(now, pending);
  const titleClass = `${styles.title} ${styles.dim}`;

  if (pending) {
    return (
      <Box title="player" tone="pink" layout="row" className={styles.dock}>
        <span className={titleClass}>loading…</span>
      </Box>
    );
  }

  if (now === null) {
    return (
      <Box title="player" tone="pink" layout="row" className={styles.dock}>
        <span className={titleClass}>nothing playing</span>
        <span className={styles.state} aria-hidden="true">
          ■
        </span>
      </Box>
    );
  }

  let ratio = 0;
  if (now.durationMs !== 0) {
    ratio = elapsedMs / now.durationMs;
  }
  let glyph = "■";
  if (now.playing) {
    glyph = "▶";
  }
  const coverLabel = `album art for ${now.title}`;

  return (
    <Box title="player" tone="pink" layout="row" className={styles.dock}>
      <Cover src={now.cover} alt={coverLabel} className={styles.cover} />
      <span className={styles.title}>{now.title}</span>
      <span className={styles.artist}>· {now.artist}</span>
      <CharBar cells={BAR_CELLS} ratio={ratio} className={styles.bar} />
      <span className={styles.time}>
        {formatTime(elapsedMs)} / {formatTime(now.durationMs)}
      </span>
      <span className={styles.state} aria-hidden="true">
        {glyph}
      </span>
    </Box>
  );
}
