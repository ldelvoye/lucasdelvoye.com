"use client";

import { createContext, useContext } from "react";

export type ListRegistration = {
  count: number;
  selected: number;
  onMove: (index: number) => void;
  open: string | null;
  onBack: (() => void) | null;
};

export type ShellState = {
  activeId: string;
  tabCount: number;
  registration: ListRegistration | null;
  register: (tabId: string, registration: ListRegistration) => void;
  unregister: (tabId: string) => void;
};

function ignore() {
  return undefined;
}

const IDLE: ShellState = {
  activeId: "",
  tabCount: 0,
  registration: null,
  register: ignore,
  unregister: ignore,
};

export const ShellContext = createContext<ShellState>(IDLE);

export function useShell(): ShellState {
  return useContext(ShellContext);
}
