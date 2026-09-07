"use client";

import { useEffect, useRef, type ReactElement, type ReactNode } from "react";
import { animate } from "motion/react";
import type { Phase } from "@/components/Site";
import styles from "./Window.module.css";

const OUT_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const IN_EASE: [number, number, number, number] = [0.4, 0, 1, 1];
const DIP_SCALE = 0.972;
const DIP_MS = 130;
const HOLD_MS = 120;
const GROWTH_MS = 440;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function Window({
  phase,
  growing,
  onGrowthStart,
  onGrown,
  children,
}: {
  phase: Phase;
  growing: boolean;
  onGrowthStart: () => void;
  onGrown: () => void;
  children: ReactNode;
}): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (phase !== "expanding") {
      return;
    }
    const element = ref.current;
    if (element === null) {
      return;
    }
    let live = true;

    const run = async () => {
      await animate(element, { scale: DIP_SCALE }, { duration: DIP_MS / 1000, ease: IN_EASE });
      if (!live) {
        return;
      }
      await wait(HOLD_MS);
      if (!live) {
        return;
      }
      onGrowthStart();
      const width = window.innerWidth;
      const height = window.innerHeight;
      await animate(
        element,
        { scale: 1, width, height },
        { duration: GROWTH_MS / 1000, ease: OUT_EASE },
      );
      if (!live) {
        return;
      }
      element.style.removeProperty("width");
      element.style.removeProperty("height");
      element.style.removeProperty("transform");
      onGrown();
    };

    run();
    return () => {
      live = false;
    };
  }, [phase, onGrowthStart, onGrown]);

  return (
    <div
      ref={ref}
      className={styles.window}
      data-window
      data-phase={phase}
      data-grow={growing}
    >
      {children}
    </div>
  );
}
