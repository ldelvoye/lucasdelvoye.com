import type { ReactNode } from "react";
import { About } from "./about";
import { ROLES, roleCard } from "./experience";

export type KeyHint = { key: string; label: string };

export type CardItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  href?: string;
  detail: ReactNode;
};

type TabBase = { id: string; label: string; keys: KeyHint[] };
export type ProseTab = TabBase & { kind: "prose"; body: ReactNode };
export type CardsTab = TabBase & { kind: "cards"; items: CardItem[] };
export type Tab = ProseTab | CardsTab;

export const SHELL_KEYS: KeyHint[] = [{ key: "h/l", label: "tabs" }];
export const HELP_KEY: KeyHint = { key: "?", label: "help" };
export const CARD_KEYS: KeyHint[] = [
  { key: "j/k", label: "select" },
  { key: "o", label: "open" },
];

export async function loadTabs(): Promise<Tab[]> {
  const items = ROLES.map(roleCard);
  return [
    { id: "about", label: "About", kind: "prose", keys: [], body: <About /> },
    { id: "experience", label: "Experience", kind: "cards", keys: CARD_KEYS, items },
  ];
}
