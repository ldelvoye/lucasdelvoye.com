"use client";

import { Children, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import type { TabInfo } from "./Shell";
import styles from "./Stage.module.css";

const SWAP_MS = 300;

type Outgoing = { id: string; forward: boolean };

export function Stage({
  tabs,
  activeId,
  children,
}: {
  tabs: TabInfo[];
  activeId: string;
  children: ReactNode;
}): ReactElement {
  const panes = Children.toArray(children);
  const previousRef = useRef<string>(activeId);
  const [outgoing, setOutgoing] = useState<Outgoing | null>(null);

  useLayoutEffect(() => {
    const previous = previousRef.current;
    if (previous === activeId) {
      return;
    }
    previousRef.current = activeId;
    const fromIndex = tabs.findIndex((tab) => tab.id === previous);
    const toIndex = tabs.findIndex((tab) => tab.id === activeId);
    const forward = toIndex > fromIndex;
    setOutgoing({ id: previous, forward });
    const timer = window.setTimeout(() => {
      setOutgoing(null);
    }, SWAP_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [activeId, tabs]);

  const slots = panes.map((pane, index) => {
    const tab = tabs[index];
    if (tab === undefined) {
      return null;
    }
    const active = tab.id === activeId;
    let leaving = false;
    if (outgoing !== null && outgoing.id === tab.id) {
      leaving = true;
    }
    let on = false;
    if (active || leaving) {
      on = true;
    }
    let swap = "none";
    if (outgoing !== null && active) {
      if (outgoing.forward) {
        swap = "enter-next";
      } else {
        swap = "enter-prev";
      }
    }
    if (leaving) {
      if (outgoing !== null && outgoing.forward) {
        swap = "leave-next";
      } else {
        swap = "leave-prev";
      }
    }
    return (
      <div key={tab.id} className={styles.slot} data-on={on} data-swap={swap} data-scroll>
        {pane}
      </div>
    );
  });

  return <div className={styles.stage}>{slots}</div>;
}
