import type { Entry } from "@/components/ui/KeyValue";

export type Link = { id: string; label: string; value: string; href: string | null };

export const HOST_USER = "lucas";
export const HOST_NAME = "sf";

export const PORTRAIT_SRC = "/portrait.svg";
export const PORTRAIT_SIZE = 32;

export const FACTS: Entry[] = [
  { label: "name", value: "Lucas Delvoye", tone: "strong" },
  { label: "role", value: "Software Engineer", tone: "plain" },
  { label: "location", value: "San Francisco", tone: "plain" },
  { label: "focus", value: "infrastructure · developer tooling", tone: "plain" },
  { label: "source", value: "github.com/ldelvoye", tone: "link" },
];

export const BIO: string[] = [
  "I'm a software engineer in San Francisco. I work on infrastructure and developer tooling, and I like building things that live in the terminal.",
  "Outside work I make small tools for myself, and most of them end up open source.",
];

export const LINKS: Link[] = [
  { id: "github", label: "GitHub", value: "ldelvoye", href: "https://github.com/ldelvoye" },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "lucas-delvoye",
    href: "https://www.linkedin.com/in/lucas-delvoye/",
  },
  { id: "email", label: "Email", value: "say hello", href: null },
];
