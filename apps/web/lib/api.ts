import { error, warn } from "./log";

type Query = Record<string, number>;

const REQUEST_TIMEOUT_MS = 5000;

export class ApiFailure extends Error {
  readonly status: number;

  constructor(path: string, status: number) {
    super(`api ${path} failed: ${status}`);
    this.name = "ApiFailure";
    this.status = status;
  }
}

export function reportApiFailure(message: string, cause: unknown): void {
  if (cause instanceof ApiFailure) {
    warn(message, { status: cause.status });
    return;
  }
  error(message, {}, cause);
}

function origin(): string {
  const value = process.env.API_ORIGIN;
  if (value === undefined) {
    throw new Error("API_ORIGIN is not set");
  }
  if (value === "") {
    throw new Error("API_ORIGIN is empty");
  }
  return value;
}

export async function fetchJson<T>(path: string, query: Query = {}): Promise<T> {
  const base = origin();
  const url = new URL(path, base);
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, String(value));
  }
  const signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const response = await fetch(url, { cache: "no-store", signal });
  if (!response.ok) {
    throw new ApiFailure(path, response.status);
  }
  const body = (await response.json()) as T;
  return body;
}
