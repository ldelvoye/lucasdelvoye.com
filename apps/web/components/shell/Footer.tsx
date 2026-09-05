import type { KeyHint } from "@/content/tabs";
import styles from "./Footer.module.css";

export function Footer({ hints }: { hints: KeyHint[] }) {
  return (
    <footer className={styles.footer}>
      {hints.map((hint) => (
        <span key={hint.key} className={styles.hint}>
          <kbd>{hint.key}</kbd> {hint.label}
        </span>
      ))}
    </footer>
  );
}
