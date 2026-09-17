import * as Sentry from "@sentry/nextjs";

export type Attributes = Record<string, string | number | boolean>;

type Level = "info" | "warn" | "error";

const ISSUE_LEVELS = { warn: "warning", error: "error" } as const;

function describe(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.message;
  }
  return String(cause);
}

function write(level: Level, message: string, attributes: Attributes): void {
  const line = JSON.stringify({ level, message, ...attributes });
  if (level === "info") {
    console.log(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.error(line);
  }
  Sentry.logger[level](message, attributes);
}

function report(level: "warn" | "error", message: string, attributes: Attributes, cause: unknown): void {
  if (cause === undefined) {
    write(level, message, attributes);
    return;
  }
  const described = describe(cause);
  const withError = { ...attributes, error: described };
  const extra = { message, ...attributes };
  write(level, message, withError);
  Sentry.captureException(cause, { level: ISSUE_LEVELS[level], extra });
}

export function info(message: string, attributes: Attributes = {}): void {
  write("info", message, attributes);
}

export function warn(message: string, attributes: Attributes = {}, cause?: unknown): void {
  report("warn", message, attributes, cause);
}

export function error(message: string, attributes: Attributes = {}, cause?: unknown): void {
  report("error", message, attributes, cause);
}
