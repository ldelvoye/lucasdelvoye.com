"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";
import type { Phase } from "@/components/Site";
import { nextPlayed } from "@/components/reveal/schedule";
import { isWebLink } from "@/components/ui/links";
import { Footer } from "./Footer";
import { PlayerDock } from "./Player";
import { ShellContext, type ListRegistration, type Replay, type ShellState } from "./ShellContext";
import { Stage } from "./Stage";
import { TabStrip } from "./TabStrip";
import { route, type KeyContext, type Registered } from "./keymap";

export type TabInfo = { id: string; label: string };

const PAINT_TABS_MS = 420;
const PAINT_PANE_MS = 530;
const PAINT_PLAYER_MS = 837;

function isTextField(target: EventTarget | null): boolean {
  if (target instanceof HTMLInputElement) {
    return true;
  }
  if (target instanceof HTMLTextAreaElement) {
    return true;
  }
  if (target instanceof HTMLElement) {
    return target.isContentEditable;
  }
  return false;
}

export function Shell({
  version,
  tabs,
  phase,
  intro,
  player,
  children,
}: {
  version: string;
  tabs: TabInfo[];
  phase: Phase;
  intro: ReactNode;
  player: ReactNode;
  children: ReactNode;
}): ReactElement {
  const first = tabs[0];
  const [activeId, setActiveId] = useState(first.id);
  const [registrations, setRegistrations] = useState<Record<string, ListRegistration>>({});
  const [paint, setPaint] = useState(0);
  const [replay, setReplay] = useState<Replay | null>(null);
  const playedRef = useRef<string[]>([]);
  const reduced = useReducedMotion();
  const paintStarted = useRef(false);
  const paintTimers = useRef<number[]>([]);

  const register = useCallback((tabId: string, registration: ListRegistration) => {
    setRegistrations((current) => ({ ...current, [tabId]: registration }));
  }, []);

  const unregister = useCallback((tabId: string) => {
    setRegistrations((current) => {
      const next = { ...current };
      delete next[tabId];
      return next;
    });
  }, []);

  const selectTab = useCallback((tabId: string) => {
    setActiveId(tabId);
    if (reduced === true) {
      return;
    }
    const already = playedRef.current;
    const marked = nextPlayed(already, tabId);
    if (marked === already) {
      return;
    }
    playedRef.current = marked;
    setReplay({ tabId, startedAt: performance.now() });
  }, [reduced]);

  const finishReplay = useCallback((tabId: string) => {
    setReplay((current) => {
      if (current === null) {
        return null;
      }
      if (current.tabId !== tabId) {
        return current;
      }
      return null;
    });
  }, []);

  let registration: ListRegistration | null = null;
  const found = registrations[activeId];
  if (found !== undefined) {
    registration = found;
  }

  const value: ShellState = useMemo(() => {
    return { activeId, tabCount: tabs.length, registration, register, unregister, replay, finishReplay };
  }, [activeId, tabs.length, registration, register, unregister, replay, finishReplay]);

  useEffect(() => {
    if (phase === "intro") {
      return;
    }
    if (paintStarted.current) {
      return;
    }
    paintStarted.current = true;
    let schedule: { at: number; step: number }[] = [
      { at: PAINT_TABS_MS, step: 1 },
      { at: PAINT_PANE_MS, step: 2 },
      { at: PAINT_PLAYER_MS, step: 3 },
    ];
    if (phase === "full") {
      schedule = [{ at: 0, step: 3 }];
    }
    for (const entry of schedule) {
      const timer = window.setTimeout(() => {
        setPaint(entry.step);
        if (entry.step >= 2) {
          selectTab(first.id);
        }
      }, entry.at);
      paintTimers.current.push(timer);
    }
  }, [phase, selectTab, first.id]);

  useEffect(() => {
    const timers = paintTimers.current;
    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  useEffect(() => {
    if (phase !== "full") {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      const withModifier = event.metaKey || event.ctrlKey || event.altKey;
      const inField = isTextField(event.target);
      let registered: Registered = null;
      if (registration !== null) {
        registered = {
          count: registration.count,
          selected: registration.selected,
          hasOpen: registration.open !== null,
          hasBack: registration.onBack !== null,
        };
      }
      const activeIndex = tabs.findIndex((tab) => tab.id === activeId);
      const context: KeyContext = {
        tabCount: tabs.length,
        activeTab: activeIndex,
        registered,
        inField,
        withModifier,
      };
      const action = route(event.key, context);
      if (action === null) {
        return;
      }
      event.preventDefault();
      if (action.type === "tab") {
        const next = tabs[action.index];
        if (next !== undefined) {
          selectTab(next.id);
        }
        return;
      }
      if (registration === null) {
        return;
      }
      if (action.type === "move") {
        registration.onMove(action.index);
        return;
      }
      if (action.type === "open") {
        const href = registration.open;
        if (href === null) {
          return;
        }
        if (isWebLink(href)) {
          window.open(href, "_blank", "noopener");
        } else {
          window.location.assign(href);
        }
        return;
      }
      const back = registration.onBack;
      if (back === null) {
        return;
      }
      back();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [phase, tabs, activeId, registration, selectTab]);

  useEffect(() => {
    if (replay === null) {
      return;
    }
    const tabId = replay.tabId;
    function skip() {
      finishReplay(tabId);
    }
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [replay, finishReplay]);

  return (
    <ShellContext.Provider value={value}>
      <div data-body>
        {intro}
        <div data-dash>
          <TabStrip tabs={tabs} activeId={activeId} onSelect={selectTab} drawn={paint >= 1} />
          <div data-viewport data-region="pane" data-drawn={paint >= 2}>
            <Stage tabs={tabs} activeId={activeId}>
              {children}
            </Stage>
          </div>
          <PlayerDock drawn={paint >= 3}>{player}</PlayerDock>
        </div>
      </div>
      <Footer version={version} />
    </ShellContext.Provider>
  );
}
