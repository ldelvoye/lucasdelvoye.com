import type { Clip } from "./content";

export type Language = { name: string; percent: number; tint: string | null };
export type Commit = { sha: string; subject: string };

export type Project = {
  name: string;
  url: string;
  description: string;
  install: string;
  run: string;
  clip: Clip | null;
  primary: string | null;
  languages: Language[];
  stars: number;
  forks: number;
  issues: number;
  license: string | null;
  release: string | null;
  createdAt: string;
  pushedAt: string;
  topics: string[];
  commits: Commit[];
  weeks: number[];
};
