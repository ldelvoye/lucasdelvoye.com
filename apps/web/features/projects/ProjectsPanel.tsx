import { connection } from "next/server";
import type { ReactElement } from "react";
import { projects } from "./loader";
import { ProjectsSplit } from "./ProjectsSplit";

const TAB_ID = "projects";

async function loadPanel() {
  const loaded = await projects();
  const at = Date.now();
  return { loaded, at };
}

export async function ProjectsPanel(): Promise<ReactElement> {
  await connection();
  const { loaded, at } = await loadPanel();
  return <ProjectsSplit tabId={TAB_ID} projects={loaded} at={at} />;
}
