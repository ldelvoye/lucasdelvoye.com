"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { KeyHint } from "@/content/tabs";
import styles from "./HelpOverlay.module.css";

type Props = { open: boolean; hints: KeyHint[]; onClose: () => void };

export function HelpOverlay({ open, hints, onClose }: Props) {
  let overlay: ReactNode = null;
  if (open) {
    overlay = (
      <motion.div
        key="help"
        className={styles.backdrop}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
      >
        <div
          className={styles.box}
          role="dialog"
          aria-label="Keys"
          onClick={(event) => event.stopPropagation()}
        >
          <p className={styles.heading}>keys</p>
          <dl className={styles.list}>
            {hints.map((hint) => (
              <div key={hint.key} className={styles.row}>
                <dt>
                  <kbd>{hint.key}</kbd>
                </dt>
                <dd>{hint.label}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.dismiss}>esc to close</p>
        </div>
      </motion.div>
    );
  }
  return <AnimatePresence>{overlay}</AnimatePresence>;
}
