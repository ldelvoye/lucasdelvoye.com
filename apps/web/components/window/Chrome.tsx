import type { ReactElement } from "react";
import { SMORG_VERSION } from "@/components/intro/script";
import styles from "./Chrome.module.css";

export function Chrome(): ReactElement {
  return (
    <div className={styles.chrome} data-chrome>
      <div className={`${styles.layer} ${styles.win}`} data-chrome-win>
        <span className={styles.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.title}>
          ~ — <b>zsh</b> — 80×24
        </span>
        <span className={styles.right}>tab 1</span>
      </div>
      <div className={`${styles.layer} ${styles.app}`} data-chrome-app>
        <span className={styles.mark} aria-hidden="true" />
        <span className={styles.powered}>
          powered by <b>smorg</b> v{SMORG_VERSION}
        </span>
        <span className={styles.vrule} aria-hidden="true" />
        <span className={styles.who}>
          <b>Lucas Delvoye</b>
        </span>
        <span className={styles.grow} />
        <span className={styles.tagline}>Software engineer in San Francisco</span>
      </div>
    </div>
  );
}
