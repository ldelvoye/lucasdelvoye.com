import { describe, expect, it } from "vitest";
import { route, type KeyContext, type Registered } from "../components/shell/keymap";

const listed: Registered = { count: 4, selected: 0, hasOpen: true, hasBack: true };

const base: KeyContext = {
  tabCount: 3,
  activeTab: 0,
  registered: listed,
  inField: false,
  withModifier: false,
};

describe("route", () => {
  it("wraps the tab keys at both ends", () => {
    expect(route("h", base)).toEqual({ type: "tab", index: 2 });
    expect(route("l", { ...base, activeTab: 2 })).toEqual({ type: "tab", index: 0 });
    expect(route("l", base)).toEqual({ type: "tab", index: 1 });
  });

  it("clamps the selection to the registered count", () => {
    expect(route("j", base)).toEqual({ type: "move", index: 1 });
    expect(route("j", { ...base, registered: { ...listed, selected: 3 } })).toEqual({
      type: "move",
      index: 3,
    });
    expect(route("k", base)).toEqual({ type: "move", index: 0 });
    expect(route("k", { ...base, registered: { ...listed, selected: 2 } })).toEqual({
      type: "move",
      index: 1,
    });
  });

  it("offers open and back only when the list registered them", () => {
    expect(route("o", base)).toEqual({ type: "open" });
    expect(route("Escape", base)).toEqual({ type: "back" });
    const bare: Registered = { count: 4, selected: 0, hasOpen: false, hasBack: false };
    expect(route("o", { ...base, registered: bare })).toBeNull();
    expect(route("Escape", { ...base, registered: bare })).toBeNull();
  });

  it("does nothing without a registration, in a field, with a modifier, or on ? and arrows", () => {
    const none = { ...base, registered: null };
    expect(route("j", none)).toBeNull();
    expect(route("o", none)).toBeNull();
    expect(route("l", none)).toEqual({ type: "tab", index: 1 });
    expect(route("l", { ...base, inField: true })).toBeNull();
    expect(route("l", { ...base, withModifier: true })).toBeNull();
    expect(route("?", base)).toBeNull();
    expect(route("ArrowDown", base)).toBeNull();
    expect(route("x", base)).toBeNull();
  });
});
