"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { SETTLE_MS } from "./schedule";

export type RevealState = {
  playing: boolean;
  elapsed: number;
  register: (order: number, endMs: number) => void;
  unregister: (order: number) => void;
};

function ignore() {
  return undefined;
}

const IDLE: RevealState = {
  playing: false,
  elapsed: 0,
  register: ignore,
  unregister: ignore,
};

const RevealContext = createContext<RevealState>(IDLE);

export function useReveal(): RevealState {
  return useContext(RevealContext);
}

export function RevealProvider({
  playing,
  startedAt,
  onDone,
  children,
}: {
  playing: boolean;
  startedAt: number;
  onDone: () => void;
  children: ReactNode;
}): ReactElement {
  const [elapsed, setElapsed] = useState(0);
  const endsRef = useRef<Map<number, number>>(new Map());

  const register = useCallback((order: number, endMs: number) => {
    endsRef.current.set(order, endMs);
  }, []);

  const unregister = useCallback((order: number) => {
    endsRef.current.delete(order);
  }, []);

  useEffect(() => {
    if (!playing) {
      return;
    }
    let total = 0;
    for (const end of endsRef.current.values()) {
      if (end > total) {
        total = end;
      }
    }
    const finish = total + SETTLE_MS;
    let frame = 0;

    function tick() {
      const since = performance.now() - startedAt;
      if (since >= finish) {
        onDone();
        return;
      }
      setElapsed(since);
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [playing, startedAt, onDone]);

  const value: RevealState = useMemo(() => {
    return { playing, elapsed, register, unregister };
  }, [playing, elapsed, register, unregister]);

  return <RevealContext.Provider value={value}>{children}</RevealContext.Provider>;
}
