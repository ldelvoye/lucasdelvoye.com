import type { ReactElement, ReactNode } from "react";
import { HOST_NAME, HOST_USER } from "@/features/host";
import styles from "./Prompt.module.css";

export function Prompt({
  verb,
  arg,
  trailing,
  caret,
  className,
}: {
  verb: string;
  arg?: string;
  trailing?: ReactNode;
  caret?: boolean;
  className?: string;
}): ReactElement {
  let argument: ReactNode = null;
  if (arg !== undefined) {
    argument = <span className={styles.arg}>{arg}</span>;
  }
  let cursor: ReactNode = null;
  if (caret === true) {
    cursor = <span className={styles.caret} aria-hidden="true" />;
  }
  let tail: ReactNode = null;
  if (trailing !== undefined) {
    tail = <span className={styles.trailing}>{trailing}</span>;
  }
  let classes = styles.prompt;
  if (className !== undefined) {
    classes = `${styles.prompt} ${className}`;
  }
  return (
    <p className={classes}>
      <span className={styles.host}>
        {HOST_USER}
        <span className={styles.at}>@</span>
        {HOST_NAME}
      </span>
      <span className={styles.sigil}>$</span>
      <span className={styles.verb}>{verb}</span>
      {argument}
      {cursor}
      {tail}
    </p>
  );
}
