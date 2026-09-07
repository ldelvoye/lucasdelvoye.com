export const SMORG_VERSION = "1.4.4";
export const PROMPT = "~ $ ";
export const INTRO_BUDGET_MS = 5000;
export const EXPANSION_MS = 690;

export type Step =
  | { kind: "print"; text: string }
  | { kind: "type"; text: string; charDelay?: number }
  | { kind: "enter" }
  | { kind: "pause"; ms: number }
  | { kind: "clear" };

const TARBALL = `https://github.com/ldelvoye/smorg/releases/download/v${SMORG_VERSION}/smorg-${SMORG_VERSION}.tar.gz`;
const CELLAR = `/opt/homebrew/Cellar/smorg/${SMORG_VERSION}`;

export const INTRO_SCRIPT: Step[] = [
  { kind: "print", text: PROMPT },
  { kind: "pause", ms: 250 },
  { kind: "type", text: "brew install smorg" },
  { kind: "pause", ms: 150 },
  { kind: "enter" },
  { kind: "pause", ms: 200 },
  { kind: "print", text: "==> Fetching ldelvoye/tap/smorg" },
  { kind: "enter" },
  { kind: "pause", ms: 250 },
  { kind: "print", text: `==> Downloading ${TARBALL}` },
  { kind: "enter" },
  { kind: "type", text: "#".repeat(72), charDelay: 10 },
  { kind: "print", text: " 100.0%" },
  { kind: "enter" },
  { kind: "pause", ms: 250 },
  { kind: "print", text: "==> Installing smorg from ldelvoye/tap" },
  { kind: "enter" },
  { kind: "pause", ms: 450 },
  { kind: "print", text: `🍺  ${CELLAR}: 12 files, 1.2MB, built in 3 seconds` },
  { kind: "enter" },
  { kind: "pause", ms: 350 },
  { kind: "print", text: PROMPT },
  { kind: "pause", ms: 250 },
  { kind: "type", text: "smorg" },
  { kind: "pause", ms: 200 },
  { kind: "enter" },
  { kind: "pause", ms: 100 },
  { kind: "clear" },
];
