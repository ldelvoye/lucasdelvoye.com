"use client";

import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import { Prompt } from "@/components/ui/Prompt";
import { useReveal } from "./RevealContext";
import { commandOffsets, typedAt } from "./schedule";

type Typing = { line: string; offsets: number[] };

function typingFor(line: string): Typing {
  return { line, offsets: commandOffsets(line) };
}

export type Reveal = "fade" | "rows" | "none";

function bodyState(reveal: Reveal): string {
  if (reveal === "rows") {
    return "print";
  }
  if (reveal === "fade") {
    return "fade";
  }
  return "done";
}

export function Session({
  order,
  delay,
  verb,
  arg,
  trailing,
  reveal,
  caret,
  className,
  children,
}: {
  order: number;
  delay: number;
  verb: string;
  arg?: string;
  trailing?: ReactNode;
  reveal: Reveal;
  caret?: boolean;
  className?: string;
  children?: ReactNode;
}): ReactElement {
  const { playing, elapsed, register, unregister } = useReveal();

  let line = verb;
  if (arg !== undefined) {
    line = `${verb} ${arg}`;
  }

  const [typing, setTyping] = useState<Typing>(() => typingFor(line));
  if (typing.line !== line) {
    setTyping(typingFor(line));
  }

  const offsets = typing.offsets;
  let typedFor = 0;
  const last = offsets[offsets.length - 1];
  if (last !== undefined) {
    typedFor = last;
  }
  const endMs = delay + typedFor;

  useEffect(() => {
    register(order, endMs);
    return () => {
      unregister(order);
    };
  }, [order, endMs, register, unregister]);

  let wantsCaret = true;
  if (caret === false) {
    wantsCaret = false;
  }

  let shownVerb = verb;
  let shownArg = arg;
  let shownTrailing = trailing;
  let shownCaret = false;
  let state = "done";

  if (playing) {
    const since = elapsed - delay;
    const typed = typedAt(offsets, since);
    shownCaret = wantsCaret;
    if (typed <= verb.length) {
      shownVerb = verb.slice(0, typed);
      shownArg = undefined;
    } else {
      const argStart = verb.length + 1;
      shownArg = line.slice(argStart, typed);
    }
    if (typed < line.length) {
      shownTrailing = undefined;
      state = "wait";
    } else {
      state = bodyState(reveal);
    }
  }

  let body: ReactNode = null;
  if (children !== undefined) {
    body = <div data-session={state}>{children}</div>;
  }

  return (
    <>
      <Prompt
        verb={shownVerb}
        arg={shownArg}
        trailing={shownTrailing}
        caret={shownCaret}
        className={className}
      />
      {body}
    </>
  );
}
