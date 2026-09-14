import { OWNER } from "./content.ts";
import { githubEnv } from "./env.ts";
import type { Commit } from "contract";

export class NotFound extends Error {}

export type ApiRepo = {
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  license: { spdx_id: string } | null;
  created_at: string;
  pushed_at: string;
  topics: string[];
  language: string | null;
};

type ApiRelease = { tag_name: string };
type ApiCommit = { sha: string; commit: { message: string } };
type ApiParticipation = { all: number[] };

const API_VERSION = "2022-11-28";
const USER_AGENT = "lucasdelvoye.com";
const SHA_LENGTH = 7;
const COMMIT_COUNT = 5;

async function get<T>(path: string): Promise<{ status: number; json: T | null }> {
  const env = githubEnv();
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": API_VERSION,
    "User-Agent": USER_AGENT,
  };
  if (env.token !== null) {
    headers.Authorization = `Bearer ${env.token}`;
  }
  const response = await fetch(`${env.apiOrigin}${path}`, { headers });
  if (response.status === 404) {
    throw new NotFound(path);
  }
  if (response.status === 202) {
    return { status: 202, json: null };
  }
  if (!response.ok) {
    throw new Error(`github ${path} failed: ${response.status}`);
  }
  const json = (await response.json()) as T;
  return { status: response.status, json };
}

function repoPath(name: string): string {
  return `/repos/${OWNER}/${name}`;
}

export async function repo(name: string): Promise<ApiRepo> {
  const result = await get<ApiRepo>(repoPath(name));
  if (result.json === null) {
    throw new Error(`github repo ${name} returned no body`);
  }
  return result.json;
}

export async function languages(name: string): Promise<Record<string, number>> {
  const result = await get<Record<string, number>>(`${repoPath(name)}/languages`);
  if (result.json === null) {
    return {};
  }
  return result.json;
}

export async function latestRelease(name: string): Promise<string | null> {
  try {
    const result = await get<ApiRelease>(`${repoPath(name)}/releases/latest`);
    if (result.json === null) {
      return null;
    }
    return result.json.tag_name;
  } catch (error) {
    if (error instanceof NotFound) {
      return null;
    }
    throw error;
  }
}

export async function recentCommits(name: string): Promise<Commit[]> {
  const result = await get<ApiCommit[]>(`${repoPath(name)}/commits?per_page=${COMMIT_COUNT}`);
  if (result.json === null) {
    return [];
  }
  return result.json.map((entry) => {
    const sha = entry.sha.slice(0, SHA_LENGTH);
    const lines = entry.commit.message.split("\n");
    const subject = lines[0];
    return { sha, subject };
  });
}

export async function participation(name: string): Promise<number[]> {
  const result = await get<ApiParticipation>(`${repoPath(name)}/stats/participation`);
  if (result.json === null) {
    return [];
  }
  return result.json.all;
}
