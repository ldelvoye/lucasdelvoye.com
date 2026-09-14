"use client";

import { useCallback, useState, type ReactElement } from "react";
import { useListKeys } from "@/components/shell/useListKeys";
import { Box } from "@/components/ui/Box";
import { Prompt } from "@/components/ui/Prompt";
import { Rows, type Row } from "@/components/ui/Rows";
import { relativeTime } from "@/lib/time";
import type { Project } from "contract";
import { ProjectDetail } from "./ProjectDetail";
import { summaryOf } from "./shape";
import styles from "./Projects.module.css";

function metaOf(project: Project, at: number): string {
  const pushed = `pushed ${relativeTime(project.pushedAt, at)}`;
  const stars = `★ ${project.stars}`;
  if (project.primary === null) {
    return `${stars} · ${pushed}`;
  }
  return `${project.primary} · ${stars} · ${pushed}`;
}

export function ProjectsSplit({
  tabId,
  projects,
  at,
}: {
  tabId: string;
  projects: Project[];
  at: number;
}): ReactElement {
  const [selected, setSelected] = useState(0);

  const onMove = useCallback((index: number) => {
    setSelected(index);
  }, []);

  let current: Project | null = null;
  const found = projects[selected];
  if (found !== undefined) {
    current = found;
  }

  let open: string | null = null;
  if (current !== null) {
    open = current.url;
  }

  useListKeys(tabId, {
    count: projects.length,
    selected,
    onMove,
    open,
    onBack: null,
  });

  const rows: Row[] = projects.map((project) => {
    return {
      id: project.name,
      glyph: "▪",
      title: project.name,
      subtitle: project.description,
      meta: metaOf(project, at),
      href: null,
    };
  });

  let detail = (
    <Box title="detail" focused className={styles.detail}>
      <span className={styles.loading}>no projects</span>
    </Box>
  );
  if (current !== null) {
    detail = (
      <Box title={current.name} focused className={styles.detail}>
        <ProjectDetail key={current.name} project={current} />
      </Box>
    );
  }

  return (
    <div className={styles.grid}>
      <Box title="projects" count={projects.length} className={styles.list}>
        <Prompt verb="ls" arg="~/code" className={styles.command} />
        <Rows rows={rows} selected={selected} onSelect={onMove} columns="stack" />
        <p className={styles.foot}>{summaryOf(projects, at)}</p>
      </Box>
      {detail}
    </div>
  );
}
