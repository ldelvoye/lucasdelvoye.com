"use client";

import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import { Session } from "@/components/reveal/Session";
import { staggeredDelay } from "@/components/reveal/schedule";
import { clockTime } from "./format";
import styles from "./Spotify.module.css";

const TICK_MS = 1000;

export function Watch({
  at,
  seconds,
  children,
}: {
  at: number;
  seconds: number;
  children: ReactNode;
}): ReactElement {
  const [clock, setClock] = useState(() => clockTime(at));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(clockTime(Date.now()));
    }, TICK_MS);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const arg = `-n ${seconds} spotify status`;
  return (
    <Session
      order={0}
      delay={staggeredDelay(0)}
      verb="watch"
      arg={arg}
      trailing={clock}
      reveal="fade"
      className={styles.command}
    >
      {children}
    </Session>
  );
}
