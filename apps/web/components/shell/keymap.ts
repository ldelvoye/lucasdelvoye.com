export type Registered = {
  count: number;
  selected: number;
  hasOpen: boolean;
  hasBack: boolean;
} | null;

export type KeyContext = {
  tabCount: number;
  activeTab: number;
  registered: Registered;
  inField: boolean;
  withModifier: boolean;
};

export type Action =
  | { type: "tab"; index: number }
  | { type: "move"; index: number }
  | { type: "open" }
  | { type: "back" };

export function route(key: string, context: KeyContext): Action | null {
  if (context.inField) {
    return null;
  }
  if (context.withModifier) {
    return null;
  }
  if (context.tabCount > 0 && key === "h") {
    const shifted = context.activeTab - 1 + context.tabCount;
    const index = shifted % context.tabCount;
    return { type: "tab", index };
  }
  if (context.tabCount > 0 && key === "l") {
    const shifted = context.activeTab + 1;
    const index = shifted % context.tabCount;
    return { type: "tab", index };
  }
  const registered = context.registered;
  if (registered === null) {
    return null;
  }
  if (key === "j") {
    if (registered.count === 0) {
      return null;
    }
    const last = registered.count - 1;
    const index = Math.min(registered.selected + 1, last);
    return { type: "move", index };
  }
  if (key === "k") {
    if (registered.count === 0) {
      return null;
    }
    const index = Math.max(registered.selected - 1, 0);
    return { type: "move", index };
  }
  if (key === "o") {
    if (!registered.hasOpen) {
      return null;
    }
    return { type: "open" };
  }
  if (key === "Escape") {
    if (!registered.hasBack) {
      return null;
    }
    return { type: "back" };
  }
  return null;
}
