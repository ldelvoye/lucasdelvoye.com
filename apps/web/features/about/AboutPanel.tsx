import type { ReactElement, ReactNode } from "react";
import { Session } from "@/components/reveal/Session";
import { serialDelays } from "@/components/reveal/schedule";
import { AboutLinks } from "./AboutLinks";
import { BIO, FOCUS } from "./content";
import styles from "./About.module.css";

const TAB_ID = "about";
const COMMANDS = ["whoami", "cat bio", "ls links"];

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

  const delays = serialDelays(COMMANDS);

  return (
    <div className={styles.session}>
      <Session order={0} delay={delays[0]} verb="whoami" reveal="fade" className={styles.cmd}>
        <div className={styles.out}>
          <p className={styles.focus}>{focus}</p>
        </div>
      </Session>
      <span className={styles.rule} aria-hidden="true" />
      <Session order={1} delay={delays[1]} verb="cat" arg="bio" reveal="fade" className={styles.cmd}>
        <div className={`${styles.out} ${styles.prose}`}>{paragraphs}</div>
      </Session>
      <span className={styles.rule} aria-hidden="true" />
      <Session order={2} delay={delays[2]} verb="ls" arg="links" reveal="rows" className={styles.cmd}>
        <div className={styles.out}>
          <AboutLinks tabId={TAB_ID} className={styles.links} />
        </div>
      </Session>
    </div>
  );
}
