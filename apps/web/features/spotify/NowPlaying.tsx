"use client";

import type { ReactElement } from "react";
import { formatTime } from "@/components/shell/Player";
import { useTicker } from "@/components/shell/useTicker";
import { CharBar } from "@/components/ui/CharBar";
import { Cover } from "./Cover";
import { relativeTime } from "./history";
import type { NowPlaying } from "./model";
import styles from "./Spotify.module.css";

const BAR_CELLS = 24;

export function NowPlaying({ now, at }: { now: NowPlaying | null; at: number }): ReactElement {
  const elapsedMs = useTicker(now);

  if (now === null) {
    return <p className={styles.idle}>nothing playing</p>;
  }

  let ratio = 0;
  if (now.durationMs !== 0) {
    ratio = elapsedMs / now.durationMs;
  }

  let state = "■ paused";
  if (now.playing) {
    state = "▶ playing";
  } else if (now.playedAt !== null) {
    state = `■ last played ${relativeTime(now.playedAt, at)}`;
  }

  const coverLabel = `album art for ${now.title}`;

  return (
    <div className={styles.np}>
      <Cover src={now.cover} alt={coverLabel} className={styles.cover} />
      <div className={styles.info}>
        <p className={styles.title}>{now.title}</p>
        <p className={styles.artist}>{now.artist}</p>
        <p className={styles.album}>{now.album}</p>
        <div className={styles.play}>
          <CharBar cells={BAR_CELLS} ratio={ratio} className={styles.bar} />
          <p className={styles.time}>
            <span>{formatTime(elapsedMs)}</span>
            <span className={styles.state}>{state}</span>
            <span className={styles.total}>{formatTime(now.durationMs)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
