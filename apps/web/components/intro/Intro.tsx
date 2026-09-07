"use client";

import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { INTRO_SCRIPT, PROMPT } from "./script";
import { EMPTY_SCREEN, apply, resolve, schedule, type Event, type Screen } from "./sequence";
import styles from "./Intro.module.css";

const URL_MARK = "https://";
const BEER = "🍺";

function isDrawn(event: Event): boolean {
  if (event.kind === "clear") {
    return false;
  }
  if (event.kind === "done") {
    return false;
  }
  return true;
}

function renderPrompt(line: string): ReactNode {
  const rest = line.slice(PROMPT.length);
  return (
    <>
      {"~ "}
      <span className={styles.prompt}>$</span>
      {" "}
      {rest}
    </>
  );
}

function renderStep(line: string): ReactNode {
  const body = line.slice(4);
  const mark = body.indexOf(URL_MARK);
  if (mark < 0) {
    return (
      <span className={styles.step}>
        <span className={styles.arrow}>==&gt;</span> {body}
      </span>
    );
  }
  const head = body.slice(0, mark);
  const url = body.slice(mark);
  return (
    <span className={styles.step}>
      <span className={styles.arrow}>==&gt;</span> {head}
      <span className={styles.url}>{url}</span>
    </span>
  );
}

function renderProgress(line: string): ReactNode {
  const gap = line.indexOf(" ");
  if (gap < 0) {
    return <span className={styles.hash}>{line}</span>;
  }
  const hashes = line.slice(0, gap);
  const percent = line.slice(gap);
  return (
    <>
      <span className={styles.hash}>{hashes}</span>
      <span className={styles.percent}>{percent}</span>
    </>
  );
}

function renderDone(line: string): ReactNode {
  const colon = line.indexOf(":");
  if (colon < 0) {
    return <span className={styles.done}>{line}</span>;
  }
  const head = line.slice(0, 3);
  const path = line.slice(3, colon);
  const tail = line.slice(colon);
  return (
    <span className={styles.done}>
      {head}
      <span className={styles.cellar}>{path}</span>
      {tail}
    </span>
  );
}

function renderLine(line: string): ReactNode {
  if (line.startsWith(PROMPT)) {
    return renderPrompt(line);
  }
  if (line.startsWith("==> ")) {
    return renderStep(line);
  }
  if (line.startsWith("#")) {
    return renderProgress(line);
  }
  if (line.startsWith(BEER)) {
    return renderDone(line);
  }
  return line;
}

export function Intro({
  onDone,
  leaving,
}: {
  onDone: () => void;
  leaving: boolean;
}): ReactElement {
  const [screen, setScreen] = useState<Screen>(EMPTY_SCREEN);
  const screenRef = useRef<Screen>(EMPTY_SCREEN);
  const pendingRef = useRef<Event[]>([]);

  useEffect(() => {
    pendingRef.current = schedule(INTRO_SCRIPT);
    const start = performance.now();
    let frame = 0;
    let running = true;

    function show(next: Screen) {
      screenRef.current = next;
      setScreen(next);
    }

    function finish() {
      running = false;
      cancelAnimationFrame(frame);
      onDone();
    }

    function tick() {
      const elapsed = performance.now() - start;
      let next = screenRef.current;
      let finished = false;
      while (pendingRef.current.length > 0 && pendingRef.current[0].at <= elapsed) {
        const event = pendingRef.current.shift();
        if (event === undefined) {
          break;
        }
        if (event.kind === "done") {
          finished = true;
        } else if (isDrawn(event)) {
          next = apply(next, event);
        }
      }
      if (next !== screenRef.current) {
        show(next);
      }
      if (finished) {
        finish();
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    function skip() {
      if (!running) {
        return;
      }
      const drawable = pendingRef.current.filter(isDrawn);
      const final = resolve(screenRef.current, drawable);
      pendingRef.current = [];
      show(final);
      finish();
    }

    frame = requestAnimationFrame(tick);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("touchstart", skip);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("touchstart", skip);
    };
  }, [onDone]);

  const lines = screen.lines.map((line, index) => (
    <span key={index}>
      {renderLine(line)}
      {"\n"}
    </span>
  ));

  return (
    <div className={styles.intro} data-intro data-leaving={leaving}>
      <pre className={styles.screen}>
        {lines}
        <span>
          {renderLine(screen.current)}
          <span className={styles.caret} />
        </span>
      </pre>
    </div>
  );
}
