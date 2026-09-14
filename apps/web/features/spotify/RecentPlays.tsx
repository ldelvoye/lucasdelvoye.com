"use client";

import { useCallback, useState, type ReactElement } from "react";
import { useListKeys } from "@/components/shell/useListKeys";
import { Prompt } from "@/components/ui/Prompt";
import { Rows, type Row } from "@/components/ui/Rows";
import { logTime } from "./format";
import type { Play } from "contract";
import styles from "./Spotify.module.css";

export function RecentPlays({
  tabId,
  plays,
  at,
}: {
  tabId: string;
  plays: Play[];
  at: number;
}): ReactElement {
  const newest = Math.max(0, plays.length - 1);
  const [selected, setSelected] = useState(newest);

  const onMove = useCallback((index: number) => {
    setSelected(index);
  }, []);

  useListKeys(tabId, {
    count: plays.length,
    selected,
    onMove,
    open: null,
    onBack: null,
  });

  const oldestFirst = [...plays].reverse();
  const rows: Row[] = oldestFirst.map((play) => {
    return {
      id: play.playedAt,
      glyph: "♪",
      title: play.track,
      subtitle: play.artist,
      meta: logTime(play.playedAt, at),
      href: null,
    };
  });

  return (
    <div className={styles.plays}>
      <Prompt verb="tail" arg="-f ~/.spotify/history" className={styles.command} />
      <Rows rows={rows} selected={selected} onSelect={onMove} columns="log" anchor="end" />
      <p className={styles.tail} aria-hidden="true">
        <span className={styles.caret} />
      </p>
    </div>
  );
}
