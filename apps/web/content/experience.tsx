import type { CardItem } from "./tabs";
import styles from "./experience.module.css";

export type Role = {
  company: string;
  title: string;
  start: string;
  end: string;
  location: string;
  url: string;
  bullets: string[];
};

export const ROLES: Role[] = [
  {
    company: "Placeholder Co",
    title: "Placeholder title",
    start: "2025",
    end: "present",
    location: "Placeholder city",
    url: "https://example.com",
    bullets: [
      "Placeholder bullet: one line on what the role covered.",
      "Placeholder bullet: one line on something shipped.",
      "Placeholder bullet: one line on scale or impact.",
    ],
  },
  {
    company: "Placeholder Inc",
    title: "Placeholder title",
    start: "2023",
    end: "2025",
    location: "Placeholder city",
    url: "https://example.com",
    bullets: [
      "Placeholder bullet: one line on what the role covered.",
      "Placeholder bullet: one line on something shipped.",
    ],
  },
  {
    company: "Placeholder Labs",
    title: "Placeholder title",
    start: "2021",
    end: "2023",
    location: "Placeholder city",
    url: "https://example.com",
    bullets: ["Placeholder bullet: one line on what the role covered."],
  },
];

export function roleCard(role: Role): CardItem {
  const id = role.company.toLowerCase().replace(/\s+/g, "-");
  const bullets = role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>);
  return {
    id,
    title: role.company,
    subtitle: role.title,
    meta: `${role.start} – ${role.end}`,
    href: role.url,
    detail: (
      <div className={styles.role}>
        <p className={styles.where}>
          {role.title} · {role.location}
        </p>
        <ul className={styles.bullets}>{bullets}</ul>
      </div>
    ),
  };
}
