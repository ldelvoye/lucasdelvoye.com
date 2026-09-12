import { connection } from "next/server";
import type { ReactElement } from "react";
import { Box } from "@/components/ui/Box";
import { now, recent, topArtists, week } from "./loader";
import { Meters } from "./Meters";
import { NowPlaying } from "./NowPlaying";
import { RecentPlays } from "./RecentPlays";
import { TopArtists } from "./TopArtists";
import { Watch } from "./Watch";
import styles from "./Spotify.module.css";

const TAB_ID = "spotify";
const PANE_COVER = 300;
const RECENT_COUNT = 10;
const WATCH_SECONDS = 15;

async function loadPanel() {
  const [current, artists, plays, listening] = await Promise.all([
    now(PANE_COVER),
    topArtists(),
    recent(RECENT_COUNT),
    week(),
  ]);
  const at = Date.now();
  return { current, artists, plays, listening, at };
}

export async function SpotifyPanel(): Promise<ReactElement> {
  await connection();
  const { current, artists, plays, listening, at } = await loadPanel();
  let newest = "";
  const latest = plays[0];
  if (latest !== undefined) {
    newest = latest.playedAt;
  }
  return (
    <div className={styles.grid}>
      <Box title="now playing" focused className={styles.now}>
        <Watch at={at} seconds={WATCH_SECONDS} />
        <NowPlaying now={current} at={at} />
      </Box>
      <Box title="recently played" count={plays.length} className={styles.recent}>
        <RecentPlays key={newest} tabId={TAB_ID} plays={plays} at={at} />
      </Box>
      <Box title="top artists · 4 weeks" className={styles.side}>
        <TopArtists artists={artists} />
        <span className={styles.rule} aria-hidden="true" />
        <Meters mix={listening.mix} timeline={listening.timeline} week={listening.week} />
      </Box>
    </div>
  );
}
