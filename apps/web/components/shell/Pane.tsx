"use client";

import { Component, type ReactElement, type ReactNode } from "react";
import { Box } from "@/components/ui/Box";
import styles from "./Pane.module.css";

type BoundaryProps = { label: string; children: ReactNode };
type BoundaryState = { failed: boolean };

class PanelBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  render(): ReactNode {
    if (this.state.failed) {
      return (
        <Box title={this.props.label}>
          <span className={styles.message}>could not load</span>
        </Box>
      );
    }
    return this.props.children;
  }
}

export function Pane({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}): ReactElement {
  return (
    <section
      className={styles.pane}
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
    >
      <PanelBoundary label={label}>{children}</PanelBoundary>
    </section>
  );
}
