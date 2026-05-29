import { format, formatISO, intervalToDuration, isValid, parseISO } from "date-fns";

/** Current instant as ISO-8601 UTC (store timestamps, poll bookkeeping). */
export function nowIso(): string {
  return formatISO(new Date());
}

function parseIsoDate(iso: string): Date | null {
  const parsed = parseISO(iso);
  return isValid(parsed) ? parsed : null;
}

/**
 * Medium date + short time (locale-aware via date-fns default locale).
 * Matches prior `toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })`.
 */
export function formatIsoMediumShort(
  iso: string | null | undefined,
  emptyPlaceholder: string,
): string {
  if (!iso) {
    return emptyPlaceholder;
  }
  const date = parseIsoDate(iso);
  if (!date) {
    return emptyPlaceholder;
  }
  return format(date, "PPp");
}

/** Compact duration for config-card detail rows (e.g. `45 s`, `3 min`, `2 h`). */
export function formatMsDurationCompact(
  ms: number | null | undefined,
  emptyPlaceholder: string,
): string {
  if (ms == null || !Number.isFinite(Number(ms))) {
    return emptyPlaceholder;
  }
  const n = Number(ms);
  const duration = intervalToDuration({ start: 0, end: n });
  if (n < 60_000) {
    const seconds = Math.max(1, duration.seconds ?? Math.round(n / 1000));
    return `${seconds} s`;
  }
  if (n < 3_600_000) {
    const minutes = duration.minutes ?? Math.round(n / 60_000);
    return `${minutes} min`;
  }
  const hours = duration.hours ?? Math.round(n / 3_600_000);
  return `${hours} h`;
}
