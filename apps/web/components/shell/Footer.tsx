"use client";

import type { ReactElement } from "react";
import { SMORG_VERSION } from "@/components/intro/script";
import { useShell } from "./ShellContext";
import styles from "./Footer.module.css";

type Hint = { key: string; label: string };

export function Footer(): ReactElement {
  const shell = useShell();
  const hints: Hint[] = [];
  if (shell.tabCount > 1) {
    hints.push({ key: "h/l", label: "tabs" });
  }
  const registration = shell.registration;
  if (registration !== null) {
    hints.push({ key: "j/k", label: "move" });
    if (registration.open !== null) {
      hints.push({ key: "o", label: "open" });
    }
    if (registration.onBack !== null) {
      hints.push({ key: "esc", label: "back" });
    }
  }
  const items = hints.map((hint) => (
    <span key={hint.key} className={styles.hint}>
      <span className={styles.key}>{hint.key}</span> {hint.label}
    </span>
  ));
  return (
    <div data-status data-region="footer">
      <div className={styles.hints} data-hints>
        {items}
      </div>
      <span className={styles.credit}>
        smorg {SMORG_VERSION} · ldelvoye/tap
      </span>
    </div>
  );
}
