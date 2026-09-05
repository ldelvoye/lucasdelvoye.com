import { describe, expect, it } from "vitest";
import { route } from "../components/shell/keymap";

const context = { tabCount: 3, itemCount: 4, inField: false, withModifier: false };
const idle = { tab: 0, selection: 0, help: false };

describe("route", () => {
  it("wraps tabs at both ends, arrows included", () => {
    expect(route("h", idle, context)).toEqual({ type: "tab", index: 2 });
    expect(route("l", { ...idle, tab: 2 }, context)).toEqual({ type: "tab", index: 0 });
    expect(route("ArrowRight", idle, context)).toEqual({ type: "tab", index: 1 });
    expect(route("ArrowLeft", idle, context)).toEqual({ type: "tab", index: 2 });
  });

  it("clamps selection to the list and needs a list to select or open", () => {
    expect(route("j", { ...idle, selection: 3 }, context)).toEqual({ type: "select", index: 3 });
    expect(route("k", idle, context)).toEqual({ type: "select", index: 0 });
    expect(route("ArrowDown", idle, context)).toEqual({ type: "select", index: 1 });
    expect(route("ArrowUp", { ...idle, selection: 2 }, context)).toEqual({ type: "select", index: 1 });
    const empty = { ...context, itemCount: 0 };
    expect(route("j", idle, empty)).toBeNull();
    expect(route("o", idle, empty)).toBeNull();
    expect(route("o", idle, context)).toEqual({ type: "open" });
  });

  it("ignores keys in text fields, modifier chords, and unknown keys", () => {
    expect(route("l", idle, { ...context, inField: true })).toBeNull();
    expect(route("l", idle, { ...context, withModifier: true })).toBeNull();
    expect(route("x", idle, context)).toBeNull();
  });

  it("help swallows everything except its close keys", () => {
    const open = { ...idle, help: true };
    expect(route("?", idle, context)).toEqual({ type: "help", open: true });
    expect(route("Escape", open, context)).toEqual({ type: "help", open: false });
    expect(route("?", open, context)).toEqual({ type: "help", open: false });
    expect(route("l", open, context)).toBeNull();
  });
});
