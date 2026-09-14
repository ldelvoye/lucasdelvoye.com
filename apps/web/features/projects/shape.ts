import { relativeTime } from "@/lib/time";
import type { Project } from "contract";

export function sparklineOf(weeks: number[]): number[] {
  let most = 0;
  for (const count of weeks) {
    most = Math.max(most, count);
  }
  if (most === 0) {
    return weeks.map(() => 0);
  }
  return weeks.map((count) => count / most);
}

export function summaryOf(projects: Project[], now: number): string {
  const stars = projects.reduce((sum, project) => sum + project.stars, 0);
  let count = `${projects.length} repositories`;
  if (projects.length === 1) {
    count = "1 repository";
  }
  let latest: string | null = null;
  for (const project of projects) {
    if (latest === null) {
      latest = project.pushedAt;
      continue;
    }
    if (Date.parse(project.pushedAt) > Date.parse(latest)) {
      latest = project.pushedAt;
    }
  }
  if (latest === null) {
    return `${count} · ★ ${stars}`;
  }
  const pushed = relativeTime(latest, now);
  return `${count} · ★ ${stars} · last push ${pushed}`;
}
