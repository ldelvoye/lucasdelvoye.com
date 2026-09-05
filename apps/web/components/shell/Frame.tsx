import type { ReactNode } from "react";
import styles from "./Frame.module.css";

export function Frame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.page}>
      <section className={styles.frame} aria-label="Terminal window">
        <header className={styles.titleBar}>
          <span className={styles.dots} aria-hidden="true">
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </span>
          <span className={styles.title}>{title}</span>
        </header>
        <div className={styles.body}>{children}</div>
      </section>
    </div>
  );
}
