type Entry<T> = { value: T; expiresAt: number };

export type Memo<T> = {
  get: () => Promise<T>;
  refresh: () => Promise<T>;
};

export function memo<T>(ttlMs: number, load: () => Promise<T>): Memo<T> {
  let entry: Entry<T> | null = null;
  let inflight: Promise<T> | null = null;

  async function refresh(): Promise<T> {
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
  }

  async function get(): Promise<T> {
    const now = Date.now();
    if (entry !== null) {
      if (entry.expiresAt > now) {
        return entry.value;
      }
    }
    return refresh();
  }

  return { get, refresh };
}
