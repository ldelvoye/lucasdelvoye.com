import type { ReactElement } from "react";
import { Box } from "@/components/ui/Box";
import styles from "./Spotify.module.css";

export function SpotifyFallback(): ReactElement {
  return (
    <div className={styles.grid}>
      <Box title="now playing" focused className={styles.now}>
        <span className={styles.loading}>loading…</span>
      </Box>
      <Box title="recently played" className={styles.recent}>
        <span className={styles.loading}>loading…</span>
      </Box>
      <Box title="top artists · 4 weeks" className={styles.side}>
        <span className={styles.loading}>loading…</span>
      </Box>
    </div>
  );
}
