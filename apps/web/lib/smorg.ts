import { memo } from "./memo";

export const PINNED_VERSION = "1.5.0";

const LATEST_RELEASE = "https://github.com/ldelvoye/smorg/releases/latest";
const TAG_PATH = /\/releases\/tag\/v([0-9]+\.[0-9]+\.[0-9]+)$/;
const VERSION_TTL_MS = 60 * 60 * 1000;
const LOOKUP_TIMEOUT_MS = 3000;

async function lookupVersion(): Promise<string> {
  const response = await fetch(LATEST_RELEASE, {
    method: "HEAD",
    redirect: "manual",
    signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
  });
  const location = response.headers.get("location");
  if (location === null) {
    throw new Error(`no redirect from ${LATEST_RELEASE}`);
  }
  const match = TAG_PATH.exec(location);
  if (match === null) {
    throw new Error(`unexpected release location ${location}`);
  }
  return match[1];
}

const latest = memo(VERSION_TTL_MS, async (): Promise<string> => {
  try {
    return await lookupVersion();
  } catch (error) {
    console.warn("smorg version lookup failed, using the pinned one", error);
    return PINNED_VERSION;
  }
});

export function smorgVersion(): Promise<string> {
  return latest.get();
}
