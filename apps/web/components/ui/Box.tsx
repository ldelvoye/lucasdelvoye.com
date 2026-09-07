import type { ReactElement, ReactNode } from "react";
import styles from "./Box.module.css";

export function Box({
  title,
  count,
  focused,
  tone,
  layout,
  className,
  children,
}: {
  title: string;
  count?: number;
  focused?: boolean;
  tone?: "paper" | "pink";
  layout?: "stack" | "row";
  className?: string;
  children: ReactNode;
}): ReactElement {
  let boxTone: "paper" | "pink" = "paper";
  if (tone !== undefined) {
    boxTone = tone;
  }
  let boxLayout: "stack" | "row" = "stack";
  if (layout !== undefined) {
    boxLayout = layout;
  }
  let isFocused = false;
  if (focused === true) {
    isFocused = true;
  }
  let classes = styles.box;
  if (className !== undefined) {
    classes = `${styles.box} ${className}`;
  }
  let countLabel: ReactNode = null;
  if (count !== undefined) {
    countLabel = <span className={styles.count}> ({count})</span>;
  }
  return (
    <section
      className={classes}
      data-box
      data-tone={boxTone}
      data-layout={boxLayout}
      data-focused={isFocused}
    >
      <h2 className={styles.title}>
        {title}
        {countLabel}
      </h2>
      {children}
    </section>
  );
}
