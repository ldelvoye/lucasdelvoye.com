import { warn } from "./log.ts";

type Entry<T> = { value: T; at: number };

export type MemoOptions = { name: string; ttlMs: number; staleMs: number };

export type Memo<T> = {
  get: () => Promise<T>;
  renew: () => Promise<T>;
};

export function memo<T>(options: MemoOptions, load: () => Promise<T>): Memo<T> {
  let entry: Entry<T> | null = null;
  let inflight: Promise<T> | null = null;

  function isFresh(candidate: Entry<T>): boolean {
    return Date.now() < candidate.at + options.ttlMs;
  }

  function isUsable(candidate: Entry<T>): boolean {
    return Date.now() < candidate.at + options.ttlMs + options.staleMs;
  }

  async function reload(): Promise<T> {
    if (inflight !== null) {
      return inflight;
    }
    inflight = load();
    try {
      const value = await inflight;
      entry = { value, at: Date.now() };
      return value;
    } finally {
      inflight = null;
    }
  }

  async function renew(): Promise<T> {
    try {
      return await reload();
    } catch (cause) {
      if (entry === null) {
        throw cause;
      }
      if (!isUsable(entry)) {
        throw cause;
      }
      const age = Date.now() - entry.at;
      warn("serving a stale value", { memo: options.name, age_ms: age });
      return entry.value;
    }
  }

  async function get(): Promise<T> {
    if (entry !== null) {
      if (isFresh(entry)) {
        return entry.value;
      }
    }
    return renew();
  }

  return { get, renew };
}
