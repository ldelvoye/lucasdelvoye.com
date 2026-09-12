import type { ReactElement, ReactNode } from "react";
import { Prompt } from "@/components/ui/Prompt";
import { AboutLinks } from "./AboutLinks";
import { BIO, FOCUS } from "./content";
import styles from "./About.module.css";

const TAB_ID = "about";

export function AboutPanel(): ReactElement {
  const paragraphs = BIO.map((text) => <p key={text}>{text}</p>);

  const focus: ReactNode[] = [];
  FOCUS.forEach((term, index) => {
    if (index > 0) {
      focus.push(
        <span key={`sep-${index}`} className={styles.sep} aria-hidden="true">
          ·
        </span>,
      );
    }
    focus.push(term);
  });

  return (
    <div className={styles.session}>
      <Prompt verb="whoami" className={styles.cmd} />
      <div className={styles.out}>
        <p className={styles.focus}>{focus}</p>
      </div>
      <span className={styles.rule} aria-hidden="true" />
      <Prompt verb="cat" arg="bio" className={styles.cmd} />
      <div className={`${styles.out} ${styles.prose}`}>{paragraphs}</div>
      <span className={styles.rule} aria-hidden="true" />
      <Prompt verb="ls" arg="links" className={styles.cmd} />
      <div className={styles.out}>
        <AboutLinks tabId={TAB_ID} className={styles.links} />
      </div>
    </div>
  );
}
