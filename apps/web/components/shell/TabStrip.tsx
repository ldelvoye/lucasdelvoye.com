"use client";

import type { ReactElement, ReactNode } from "react";
import { motion } from "motion/react";
import type { TabInfo } from "./Shell";
import styles from "./TabStrip.module.css";

const OUT_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SLIDE_SECONDS = 0.3;

export function TabStrip({
  tabs,
  activeId,
  onSelect,
  drawn,
}: {
  tabs: TabInfo[];
  activeId: string;
  onSelect: (id: string) => void;
  drawn: boolean;
}): ReactElement {
  const items = tabs.map((tab) => {
    const active = tab.id === activeId;
    let bar: ReactNode = null;
    if (active) {
      bar = (
        <motion.span
          layoutId="tab-bar"
          className={styles.bar}
          transition={{ duration: SLIDE_SECONDS, ease: OUT_EASE }}
        />
      );
    }
    return (
      <button
        key={tab.id}
        type="button"
        role="tab"
        id={`tab-${tab.id}`}
        aria-controls={`panel-${tab.id}`}
        aria-selected={active}
        className={styles.tab}
        data-active={active}
        onClick={() => onSelect(tab.id)}
      >
        <span className={styles.label}>{tab.label}</span>
        <span className={styles.track}>{bar}</span>
      </button>
    );
  });

  return (
    <div
      className={styles.tabs}
      role="tablist"
      aria-label="Sections"
      data-region="tabs"
      data-drawn={drawn}
      data-scroll
    >
      {items}
    </div>
  );
}
