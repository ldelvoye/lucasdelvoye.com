import { Fragment, type ReactElement } from "react";
import styles from "./KeyValue.module.css";

export type Entry = { label: string; value: string; tone: "strong" | "plain" | "link" };

export function KeyValue({
  entries,
  wide,
  className,
}: {
  entries: Entry[];
  wide?: boolean;
  className?: string;
}): ReactElement {
  let isWide = false;
  if (wide === true) {
    isWide = true;
  }
  let classes = styles.kv;
  if (className !== undefined) {
    classes = `${styles.kv} ${className}`;
  }
  const items = entries.map((entry) => {
    let valueClass = styles.value;
    if (entry.tone === "strong") {
      valueClass = `${styles.value} ${styles.strong}`;
    }
    if (entry.tone === "link") {
      valueClass = `${styles.value} ${styles.link}`;
    }
    return (
      <Fragment key={entry.label}>
        <dt className={styles.label}>{entry.label}</dt>
        <dd className={valueClass}>{entry.value}</dd>
      </Fragment>
    );
  });
  return (
    <dl className={classes} data-wide={isWide}>
      {items}
    </dl>
  );
}
