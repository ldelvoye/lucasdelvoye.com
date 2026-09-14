import { describe, expect, it } from "vitest";
import { sparklineOf } from "../features/projects/shape";

describe("sparklineOf", () => {
  it("scales weeks to the busiest one and keeps quiet or empty years flat", () => {
    expect(sparklineOf([0, 2, 4])).toEqual([0, 0.5, 1]);
    expect(sparklineOf([0, 0, 0])).toEqual([0, 0, 0]);
    expect(sparklineOf([])).toEqual([]);
  });
});
