"use client";

import { useEffect } from "react";
import { useShell, type ListRegistration } from "./ShellContext";

export function useListKeys(tabId: string, registration: ListRegistration): void {
  const shell = useShell();
  const register = shell.register;
  const unregister = shell.unregister;
  const count = registration.count;
  const selected = registration.selected;
  const onMove = registration.onMove;
  const open = registration.open;
  const onBack = registration.onBack;

  useEffect(() => {
    register(tabId, { count, selected, onMove, open, onBack });
    return () => {
      unregister(tabId);
    };
  }, [register, unregister, tabId, count, selected, onMove, open, onBack]);
}
