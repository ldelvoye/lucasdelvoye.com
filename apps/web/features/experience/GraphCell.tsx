import type { ReactElement } from "react";
import type { Shape } from "./shape";
import styles from "./Experience.module.css";

const LANE_ONE = 8;
const LANE_TWO = 28;
const LANE_SPAN = 40;

const ABOVE = -2;
const BELOW = 102;

function linesOf(shape: Shape): ReactElement[] {
  if (shape === "head") {
    return [
      <line key="trunk" x1={LANE_ONE} y1={50} x2={LANE_ONE} y2={BELOW} />,
      <path key="merge" d="M28 102 C28 70 8 82 8 50" />,
    ];
  }
  if (shape === "root") {
    return [
      <line key="trunk" x1={LANE_ONE} y1={ABOVE} x2={LANE_ONE} y2={50} />,
      <path key="fork" d="M8 50 C8 18 28 30 28 -2" />,
    ];
  }
  if (shape === "branch") {
    return [
      <line key="trunk" x1={LANE_ONE} y1={ABOVE} x2={LANE_ONE} y2={BELOW} />,
      <line key="lane" x1={LANE_TWO} y1={ABOVE} x2={LANE_TWO} y2={BELOW} />,
    ];
  }
  return [<line key="trunk" x1={LANE_ONE} y1={ABOVE} x2={LANE_ONE} y2={BELOW} />];
}

export function GraphCell({ shape }: { shape: Shape }): ReactElement {
  const lines = linesOf(shape);

  let lane = LANE_ONE;
  if (shape === "branch") {
    lane = LANE_TWO;
  }
  const laneFraction = lane / LANE_SPAN;
  const leftPercent = laneFraction * 100;
  const dotStyle = { left: `${leftPercent}%` };

  let dotClass = styles.dot;
  if (shape === "head") {
    dotClass = `${styles.dot} ${styles.dotHead}`;
  }

  return (
    <span className={styles.graph}>
      <svg viewBox="0 0 40 100" preserveAspectRatio="none" className={styles.svg}>
        {lines}
      </svg>
      <span className={dotClass} style={dotStyle} aria-hidden="true" />
    </span>
  );
}
