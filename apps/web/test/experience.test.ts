import { describe, expect, it } from "vitest";
import { ENTRIES } from "../features/experience/content";
import {
  axisOf,
  monthIndex,
  orderRows,
  shapeOf,
  spanLabel,
  spanOf,
  yearMarks,
  type Month,
} from "../features/experience/shape";

describe("spanLabel", () => {
  it("formats same-year, cross-year, and open-ended spans", () => {
    expect(spanLabel("2025-09", "2025-12")).toBe("Sep – Dec 2025");
    expect(spanLabel("2021-09", "2026-04")).toBe("Sep 2021 – Apr 2026");
    expect(spanLabel("2026-06", null)).toBe("Jun 2026 – now");
  });
});

describe("shapeOf", () => {
  it("marks the ordered list's ends and every internship as a branch", () => {
    const ordered = orderRows(ENTRIES);
    expect(ordered[0]?.company).toBe("Sentry");
    expect(ordered[ordered.length - 1]?.company).toBe("University of Waterloo");

    const shapes = ordered.map((entry, index) => shapeOf(entry, index, ordered.length));
    expect(shapes[0]).toBe("head");
    expect(shapes[shapes.length - 1]).toBe("root");

    ordered.forEach((entry, index) => {
      if (entry.kind === "intern") {
        expect(shapes[index]).toBe("branch");
      }
    });
  });
});

describe("spanOf and yearMarks", () => {
  it("sizes a fixed term by month, closes an open role at the axis end, and marks every January", () => {
    const now: Month = { year: 2026, month: 9 };
    const axis = axisOf(ENTRIES, now);
    const axisStartIndex = monthIndex(axis.start);
    const axisEndIndex = monthIndex(axis.end);
    const axisMonths = axisEndIndex - axisStartIndex;

    const definity = ENTRIES.find((entry) => entry.ref === "definity-2025");
    if (definity === undefined) {
      throw new Error("missing definity-2025 entry");
    }
    const definitySpan = spanOf(definity, axis, now);
    expect(definitySpan.width * axisMonths).toBeCloseTo(4);

    const head = ENTRIES.find((entry) => entry.ref === "HEAD");
    if (head === undefined) {
      throw new Error("missing HEAD entry");
    }
    const headSpan = spanOf(head, axis, now);
    expect(headSpan.left + headSpan.width).toBeCloseTo(1);

    const marks = yearMarks(axis);
    expect(marks.map((mark) => mark.year)).toEqual([2022, 2023, 2024, 2025, 2026]);
  });
});
