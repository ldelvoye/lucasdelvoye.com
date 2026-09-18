import { connection } from "next/server";
import type { ReactElement } from "react";
import { Session } from "@/components/reveal/Session";
import { staggeredDelay } from "@/components/reveal/schedule";
import { Box } from "@/components/ui/Box";
import { now, recent, topArtists, week } from "./loader";
import { Meters } from "./Meters";
import { NowPlaying } from "./NowPlaying";
import { RecentPlays } from "./RecentPlays";
import { TopArtists } from "./TopArtists";
import { Watch } from "./Watch";
import { reportApiFailure } from "@/lib/api";
import type { NowPlaying as NowPlayingData, TopArtist } from "contract";
import styles from "./Spotify.module.css";

const TAB_ID = "spotify";
const PANE_COVER = 300;
const RECENT_COUNT = 10;
const WATCH_SECONDS = 15;

async function currentOrNone(): Promise<NowPlayingData | null> {
  try {
    return await now(PANE_COVER);
  } catch (cause) {
    reportApiFailure("now playing could not load", cause);
    return null;
  }
}

async function artistsOrNone(): Promise<TopArtist[]> {
  try {
    return await topArtists();
  } catch (cause) {
    reportApiFailure("top artists could not load", cause);
    return [];
  }
}

async function loadPanel() {
  const [current, artists, plays, listening] = await Promise.all([
    currentOrNone(),
    artistsOrNone(),
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
        <Watch at={at} seconds={WATCH_SECONDS}>
          <NowPlaying now={current} at={at} />
        </Watch>
      </Box>
      <Box title="recently played" count={plays.length} className={styles.recent}>
        <RecentPlays key={newest} tabId={TAB_ID} plays={plays} at={at} />
      </Box>
      <Box title="top artists · 4 weeks" className={styles.side}>
        <Session
          order={2}
          delay={staggeredDelay(2)}
          verb="spotify"
          arg="top artists --range 4w"
          reveal="rows"
          className={styles.command}
        >
          <TopArtists artists={artists} />
        </Session>
        <span className={styles.rule} aria-hidden="true" />
        <Session
          order={3}
          delay={staggeredDelay(3)}
          verb="spotify"
          arg="stats --week"
          reveal="rows"
          className={styles.command}
        >
          <Meters mix={listening.mix} timeline={listening.timeline} week={listening.week} />
        </Session>
      </Box>
    </div>
  );
}
