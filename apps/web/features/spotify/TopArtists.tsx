import type { CSSProperties, ReactElement } from "react";
import { Cover } from "./Cover";
import type { TopArtist } from "contract";
import styles from "./Spotify.module.css";

export function TopArtists({ artists }: { artists: TopArtist[] }): ReactElement {
  const cells = artists.map((artist, index) => {
    const rank = index + 1;
    return (
      <div
        key={artist.id}
        className={styles.acell}
        data-line
        style={{ "--i": index } as CSSProperties}
      >
        <Cover src={artist.avatar} alt={artist.name} className={styles.avatar} />
        <span className={styles.arank}>#{rank}</span>
        <span className={styles.aname}>{artist.name}</span>
      </div>
    );
  });

  return <div className={styles.shelf}>{cells}</div>;
}
