"use client";

import { useCallback, useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { Gutter } from "@/components/shell/Gutter";
import styles from "./Rows.module.css";

export type Row = {
  id: string;
  glyph: string;
  title: string;
  subtitle: string | null;
  meta: string | null;
  href: string | null;
};

type Wash = { top: number; height: number };

export function Rows({
  rows,
  selected,
  onSelect,
}: {
  rows: Row[];
  selected: number;
  onSelect: (index: number) => void;
}): ReactElement {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const previousRef = useRef<number>(selected);
  const [wash, setWash] = useState<Wash | null>(null);
  const [up, setUp] = useState(false);
  const [down, setDown] = useState(false);

  const syncGutter = useCallback(() => {
    const scroller = scrollRef.current;
    if (scroller === null) {
      return;
    }
    const maxScroll = scroller.scrollHeight - scroller.clientHeight;
    setUp(scroller.scrollTop > 1);
    setDown(scroller.scrollTop < maxScroll - 1);
  }, []);

  const measure = useCallback(() => {
    const list = listRef.current;
    if (list === null) {
      return;
    }
    const items = list.querySelectorAll("[data-row]");
    const item = items[selected];
    if (!(item instanceof HTMLElement)) {
      setWash(null);
      return;
    }
    setWash({ top: item.offsetTop, height: item.offsetHeight });
    if (previousRef.current !== selected) {
      item.scrollIntoView({ block: "nearest" });
    }
    previousRef.current = selected;
  }, [selected]);

  useEffect(() => {
    measure();
    syncGutter();
  }, [rows, selected, measure, syncGutter]);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (scroller === null) {
      return;
    }
    const observer = new ResizeObserver(() => {
      measure();
      syncGutter();
    });
    observer.observe(scroller);
    return () => {
      observer.disconnect();
    };
  }, [measure, syncGutter]);

  let washStyle: { transform: string; height: string } | undefined = undefined;
  let washShown = false;
  if (wash !== null) {
    washStyle = { transform: `translateY(${wash.top}px)`, height: `${wash.height}px` };
    washShown = true;
  }

  const items = rows.map((row, index) => {
    const isSelected = index === selected;
    let subtitle: ReactNode = null;
    if (row.subtitle !== null) {
      subtitle = <span className={styles.subtitle}>{row.subtitle}</span>;
    }
    let meta: ReactNode = null;
    if (row.meta !== null) {
      meta = <span className={styles.meta}>{row.meta}</span>;
    }
    const inside = (
      <>
        <span className={styles.cursor} aria-hidden="true">
          ▸
        </span>
        <span className={styles.glyph} aria-hidden="true">
          {row.glyph}
        </span>
        <span className={styles.main}>
          <span className={styles.title}>{row.title}</span>
          {subtitle}
        </span>
        {meta}
      </>
    );
    if (row.href === null) {
      return (
        <button
          key={row.id}
          type="button"
          data-row
          data-selected={isSelected}
          className={styles.row}
          onClick={() => onSelect(index)}
        >
          {inside}
        </button>
      );
    }
    return (
      <a
        key={row.id}
        data-row
        data-selected={isSelected}
        className={styles.row}
        href={row.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onSelect(index)}
      >
        {inside}
      </a>
    );
  });

  return (
    <div className={styles.rows}>
      <div className={styles.scroll} ref={scrollRef} onScroll={syncGutter}>
        <div className={styles.list} ref={listRef}>
          <span className={styles.wash} data-show={washShown} style={washStyle} aria-hidden="true" />
          {items}
        </div>
      </div>
      <Gutter up={up} down={down} />
    </div>
  );
}
