import type { TFunction } from "i18next";
import type { UiLogLine } from "@/types/logStream.types";

const BYTE_UNITS = ["B", "KB", "MB", "GB"] as const;

/** Human-readable byte count (base 1024) for log sector progress. */
function formatByteCount(bytes: number): string {
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

export function shouldShowLogSectorProgress(line: UiLogLine): boolean {
  return line.kind === "sector" && line.status === "in_progress";
}

export function buildLogSectorBytesLabel(line: UiLogLine, t: TFunction): string | null {
  if (line.bytesRead == null) {
    return null;
  }

  const read = formatByteCount(line.bytesRead);
  const total = line.bytesTotal != null ? formatByteCount(line.bytesTotal) : null;
  const percent = line.sectorPercent;

  if (total != null && percent != null) {
    return t("ConfigCard.LogDialog_SectorBytesDeterminate", {
      read,
      total,
      percent,
    });
  }

  return t("ConfigCard.LogDialog_SectorBytesIndeterminate", { read });
}
