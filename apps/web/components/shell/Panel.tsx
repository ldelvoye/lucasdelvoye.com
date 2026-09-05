"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { Tab } from "@/content/tabs";
import { Cards } from "./Cards";
import styles from "./Panel.module.css";

type Props = {
  tabs: Tab[];
  active: number;
  selections: number[];
  onSelect: (index: number) => void;
};

export function Panel({ tabs, active, selections, onSelect }: Props) {
  return (
    <div className={styles.panel}>
      {tabs.map((tab, index) => {
        const isActive = index === active;
        let body: ReactNode;
        if (tab.kind === "prose") {
          body = tab.body;
        } else {
          body = <Cards items={tab.items} selection={selections[index]} onSelect={onSelect} />;
        }
        let opacity = 0;
        let y = 4;
        if (isActive) {
          opacity = 1;
          y = 0;
        }
        return (
          <motion.section
            key={tab.id}
            role="tabpanel"
            hidden={!isActive}
            className={styles.inner}
            initial={false}
            animate={{ opacity, y }}
            transition={{ duration: 0.15 }}
          >
            {body}
          </motion.section>
        );
      })}
    </div>
  );
}
