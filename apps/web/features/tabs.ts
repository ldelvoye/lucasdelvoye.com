import type { ComponentType } from "react";
import { AboutPanel } from "./about/AboutPanel";

export type TabEntry = { id: string; label: string; Panel: ComponentType };

export const TABS: TabEntry[] = [{ id: "about", label: "about", Panel: AboutPanel }];
