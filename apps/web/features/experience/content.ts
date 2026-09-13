export type Kind = "work" | "intern" | "edu";

export type Entry = {
  ref: string;
  company: string;
  role: string;
  kind: Kind;
  start: string;
  end: string | null;
  place: string;
  headline: string;
  bullets: string[];
};

export const ENTRIES: Entry[] = [
  {
    ref: "HEAD",
    company: "Sentry",
    role: "Software Engineer",
    kind: "work",
    start: "2026-06",
    end: null,
    place: "San Francisco",
    headline: "Infrastructure and Platforms",
    bullets: [
      "Led zero-downtime Postgres migrations widening Sentry's ID columns for scale.",
      "Drove Redis scalability: enforced a TTL on every cache write and blocked the rest.",
      "Own the sudo breakglass tooling and its Datadog SLOs and synthetics in Terraform.",
    ],
  },
  {
    ref: "bree",
    company: "Bree",
    role: "Software Engineer",
    kind: "intern",
    start: "2025-09",
    end: "2025-12",
    place: "Toronto",
    headline: "Backend Infrastructure & DevOps Automation",
    bullets: [
      "Built the shared service utilities: SQS and pooled FastAPI clients, lazy AWS config.",
      "Owned CI/CD for a twelve-service backend refactor on GitHub Actions and Vitest.",
      "Built zero-cost isolated dev environments: Localstack, PlanetScale branches, Docker.",
    ],
  },
  {
    ref: "definity-2025",
    company: "Definity",
    role: "QA Automation Developer",
    kind: "intern",
    start: "2025-01",
    end: "2025-04",
    place: "Waterloo",
    headline: "CI/CD & Test Infrastructure Engineering",
    bullets: [
      "Redesigned the API endpoint test workflow in Docker on Bitbucket cron jobs.",
      "Led the BrowserStack to LambdaTest device-lab move, saving about $14,000 a year.",
      "Designed and shipped a daily Selenium regression pipeline for the dotCMS pages.",
    ],
  },
  {
    ref: "definity-2024",
    company: "Definity",
    role: "QA Automation Developer",
    kind: "intern",
    start: "2024-01",
    end: "2024-04",
    place: "Waterloo",
    headline: "Mobile Automation & CI Observability",
    bullets: [
      "Shipped Allure reporting on the Sonnet apps' CI pipeline, with root causes.",
      "Refactored the Appium mobile suite from 50 to 80 cases, saving 100+ manual hours.",
    ],
  },
  {
    ref: "flynn",
    company: "Flynn Group of Companies",
    role: "QA Automation Developer",
    kind: "intern",
    start: "2023-05",
    end: "2023-08",
    place: "Toronto",
    headline: "Test Automation & CI Pipelines",
    bullets: [
      "Grew Selenium coverage of the time card app by 50%, cutting regressions by 7 hours.",
      "Built a weekly end-to-end Selenium pipeline for the client web pages.",
      "Pioneered the mobile test suite for the project management app in Java and Appium.",
    ],
  },
  {
    ref: "brickeye",
    company: "Brickeye",
    role: "Frontend Developer",
    kind: "intern",
    start: "2022-09",
    end: "2022-11",
    place: "North York",
    headline: "Mobile Analytics & Automation Enablement",
    bullets: [
      "Built the app's user event monitoring: event logging and measurable product data.",
      "Used it to find where users got stuck and to decide which features to support.",
    ],
  },
  {
    ref: "electrovaya",
    company: "Electrovaya",
    role: "Firmware Testing Engineer",
    kind: "intern",
    start: "2022-01",
    end: "2022-04",
    place: "Mississauga",
    headline: "Firmware Testing & QA Leadership",
    bullets: [
      "Tested firmware on battery controller boards: the safety systems of lithium-ion packs.",
    ],
  },
  {
    ref: "waterloo",
    company: "University of Waterloo",
    role: "BASc, Computer Engineering",
    kind: "edu",
    start: "2021-09",
    end: "2026-04",
    place: "Waterloo",
    headline: "Computer Engineering, six co-op terms",
    bullets: [
      "Earned a BASc in Computer Engineering with six co-op terms.",
      "Won the capstone Prototype Excellence Award with the FeetBack design project.",
    ],
  },
];
