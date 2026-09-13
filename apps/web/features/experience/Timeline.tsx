import type { ReactElement } from "react";
import type { Entry } from "./content";
import { spanOf, yearMarks, type Axis, type Month } from "./shape";
import styles from "./Experience.module.css";

function barsOf({
  entries,
  axis,
  now,
  selectedRef,
  className,
}: {
  entries: Entry[];
  axis: Axis;
  now: Month;
  selectedRef: string;
  className: string;
}): ReactElement[] {
  return entries.map((entry) => {
    const span = spanOf(entry, axis, now);
    const left = `${span.left * 100}%`;
    const width = `${span.width * 100}%`;
    const style = { left, width };

    let selected = false;
    if (entry.ref === selectedRef) {
      selected = true;
    }

    return <i key={entry.ref} className={className} data-selected={selected} style={style} />;
  });
}

export function Timeline({
  entries,
  axis,
  now,
  selectedRef,
}: {
  entries: Entry[];
  axis: Axis;
  now: Month;
  selectedRef: string;
}): ReactElement {
  const trunkEntries = entries.filter((entry) => entry.kind !== "intern");
  const internEntries = entries.filter((entry) => entry.kind === "intern");

  const trunkBars = barsOf({ entries: trunkEntries, axis, now, selectedRef, className: styles.trunkBar });
  const internBars = barsOf({ entries: internEntries, axis, now, selectedRef, className: styles.internBar });

  const marks = yearMarks(axis).map((mark) => {
    const left = `${mark.left * 100}%`;
    const style = { left };
    return (
      <span key={mark.year} className={styles.yearMark} style={style}>
        <span className={styles.tick} aria-hidden="true" />
        {mark.year}
      </span>
    );
  });

  return (
    <div className={styles.timelineBody}>
      <div className={styles.track}>
        <div className={styles.topBand}>{trunkBars}</div>
        <div className={styles.bottomBand}>{internBars}</div>
      </div>
      <div className={styles.years}>{marks}</div>
    </div>
  );
}
