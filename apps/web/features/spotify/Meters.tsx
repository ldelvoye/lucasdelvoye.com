import { Fragment, type ReactElement } from "react";
import { formatDuration } from "./history";
import type { MixEntry, TimelineDay, Week } from "./model";
import styles from "./Spotify.module.css";

function Timeline({ days }: { days: TimelineDay[] }): ReactElement {
  let most = 1;
  for (const day of days) {
    for (const count of day.bins) {
      most = Math.max(most, count);
    }
  }
  const groups = days.map((day, dayIndex) => {
    const bars = day.bins.map((count, binIndex) => {
      const share = (count / most) * 100;
      const height = `${share}%`;
      return <i key={binIndex} className={styles.bin} style={{ height }} />;
    });
    return (
      <div key={dayIndex} className={styles.tday}>
        <span className={styles.bins}>{bars}</span>
        <span className={styles.dlabel}>{day.label}</span>
      </div>
    );
  });
  return (
    <div className={styles.timeline}>
      <span className={styles.caption}>listening timeline · 7 days</span>
      <div className={styles.chart}>{groups}</div>
    </div>
  );
}

export function Meters({
  mix,
  timeline,
  week,
}: {
  mix: MixEntry[];
  timeline: TimelineDay[];
  week: Week;
}): ReactElement {
  if (mix.length === 0) {
    return <p className={styles.note}>no plays yet</p>;
  }

  const meters = mix.map((entry) => {
    const width = `${entry.percent}%`;
    return (
      <Fragment key={entry.artistId}>
        <span className={styles.mlabel}>{entry.name}</span>
        <span className={styles.meter}>
          <i style={{ width }} />
        </span>
        <span className={styles.mval}>{entry.percent}%</span>
      </Fragment>
    );
  });

  return (
    <div className={styles.mix}>
      <span className={styles.caption}>artist mix · this week</span>
      <div className={styles.meters}>{meters}</div>
      <Timeline days={timeline} />
      <p className={styles.note}>
        <b>{week.plays} plays</b>
        <span className={styles.dot}>·</span>
        <b>{formatDuration(week.ms)}</b>
        <span className={styles.dot}>·</span>
        <b>{week.artists} artists</b>
      </p>
    </div>
  );
}
