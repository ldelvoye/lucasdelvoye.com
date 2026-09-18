import type { Clip } from "contract";

export type ProjectEntry = { name: string; install: string; run: string; clip: Clip | null };

export const OWNER = "ldelvoye";

export const PROJECTS: ProjectEntry[] = [
  { name: "smorg", install: "brew install ldelvoye/tap/smorg", run: "smorg", clip: null },
  {
    name: "taco-shells",
    install: "git clone https://github.com/ldelvoye/taco-shells",
    run: "taco",
    clip: null,
  },
  {
    name: "lucasdelvoye.com",
    install: "git clone https://github.com/ldelvoye/lucasdelvoye.com",
    run: "open https://lucasdelvoye.com",
    clip: { src: "/projects/lucasdelvoye-com.mp4", width: 1280, height: 720 },
  },
];
