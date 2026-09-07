import type { ReactElement } from "react";
import styles from "./CharBar.module.css";

export function CharBar({
  cells,
  ratio,
  className,
}: {
  cells: number;
  ratio: number;
  className?: string;
}): ReactElement {
  let classes = styles.bar;
  if (className !== undefined) {
    classes = `${styles.bar} ${className}`;
  }
  const track = "░".repeat(cells);
  const fill = "█".repeat(cells);
  const floored = Math.max(0, ratio);
  const bounded = Math.min(1, floored);
  const percent = bounded * 100;
  const width = `${percent}%`;
  return (
    <span className={classes} aria-hidden="true">
      <span className={styles.track}>{track}</span>
      <span className={styles.fill} style={{ width }}>
        {fill}
      </span>
    </span>
  );
}
