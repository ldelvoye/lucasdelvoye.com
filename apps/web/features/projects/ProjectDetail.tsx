import Image from "next/image";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { Session } from "@/components/reveal/Session";
import { staggeredDelay } from "@/components/reveal/schedule";
import { KeyValue, type Entry } from "@/components/ui/KeyValue";
import { Tag } from "@/components/ui/Tag";
import type { Project } from "contract";
import { sparklineOf } from "./shape";
import styles from "./Projects.module.css";

const monthFormat = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

function monthOf(iso: string): string {
  const date = new Date(iso);
  const label = monthFormat.format(date);
  return label.toLowerCase();
}

function orNone(value: string | null): string {
  if (value === null) {
    return "none";
  }
  return value;
}

function splitCommand(line: string): { verb: string; arg: string | undefined } {
  const gap = line.indexOf(" ");
  if (gap < 0) {
    return { verb: line, arg: undefined };
  }
  const verb = line.slice(0, gap);
  const arg = line.slice(gap + 1);
  return { verb, arg };
}

function Languages({ project }: { project: Project }): ReactNode {
  if (project.languages.length === 0) {
    return null;
  }
  const segments = project.languages.map((language) => {
    const width = `${language.percent}%`;
    let tint: string | undefined = undefined;
    if (language.tint !== null) {
      tint = language.tint;
    }
    return <i key={language.name} className={styles.seg} data-tint={tint} style={{ width }} />;
  });
  const legend = project.languages.map((language) => `${language.name} ${language.percent}%`);
  return (
    <div className={styles.languages}>
      <span className={styles.langbar}>{segments}</span>
      <span className={styles.legend}>{legend.join(" · ")}</span>
    </div>
  );
}

function Topics({ topics }: { topics: string[] }): ReactNode {
  if (topics.length === 0) {
    return null;
  }
  const tags = topics.map((topic) => <Tag key={topic} label={topic} />);
  return <div className={styles.topics}>{tags}</div>;
}

function Sparkline({ weeks }: { weeks: number[] }): ReactElement {
  if (weeks.length === 0) {
    return <span className={styles.nodata}>no data yet</span>;
  }
  const bars = sparklineOf(weeks).map((share, index) => {
    const height = `${share * 100}%`;
    return <i key={index} style={{ height }} />;
  });
  return <span className={styles.sparkbars}>{bars}</span>;
}

export function ProjectDetail({ project }: { project: Project }): ReactElement {
  const demoLabel = `${project.name} demo`;
  let clip: ReactNode = <span className={styles.frame} role="img" aria-label={demoLabel} />;
  if (project.clip !== null) {
    clip = (
      <span className={styles.frame}>
        <Image
          src={project.clip.src}
          width={project.clip.width}
          height={project.clip.height}
          alt={demoLabel}
          unoptimized
          className={styles.clip}
        />
      </span>
    );
  }

  const entries: Entry[] = [
    { label: "stars", value: String(project.stars), tone: "strong" },
    { label: "forks", value: String(project.forks), tone: "plain" },
    { label: "issues", value: String(project.issues), tone: "plain" },
    { label: "license", value: orNone(project.license), tone: "plain" },
    { label: "release", value: orNone(project.release), tone: "link" },
    { label: "created", value: monthOf(project.createdAt), tone: "plain" },
  ];

  const install = splitCommand(project.install);
  const run = splitCommand(project.run);

  const commits = project.commits.map((commit, index) => (
    <span
      key={commit.sha}
      className={styles.commit}
      data-line
      style={{ "--i": index } as CSSProperties}
    >
      <span className={styles.sha}>{commit.sha}</span>
      <span className={styles.subject}>{commit.subject}</span>
    </span>
  ));

  return (
    <div className={styles.body}>
      <div className={styles.column}>
        <Session
          order={1}
          delay={staggeredDelay(1)}
          verb="gh"
          arg={`repo view ${project.name}`}
          reveal="fade"
          className={styles.command}
        >
          <>
            <p className={styles.sentence}>{project.description}</p>
            <Languages project={project} />
            <span className={styles.caption}>repository</span>
            <KeyValue entries={entries} wide className={styles.kv} />
            <Topics topics={project.topics} />
          </>
        </Session>
        <div className={styles.install}>
          <Session
            order={2}
            delay={staggeredDelay(2)}
            verb={install.verb}
            arg={install.arg}
            reveal="none"
            caret={false}
          />
          <span className={styles.caret} />
        </div>
      </div>
      <div className={styles.column}>
        <Session
          order={3}
          delay={staggeredDelay(3)}
          verb={run.verb}
          arg={run.arg}
          reveal="fade"
          className={styles.command}
        >
          {clip}
        </Session>
      </div>
      <span className={styles.rule} aria-hidden="true" />
      <div className={styles.column}>
        <Session
          order={4}
          delay={staggeredDelay(4)}
          verb="git"
          arg="log --oneline -5"
          reveal="rows"
          className={styles.command}
        >
          <div className={styles.log}>{commits}</div>
        </Session>
      </div>
      <div className={styles.column}>
        <Session
          order={5}
          delay={staggeredDelay(5)}
          verb="git"
          arg="log --since=52.weeks"
          reveal="fade"
          className={styles.command}
        >
          <>
            <div className={styles.sparkhead}>
              <span className={styles.caption}>commits · 52 weeks</span>
              <a className={styles.button} href={project.url} target="_blank" rel="noopener noreferrer">
                <span className={styles.kcap}>o</span> open on github
              </a>
            </div>
            <Sparkline weeks={project.weeks} />
          </>
        </Session>
      </div>
    </div>
  );
}
