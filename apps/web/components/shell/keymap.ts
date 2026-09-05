export type ShellState = { tab: number; selection: number; help: boolean };

export type KeyContext = { tabCount: number; itemCount: number; inField: boolean };

export type Action =
  | { type: "tab"; index: number }
  | { type: "select"; index: number }
  | { type: "open" }
  | { type: "help"; open: boolean };

const ALIASES: Record<string, string> = {
  ArrowLeft: "h",
  ArrowRight: "l",
  ArrowUp: "k",
  ArrowDown: "j",
};

function canonical(key: string): string {
  const alias = ALIASES[key];
  if (alias !== undefined) {
    return alias;
  }
  return key;
}

export function route(key: string, state: ShellState, context: KeyContext): Action | null {
  if (context.inField) {
    return null;
  }
  if (state.help) {
    if (key === "Escape" || key === "?") {
      return { type: "help", open: false };
    }
    return null;
  }
  const pressed = canonical(key);
  const { tabCount, itemCount } = context;
  if (pressed === "h") {
    const index = (state.tab - 1 + tabCount) % tabCount;
    return { type: "tab", index };
  }
  if (pressed === "l") {
    const index = (state.tab + 1) % tabCount;
    return { type: "tab", index };
  }
  if (pressed === "?") {
    return { type: "help", open: true };
  }
  if (itemCount === 0) {
    return null;
  }
  if (pressed === "j") {
    const index = Math.min(state.selection + 1, itemCount - 1);
    return { type: "select", index };
  }
  if (pressed === "k") {
    const index = Math.max(state.selection - 1, 0);
    return { type: "select", index };
  }
  if (pressed === "o") {
    return { type: "open" };
  }
  return null;
}
