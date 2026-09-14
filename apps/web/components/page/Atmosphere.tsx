import type { ReactElement } from "react";
import styles from "./Atmosphere.module.css";

export function Atmosphere({ dimmed }: { dimmed: boolean }): ReactElement {
  return (
    <div className={styles.page} data-atmosphere data-dimmed={dimmed} aria-hidden="true">
      <div className={styles.split} />
      <span className={`${styles.crop} ${styles.tl}`} />
      <span className={`${styles.crop} ${styles.tr}`} />
      <span className={`${styles.crop} ${styles.bl}`} />
      <span className={`${styles.crop} ${styles.br}`} />
      <div className={`${styles.furniture} ${styles.top}`}>
        <span className={styles.badge} />
        <strong className={styles.strong}>lucasdelvoye.com</strong>
        <span className={styles.rule} />
        <span className={styles.tagline}>
          Software engineer <span className={styles.dot}>·</span> San Francisco
        </span>
      </div>
      <div className={`${styles.furniture} ${styles.bottom}`}>
        <span>
          ~/ <span className={styles.dot}>·</span> zsh <span className={styles.dot}>·</span> 80 × 24
        </span>
        <span className={styles.rule} />
      </div>
    </div>
  );
}
