"use client";

import { useEffect, useReducer } from "react";
import { HELP_KEY, SHELL_KEYS, type Tab } from "@/content/tabs";
import { Footer } from "./Footer";
import { HelpOverlay } from "./HelpOverlay";
import { Panel } from "./Panel";
import { TabBar } from "./TabBar";
import { route, type Action } from "./keymap";

type State = { tab: number; selections: number[]; help: boolean };

function reduce(state: State, action: Action): State {
  if (action.type === "tab") {
    return { ...state, tab: action.index };
  }
  if (action.type === "select") {
    const selections = [...state.selections];
    selections[state.tab] = action.index;
    return { ...state, selections };
  }
  if (action.type === "help") {
    return { ...state, help: action.open };
  }
  return state;
}

function isTextField(target: EventTarget | null): boolean {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

function selectedHref(tab: Tab, selection: number): string | undefined {
  if (tab.kind !== "cards") {
    return undefined;
  }
  const item = tab.items[selection];
  if (item === undefined) {
    return undefined;
  }
  return item.href;
}

export function Shell({ tabs, enabled }: { tabs: Tab[]; enabled: boolean }) {
  const [state, dispatch] = useReducer(reduce, {
    tab: 0,
    selections: tabs.map(() => 0),
    help: false,
  });
  const active = tabs[state.tab];
  const selection = state.selections[state.tab];
  let itemCount = 0;
  if (active.kind === "cards") {
    itemCount = active.items.length;
  }

  useEffect(() => {
    if (!enabled) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      const shellState = { tab: state.tab, selection, help: state.help };
      const withModifier = event.metaKey || event.ctrlKey || event.altKey;
      const context = {
        tabCount: tabs.length,
        itemCount,
        inField: isTextField(event.target),
        withModifier,
      };
      const action = route(event.key, shellState, context);
      if (action === null) {
        return;
      }
      event.preventDefault();
      if (action.type === "open") {
        const href = selectedHref(active, selection);
        if (href !== undefined) {
          window.open(href, "_blank", "noopener");
        }
        return;
      }
      dispatch(action);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, state.tab, state.help, selection, itemCount, tabs.length, active]);

  const hints = [...SHELL_KEYS, ...active.keys, HELP_KEY];
  return (
    <>
      <TabBar tabs={tabs} active={state.tab} onSelect={(index) => dispatch({ type: "tab", index })} />
      <Panel
        tabs={tabs}
        active={state.tab}
        selections={state.selections}
        onSelect={(index) => dispatch({ type: "select", index })}
      />
      <Footer hints={hints} />
      <HelpOverlay open={state.help} hints={hints} onClose={() => dispatch({ type: "help", open: false })} />
    </>
  );
}
