import { connection } from "next/server";
import type { ReactElement } from "react";
import { Player } from "@/components/shell/Player";
import { now } from "./loader";
import type { NowPlaying } from "./model";

const DOCK_COVER = 64;

export async function PlayerNow(): Promise<ReactElement> {
  await connection();
  let current: NowPlaying | null = null;
  try {
    current = await now(DOCK_COVER);
  } catch (error) {
    console.error("player could not load", error);
  }
  return <Player now={current} pending={false} />;
}
