import type { Project } from "contract";
import { ROUTES } from "contract";
import { fetchJson } from "@/lib/api";

export function projects(): Promise<Project[]> {
  return fetchJson(ROUTES.projects);
}
