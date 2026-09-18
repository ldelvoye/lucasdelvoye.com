"use client";

import { useEffect, useRef, type ReactElement } from "react";
import { useReducedMotion } from "motion/react";
import type { Clip } from "contract";
import styles from "./Projects.module.css";

export function ProjectClip({ clip, label }: { clip: Clip | null; label: string }): ReactElement {
  const reduced = useReducedMotion();
  const frame = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (reduced !== true) {
      return;
    }
    const element = frame.current;
    if (element === null) {
      return;
    }
    element.pause();
    element.currentTime = 0;
  }, [reduced, clip]);

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
        autoPlay={motionAllowed}
        loop={motionAllowed}
        muted
        playsInline
        preload="metadata"
        aria-label={label}
      />
    </span>
  );
}
