"use client";

import { useEffect, useRef, type ReactElement } from "react";
import { useReducedMotion } from "motion/react";
import type { Clip } from "contract";
import { useReveal } from "@/components/reveal/RevealContext";
import styles from "./Projects.module.css";

export function ProjectClip({ clip, label }: { clip: Clip | null; label: string }): ReactElement {
  const reduced = useReducedMotion();
  const { playing } = useReveal();
  const frame = useRef<HTMLVideoElement | null>(null);

  let source: string | null = null;
  if (clip !== null) {
    source = clip.src;
  }

  // No autoplay: the reveal hides the frame for about a second, long enough to lose the opening.
  useEffect(() => {
    const element = frame.current;
    if (element === null) {
      return;
    }
    let held = false;
    if (reduced === true) {
      held = true;
    }
    if (playing) {
      held = true;
    }
    if (held) {
      element.pause();
      element.currentTime = 0;
      return;
    }
    const started = element.play();
    if (started !== undefined) {
      started.catch(() => undefined);
    }
  }, [reduced, playing, source]);

  if (clip === null) {
    return <span className={styles.frame} role="img" aria-label={label} />;
  }

  const motionAllowed = reduced !== true;
  return (
    <span className={styles.frame}>
      <video
        ref={frame}
        className={styles.clip}
        src={clip.src}
        width={clip.width}
        height={clip.height}
        loop={motionAllowed}
        muted
        playsInline
        preload="auto"
        aria-label={label}
      />
    </span>
  );
}
