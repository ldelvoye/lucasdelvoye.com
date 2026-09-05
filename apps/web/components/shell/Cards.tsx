"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { CardItem } from "@/content/tabs";
import styles from "./Cards.module.css";

type Props = { items: CardItem[]; selection: number; onSelect: (index: number) => void };

function Detail({ item }: { item: CardItem }) {
  let link: ReactNode = null;
  if (item.href !== undefined) {
    link = (
      <a className={styles.link} href={item.href} target="_blank" rel="noreferrer">
        {item.href} ↗
      </a>
    );
  }
  return (
    <div className={styles.detail}>
      <p className={styles.detailTitle}>{item.title}</p>
      {item.detail}
      {link}
    </div>
  );
}

export function Cards({ items, selection, onSelect }: Props) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (list === null) {
      return;
    }
    const selected = list.children[selection];
    if (selected instanceof HTMLElement) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [selection]);

  const current = items[selection];
  if (current === undefined) {
    return <p className={styles.empty}>nothing here yet</p>;
  }

  return (
    <div className={styles.split}>
      <ul ref={listRef} className={styles.list}>
        {items.map((item, index) => {
          const isSelected = index === selection;
          let className = styles.card;
          let inline: ReactNode = null;
          if (isSelected) {
            className = `${styles.card} ${styles.selected}`;
            inline = (
              <div className={styles.inline}>
                <Detail item={item} />
              </div>
            );
          }
          return (
            <li key={item.id} className={className} onClick={() => onSelect(index)}>
              <div className={styles.row}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.meta}>{item.meta}</span>
              </div>
              <span className={styles.subtitle}>{item.subtitle}</span>
              {inline}
            </li>
          );
        })}
      </ul>
      <div className={styles.pane}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.12 }}
          >
            <Detail item={current} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
