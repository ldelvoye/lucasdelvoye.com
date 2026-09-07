"use client";

import type { ReactElement } from "react";
import { PixelImage } from "@/components/pixels/PixelArt";
import { Box } from "@/components/ui/Box";
import { CharBar } from "@/components/ui/CharBar";
import styles from "./Player.module.css";

type Track = {
  title: string;
  artist: string;
  cover: string;
  elapsed: number;
  total: number;
  state: string;
};

const PLACEHOLDER: Track = {
  title: "Midnight City",
  artist: "M83",
  cover: "/cover.svg",
  elapsed: 102,
  total: 243,
  state: "▶",
};

const COVER_SIZE = 12;
const BAR_CELLS = 18;

function formatTime(seconds: number): string {
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  const padded = String(rest).padStart(2, "0");
  return `${minutes}:${padded}`;
}

export function Player({ drawn }: { drawn: boolean }): ReactElement {
  const track = PLACEHOLDER;
  const ratio = track.elapsed / track.total;
  const elapsed = formatTime(track.elapsed);
  const total = formatTime(track.total);
  const coverLabel = `album art for ${track.title}`;
  return (
    <div className={styles.dockwrap} data-region="player" data-drawn={drawn}>
      <Box title="player" tone="pink" layout="row" className={styles.dock}>
        <span className={styles.cover}>
          <PixelImage src={track.cover} size={COVER_SIZE} label={coverLabel} />
        </span>
        <span className={styles.title}>{track.title}</span>
        <span className={styles.artist}>· {track.artist}</span>
        <CharBar cells={BAR_CELLS} ratio={ratio} className={styles.bar} />
        <span className={styles.time}>
          {elapsed} / {total}
        </span>
        <span className={styles.state} aria-hidden="true">
          {track.state}
        </span>
      </Box>
    </div>
  );
}
