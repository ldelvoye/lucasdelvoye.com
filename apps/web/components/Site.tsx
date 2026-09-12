"use client";

import { useCallback, useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { Atmosphere } from "./page/Atmosphere";
import { Intro } from "./intro/Intro";
import { Shell, type TabInfo } from "./shell/Shell";
import { Chrome } from "./window/Chrome";
import { Window } from "./window/Window";

export type Phase = "intro" | "expanding" | "full";

export function Site({
  version,
  tabs,
  player,
  children,
}: {
  version: string;
  tabs: TabInfo[];
  player: ReactNode;
  children: ReactNode;
}): ReactElement {
  const [phase, setPhase] = useState<Phase>("intro");
  const [growing, setGrowing] = useState(false);
  const reduced = useReducedMotion();
  const reducedAppliedRef = useRef(false);

  useEffect(() => {
    if (reduced !== true) {
      return;
    }
    if (reducedAppliedRef.current) {
      return;
    }
    reducedAppliedRef.current = true;
    setPhase("full");
    setGrowing(true);
  }, [reduced]);

  const finishIntro = useCallback(() => {
    setPhase((current) => {
      if (current !== "intro") {
        return current;
      }
      return "expanding";
    });
  }, []);

  const startGrowth = useCallback(() => {
    setGrowing(true);
  }, []);

  const finishGrowth = useCallback(() => {
    setPhase("full");
  }, []);

  let atmosphere: ReactNode = null;
  let intro: ReactNode = null;
  if (phase !== "full") {
    atmosphere = <Atmosphere dimmed={growing} />;
    intro = <Intro version={version} onDone={finishIntro} leaving={growing} />;
  }

  return (
    <>
      {atmosphere}
      <Window
        phase={phase}
        growing={growing}
        onGrowthStart={startGrowth}
        onGrown={finishGrowth}
      >
        <Chrome version={version} />
        <Shell version={version} tabs={tabs} phase={phase} intro={intro} player={player}>
          {children}
        </Shell>
      </Window>
    </>
  );
}
