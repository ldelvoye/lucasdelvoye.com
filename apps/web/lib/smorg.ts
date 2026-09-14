import type { Smorg } from "contract";
import { ROUTES, SMORG_FALLBACK_VERSION } from "contract";
import { fetchJson } from "@/lib/api";

export async function smorgVersion(): Promise<string> {
  try {
    const smorg = await fetchJson<Smorg>(ROUTES.smorg);
    return smorg.version;
  } catch (error) {
    console.warn("smorg version unavailable from the api, using the pinned one", error);
    return SMORG_FALLBACK_VERSION;
  }
}
