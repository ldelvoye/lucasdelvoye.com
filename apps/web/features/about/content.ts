export type Link = { id: string; label: string; value: string; href: string | null };

export const HOST_USER = "lucas";
export const HOST_NAME = "sf";

export const FOCUS: string[] = ["infrastructure", "developer tooling"];

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
  {
    id: "email",
    label: "Email",
    value: "delvoye02lucas@gmail.com",
    href: "mailto:delvoye02lucas@gmail.com",
  },
];
