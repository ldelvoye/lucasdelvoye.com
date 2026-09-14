const TIME_ZONE = "America/Los_Angeles";

const weekdayFormat = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, weekday: "short" });

const dayKeyFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const hourMinuteFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hourCycle: "h23",
  hour: "2-digit",
  minute: "2-digit",
});

const clockDisplayFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hourCycle: "h23",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export function logTime(iso: string, now: number): string {
  const time = Date.parse(iso);
  const clock = hourMinuteFormat.format(time);
  if (dayKeyFormat.format(time) === dayKeyFormat.format(now)) {
    return clock;
  }
  const weekday = weekdayFormat.format(time);
  return `${weekday.toLowerCase()} ${clock}`;
}

export function clockTime(time: number): string {
  const weekday = weekdayFormat.format(time);
  const clock = clockDisplayFormat.format(time);
  return `${weekday.toLowerCase()} ${clock}`;
}

export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) {
    return `${rest}m`;
  }
  return `${hours}h ${rest}m`;
}
