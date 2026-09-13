import type { Entry } from "./content";

const MONTH_ABBREVIATIONS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type Month = { year: number; month: number };
export type Shape = "head" | "trunk" | "branch" | "root";
export type Axis = { start: Month; end: Month };

export function parseMonth(value: string): Month {
  const parts = value.split("-");
  const yearText = parts[0];
  const monthText = parts[1];
  const year = Number(yearText);
  const month = Number(monthText);
  return { year, month };
}

export function monthIndex(month: Month): number {
  return month.year * 12 + month.month - 1;
}

function addMonth(month: Month): Month {
  let year = month.year;
  let next = month.month + 1;
  if (next > 12) {
    next = 1;
    year += 1;
  }
  return { year, month: next };
}

function abbreviate(month: Month): string {
  const label = MONTH_ABBREVIATIONS[month.month - 1];
  return label;
}

export function orderRows(entries: Entry[]): Entry[] {
  const rows = entries.slice();
  rows.sort((a, b) => {
    const aMonth = parseMonth(a.start);
    const bMonth = parseMonth(b.start);
    const aIndex = monthIndex(aMonth);
    const bIndex = monthIndex(bMonth);
    return bIndex - aIndex;
  });
  return rows;
}

export function shapeOf(entry: Entry, index: number, count: number): Shape {
  if (entry.kind === "intern") {
    return "branch";
  }
  if (index === 0) {
    return "head";
  }
  if (index === count - 1) {
    return "root";
  }
  return "trunk";
}

export function spanLabel(start: string, end: string | null): string {
  const startMonth = parseMonth(start);
  const startLabel = abbreviate(startMonth);

  if (end === null) {
    return `${startLabel} ${startMonth.year} – now`;
  }

  const endMonth = parseMonth(end);
  const endLabel = abbreviate(endMonth);

  if (startMonth.year === endMonth.year) {
    return `${startLabel} – ${endLabel} ${endMonth.year}`;
  }
  return `${startLabel} ${startMonth.year} – ${endLabel} ${endMonth.year}`;
}

export function axisOf(entries: Entry[], now: Month): Axis {
  let earliest: Month | null = null;
  for (const entry of entries) {
    const start = parseMonth(entry.start);
    if (earliest === null) {
      earliest = start;
      continue;
    }
    const startIndex = monthIndex(start);
    const earliestIndex = monthIndex(earliest);
    if (startIndex < earliestIndex) {
      earliest = start;
    }
  }

  let axisStart: Month;
  if (earliest === null) {
    axisStart = now;
  } else {
    axisStart = earliest;
  }

  const axisEnd = addMonth(now);
  return { start: axisStart, end: axisEnd };
}

export function spanOf(entry: Entry, axis: Axis, now: Month): { left: number; width: number } {
  const axisStartIndex = monthIndex(axis.start);
  const axisEndIndex = monthIndex(axis.end);
  const axisWidth = axisEndIndex - axisStartIndex;

  const startMonth = parseMonth(entry.start);
  const startIndex = monthIndex(startMonth);

  let effectiveEnd: Month;
  if (entry.end !== null) {
    effectiveEnd = parseMonth(entry.end);
  } else {
    effectiveEnd = now;
  }
  const rightEdge = addMonth(effectiveEnd);
  const rightIndex = monthIndex(rightEdge);

  const left = (startIndex - axisStartIndex) / axisWidth;
  const width = (rightIndex - startIndex) / axisWidth;
  return { left, width };
}

export function yearMarks(axis: Axis): { year: number; left: number }[] {
  const axisStartIndex = monthIndex(axis.start);
  const axisEndIndex = monthIndex(axis.end);
  const axisWidth = axisEndIndex - axisStartIndex;

  let firstYear = axis.start.year;
  if (axis.start.month > 1) {
    firstYear += 1;
  }

  const marks: { year: number; left: number }[] = [];
  for (let year = firstYear; year <= axis.end.year; year++) {
    const january: Month = { year, month: 1 };
    const januaryIndex = monthIndex(january);
    if (januaryIndex >= axisEndIndex) {
      break;
    }
    const left = (januaryIndex - axisStartIndex) / axisWidth;
    marks.push({ year, left });
  }
  return marks;
}

export function currentMonth(at: number): Month {
  const date = new Date(at);
  const year = date.getUTCFullYear();
  const monthNumber = date.getUTCMonth() + 1;
  return { year, month: monthNumber };
}
