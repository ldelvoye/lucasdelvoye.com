"use client";

import { useEffect, useState, type ReactElement } from "react";
import { Prompt } from "@/components/ui/Prompt";
import { clockTime } from "./history";
import styles from "./Spotify.module.css";

const TICK_MS = 1000;

export function Watch({ at, seconds }: { at: number; seconds: number }): ReactElement {
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
  return <Prompt verb="watch" arg={arg} trailing={clock} className={styles.command} />;
}
