import type { Language } from "contract";

const TINTS: Record<string, string> = {
  Python: "mint",
  JavaScript: "violet",
  TypeScript: "blue",
};

type Share = { name: string; exact: number };

function tintOf(name: string): string | null {
  const tint = TINTS[name];
  if (tint === undefined) {
    return null;
  }
  return tint;
}

export function languagesOf(bytes: Record<string, number>): Language[] {
  const entries = Object.entries(bytes).filter(([, count]) => count > 0);
  entries.sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  if (total === 0) {
    return [];
  }
  const shares: Share[] = entries.map(([name, count]) => {
    return { name, exact: (count / total) * 100 };
  });
  const percents = shares.map((share) => Math.floor(share.exact));
  const floored = percents.reduce((sum, percent) => sum + percent, 0);
  let remainder = 100 - floored;
  const byFraction = shares.map((share, index) => {
    return { index, fraction: share.exact - percents[index] };
  });
  byFraction.sort((a, b) => b.fraction - a.fraction);
  for (const slot of byFraction) {
    if (remainder === 0) {
      break;
    }
    percents[slot.index] += 1;
    remainder -= 1;
  }
  const languages = shares.map((share, index) => {
    return { name: share.name, percent: percents[index], tint: tintOf(share.name) };
  });
  return languages.filter((language) => language.percent > 0);
}
