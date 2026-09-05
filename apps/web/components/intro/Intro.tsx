"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { INTRO_SCRIPT, WIPE_MS } from "./script";
import { EMPTY_SCREEN, apply, resolve, schedule, type Event, type Screen } from "./sequence";
import styles from "./Intro.module.css";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function renderLine(line: string): ReactNode {
  if (line.startsWith("==> ")) {
    return (
      <>
        <span className={styles.arrow}>==&gt;</span>
        {line.slice(3)}
      </>
    );
  }
  return line;
}

export function Intro({ onDone }: { onDone: () => void }) {
  const [screen, setScreen] = useState<Screen>(EMPTY_SCREEN);
  const screenRef = useRef<Screen>(EMPTY_SCREEN);
  const pendingRef = useRef<Event[]>([]);

  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION).matches) {
      onDone();
      return;
    }
    pendingRef.current = schedule(INTRO_SCRIPT);
    const start = performance.now();
    let frame = 0;

    function show(next: Screen) {
      screenRef.current = next;
      setScreen(next);
    }

    function tick() {
      const elapsed = performance.now() - start;
      let next = screenRef.current;
      while (pendingRef.current.length > 0 && pendingRef.current[0].at <= elapsed) {
        const event = pendingRef.current.shift();
        if (event !== undefined) {
          next = apply(next, event);
        }
      }
      if (next !== screenRef.current) {
        show(next);
      }
      if (!next.done) {
        frame = requestAnimationFrame(tick);
      }
    }

    function skip() {
      const final = resolve(screenRef.current, pendingRef.current);
      pendingRef.current = [];
      show(final);
    }

    frame = requestAnimationFrame(tick);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [onDone]);

  useEffect(() => {
    if (screen.done) {
      onDone();
    }
  }, [screen.done, onDone]);

  const lines = screen.lines.map((line, index) => (
    <span key={index}>
      {renderLine(line)}
      {"\n"}
    </span>
  ));

  return (
    <motion.div
      className={styles.intro}
      data-intro=""
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: WIPE_MS / 1000, ease: "easeInOut" }}
    >
      <pre className={styles.screen}>
        {lines}
        <span>
          {renderLine(screen.current)}
          <span className={styles.cursor} />
        </span>
      </pre>
    </motion.div>
  );
}
