import type { ComponentType } from "react";
import { AboutPanel } from "./about/AboutPanel";
import { SpotifyFallback } from "./spotify/SpotifyFallback";
import { SpotifyPanel } from "./spotify/SpotifyPanel";

export type TabEntry = { id: string; label: string; Panel: ComponentType; Fallback: ComponentType | null };

export const TABS: TabEntry[] = [
  { id: "about", label: "about", Panel: AboutPanel, Fallback: null },
  { id: "spotify", label: "spotify", Panel: SpotifyPanel, Fallback: SpotifyFallback },
];
