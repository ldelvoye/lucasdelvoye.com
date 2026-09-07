import type { ReactElement } from "react";
import styles from "./Tag.module.css";

export function Tag({ label, tone }: { label: string; tone?: "blue" | "pink" }): ReactElement {
  let tagTone: "blue" | "pink" = "blue";
  if (tone !== undefined) {
    tagTone = tone;
  }
  return (
    <span className={styles.tag} data-tone={tagTone}>
      {label}
    </span>
  );
}
