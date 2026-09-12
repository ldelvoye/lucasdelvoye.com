"use client";

import { useCallback, useState, type ReactElement } from "react";
import { Rows, type Row } from "@/components/ui/Rows";
import { useListKeys } from "@/components/shell/useListKeys";
import { LINKS } from "./content";

export function AboutLinks({
  tabId,
  className,
}: {
  tabId: string;
  className?: string;
}): ReactElement {
  const [selected, setSelected] = useState(0);

  const onMove = useCallback((index: number) => {
    setSelected(index);
  }, []);

  let open: string | null = null;
  const link = LINKS[selected];
  if (link !== undefined) {
    open = link.href;
  }

  useListKeys(tabId, {
    count: LINKS.length,
    selected,
    onMove,
    open,
    onBack: null,
  });

  const rows: Row[] = LINKS.map((entry) => {
    return {
      id: entry.id,
      glyph: "↗",
      title: entry.label,
      subtitle: null,
      meta: entry.value,
      href: entry.href,
    };
  });

  return (
    <div className={className}>
      <Rows rows={rows} selected={selected} onSelect={onMove} columns="ls" />
    </div>
  );
}
