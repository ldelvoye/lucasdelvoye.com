import { memo } from "../memo.ts";
import { PROJECTS, type ProjectEntry } from "./content.ts";
import { NotFound, languages, latestRelease, participation, recentCommits, repo, type ApiRepo } from "./github.ts";
import type { Project } from "contract";
import { languagesOf } from "./shape.ts";

const HOUR_MS = 60 * 60 * 1000;

async function loadProject(entry: ProjectEntry): Promise<Project | null> {
  let repository: ApiRepo;
  try {
    repository = await repo(entry.name);
  } catch (error) {
    if (error instanceof NotFound) {
      console.warn(`project ${entry.name} is not on github, skipping it`);
      return null;
    }
    throw error;
  }
  const [bytes, release, commits, weeks] = await Promise.all([
    languages(entry.name),
    latestRelease(entry.name),
    recentCommits(entry.name),
    participation(entry.name),
  ]);
  let description = "";
  if (repository.description !== null) {
    description = repository.description;
  }
  let license: string | null = null;
  if (repository.license !== null) {
    license = repository.license.spdx_id;
  }
  return {
    name: entry.name,
    url: repository.html_url,
    description,
    install: entry.install,
    run: entry.run,
    clip: entry.clip,
    primary: repository.language,
    languages: languagesOf(bytes),
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    issues: repository.open_issues_count,
    license,
    release,
    createdAt: repository.created_at,
    pushedAt: repository.pushed_at,
    topics: repository.topics,
    commits,
    weeks,
  };
}

async function loadAll(): Promise<Project[]> {
  const loaded = await Promise.all(PROJECTS.map(loadProject));
  const present: Project[] = [];
  for (const project of loaded) {
    if (project !== null) {
      present.push(project);
    }
  }
  return present;
}

const all = memo(HOUR_MS, loadAll);

let last: Project[] | null = null;

export async function projects(): Promise<Project[]> {
  try {
    last = await all.get();
    return last;
  } catch (error) {
    if (last === null) {
      throw error;
    }
    console.warn("projects refresh failed, serving the previous list", error);
    return last;
  }
}
