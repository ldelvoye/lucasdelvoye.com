import type { ReactElement } from "react";
import styles from "./Gutter.module.css";

export function Gutter({ up, down }: { up: boolean; down: boolean }): ReactElement {
  return (
    <span className={styles.gutter} aria-hidden="true">
      <span className={styles.arrow} data-show={up}>
        ↑
      </span>
      <span className={styles.arrow} data-show={down}>
        ↓
      </span>
    </span>
  );
}
