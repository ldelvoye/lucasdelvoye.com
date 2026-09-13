import type { ReactElement } from "react";
import { KeyValue, type Entry as KeyValueEntry } from "@/components/ui/KeyValue";
import { Prompt } from "@/components/ui/Prompt";
import type { Entry } from "./content";
import { spanLabel } from "./shape";
import styles from "./Experience.module.css";

export function EntryDetail({ entry }: { entry: Entry }): ReactElement {
  const entries: KeyValueEntry[] = [
    { label: "role", value: entry.role, tone: "strong" },
    { label: "dates", value: spanLabel(entry.start, entry.end), tone: "plain" },
    { label: "place", value: entry.place, tone: "plain" },
  ];

  const bullets = entry.bullets.map((bullet) => (
    <li key={bullet} className={styles.bullet}>
      <span className={styles.bulletMark} aria-hidden="true">
        ·
      </span>
      {bullet}
    </li>
  ));

  return (
    <div className={styles.detail}>
      <Prompt verb="git" arg={`show ${entry.ref}`} className={styles.command} />
      <KeyValue entries={entries} className={styles.kv} />
      <p className={styles.headline}>{entry.headline}</p>
      <ul className={styles.bullets}>{bullets}</ul>
    </div>
  );
}
