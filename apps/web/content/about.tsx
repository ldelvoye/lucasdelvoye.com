import styles from "./about.module.css";

export function About() {
  return (
    <div className={styles.about}>
      <p>
        Hi, I&apos;m Lucas. Placeholder for a two sentence introduction: who I am, where I
        work, and what I spend my days on.
      </p>
      <p>
        Placeholder for a second paragraph: side projects, the tools I like, and why this site
        is dressed up as a terminal dashboard.
      </p>
      <dl className={styles.links}>
        <dt>github</dt>
        <dd>
          <a href="https://github.com/ldelvoye">github.com/ldelvoye</a>
        </dd>
        <dt>smorg</dt>
        <dd>
          <a href="https://github.com/ldelvoye/smorg">github.com/ldelvoye/smorg</a>
        </dd>
      </dl>
    </div>
  );
}
