type Entry<T> = { value: T; expiresAt: number };

export function memo<T>(ttlMs: number, load: () => Promise<T>): () => Promise<T> {
  let entry: Entry<T> | null = null;
  let inflight: Promise<T> | null = null;
  return async () => {
    const now = Date.now();
    if (entry !== null) {
      if (entry.expiresAt > now) {
        return entry.value;
      }
    }
    if (inflight !== null) {
      return inflight;
    }
    inflight = load();
    try {
      const value = await inflight;
      entry = { value, expiresAt: Date.now() + ttlMs };
      return value;
    } finally {
      inflight = null;
    }
  };
}

export function memoBy<T>(
  ttlMs: number,
  cap: number,
  load: (key: string) => Promise<T>,
): (key: string) => Promise<T> {
  const entries = new Map<string, Entry<T>>();
  const inflight = new Map<string, Promise<T>>();
  return async (key: string) => {
    const now = Date.now();
    const found = entries.get(key);
    if (found !== undefined) {
      if (found.expiresAt > now) {
        return found.value;
      }
      entries.delete(key);
    }
    const pending = inflight.get(key);
    if (pending !== undefined) {
      return pending;
    }
    const promise = load(key);
    inflight.set(key, promise);
    try {
      const value = await promise;
      entries.set(key, { value, expiresAt: Date.now() + ttlMs });
      while (entries.size > cap) {
        const oldest = entries.keys().next();
        if (oldest.done) {
          break;
        }
        entries.delete(oldest.value);
      }
      return value;
    } finally {
      inflight.delete(key);
    }
  };
}
