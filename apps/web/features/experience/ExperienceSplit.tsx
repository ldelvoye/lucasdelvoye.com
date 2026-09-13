"use client";

import { useCallback, useState, type ReactElement } from "react";
import { useListKeys } from "@/components/shell/useListKeys";
import { Box } from "@/components/ui/Box";
import { Prompt } from "@/components/ui/Prompt";
import { Rows, type Row } from "@/components/ui/Rows";
import type { Entry } from "./content";
import { EntryDetail } from "./EntryDetail";
import { GraphCell } from "./GraphCell";
import { axisOf, shapeOf, spanLabel, type Month, type Shape } from "./shape";
import { Timeline } from "./Timeline";
import styles from "./Experience.module.css";

function tagOf(entry: Entry, shape: Shape): { label: string; tone: "blue" | "pink" } | null {
  if (shape === "head") {
    return { label: "HEAD", tone: "pink" };
  }
  if (entry.kind === "intern") {
    return { label: "intern", tone: "blue" };
  }
  if (entry.kind === "edu") {
    return { label: "edu", tone: "blue" };
  }
  return null;
}

function rowsOf(entries: Entry[]): Row[] {
  const count = entries.length;
  return entries.map((entry, index) => {
    const shape = shapeOf(entry, index, count);
    const tag = tagOf(entry, shape);
    const span = spanLabel(entry.start, entry.end);
    const meta = `${span} · ${entry.place}`;
    let tagField: { label: string; tone: "blue" | "pink" } | undefined = undefined;
    if (tag !== null) {
      tagField = tag;
    }
    return {
      id: entry.ref,
      glyph: "*",
      lead: <GraphCell shape={shape} />,
      title: entry.company,
      tag: tagField,
      subtitle: entry.role,
      meta,
      href: null,
    };
  });
}

export function ExperienceSplit({
  tabId,
  entries,
  now,
}: {
  tabId: string;
  entries: Entry[];
  now: Month;
}): ReactElement {
  const [selected, setSelected] = useState(0);

  const onMove = useCallback((index: number) => {
    setSelected(index);
  }, []);

  useListKeys(tabId, {
    count: entries.length,
    selected,
    onMove,
    open: null,
    onBack: null,
  });

  const rows = rowsOf(entries);
  const axis = axisOf(entries, now);

  let current: Entry | null = null;
  const found = entries[selected];
  if (found !== undefined) {
    current = found;
  }

  let detail = (
    <Box title="show" focused className={styles.show}>
      <span className={styles.empty}>no entries</span>
    </Box>
  );
  let selectedRef = "";
  if (current !== null) {
    selectedRef = current.ref;
    detail = (
      <Box key={current.ref} title={current.company} focused className={styles.show}>
        <EntryDetail entry={current} />
      </Box>
    );
  }

  return (
    <div className={styles.grid}>
      <Box title="experience" count={entries.length} className={styles.log}>
        <Prompt verb="git" arg="log --graph --date=short" className={styles.command} />
        <Rows rows={rows} selected={selected} onSelect={onMove} columns="graph" />
      </Box>
      {detail}
      <Box title="timeline" className={styles.timelineBox}>
        <Timeline entries={entries} axis={axis} now={now} selectedRef={selectedRef} />
      </Box>
    </div>
  );
}
