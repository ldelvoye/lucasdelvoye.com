"use client";

import { useCallback, useState, type ReactNode } from "react";
import { AnimatePresence } from "motion/react";
import type { Tab } from "@/content/tabs";
import { Intro } from "./intro/Intro";
import { Frame } from "./shell/Frame";
import { Shell } from "./shell/Shell";

export function Site({ tabs }: { tabs: Tab[] }) {
  const [introDone, setIntroDone] = useState(false);
  const finish = useCallback(() => setIntroDone(true), []);
  let intro: ReactNode = null;
  if (!introDone) {
    intro = <Intro key="intro" onDone={finish} />;
  }
  return (
    <Frame title="smorg — lucasdelvoye">
      <Shell tabs={tabs} enabled={introDone} />
      <AnimatePresence>{intro}</AnimatePresence>
    </Frame>
  );
}
