"use client";

import { Component, useCallback, type ReactElement, type ReactNode } from "react";
import { RevealProvider } from "@/components/reveal/RevealContext";
import { Box } from "@/components/ui/Box";
import styles from "./Pane.module.css";
import { useShell } from "./ShellContext";

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
  const { replay, finishReplay } = useShell();

  let playing = false;
  let startedAt = 0;
  if (replay !== null && replay.tabId === id) {
    playing = true;
    startedAt = replay.startedAt;
  }

  const onDone = useCallback(() => {
    finishReplay(id);
  }, [finishReplay, id]);

  return (
    <section
      className={styles.pane}
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
    >
      <RevealProvider playing={playing} startedAt={startedAt} onDone={onDone}>
        <PanelBoundary label={label}>{children}</PanelBoundary>
      </RevealProvider>
    </section>
  );
}
