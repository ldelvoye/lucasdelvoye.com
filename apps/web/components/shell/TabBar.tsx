"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { Tab } from "@/content/tabs";
import styles from "./TabBar.module.css";

type Props = { tabs: Tab[]; active: number; onSelect: (index: number) => void };

export function TabBar({ tabs, active, onSelect }: Props) {
  return (
    <nav className={styles.bar} role="tablist" aria-label="Tabs">
      {tabs.map((tab, index) => {
        const isActive = index === active;
        const tabId = `tab-${tab.id}`;
        const panelId = `panel-${tab.id}`;
        let className = styles.tab;
        let underline: ReactNode = null;
        if (isActive) {
          className = `${styles.tab} ${styles.active}`;
          underline = <motion.span layoutId="tab-underline" className={styles.underline} />;
        }
        return (
          <button
            key={tab.id}
            id={tabId}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            className={className}
            onClick={() => onSelect(index)}
          >
            {tab.label}
            {underline}
          </button>
        );
      })}
    </nav>
  );
}
