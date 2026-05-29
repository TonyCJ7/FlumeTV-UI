const BYTE_UNITS = ["B", "KB", "MB", "GB"] as const;

/** Human-readable byte count (base 1024) for log sector progress. */
export function formatByteCount(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }

  if (bytes < 1024) {
    return `${Math.round(bytes)} B`;
  }

  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < BYTE_UNITS.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;

  return `${rounded} ${BYTE_UNITS[unitIndex]}`;
}
