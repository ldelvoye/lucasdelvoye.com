import type { ReactElement } from "react";
import { ENTRIES } from "./content";
import { ExperienceSplit } from "./ExperienceSplit";
import { currentMonth, orderRows } from "./shape";

const TAB_ID = "experience";

async function loadPanel() {
  const ordered = orderRows(ENTRIES);
  const now = currentMonth(Date.now());
  return { ordered, now };
}

export async function ExperiencePanel(): Promise<ReactElement> {
  const { ordered, now } = await loadPanel();
  return <ExperienceSplit tabId={TAB_ID} entries={ordered} now={now} />;
}
