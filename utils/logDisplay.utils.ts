import type { TFunction } from "i18next";
import type { UiLogLine } from "@/types/logStream.types";
import { formatByteCount } from "@/utils/byteFormat.utils";

export function shouldShowLogSectorProgress(line: UiLogLine): boolean {
  return line.kind === "sector" && line.status === "in_progress";
}

export function isLogSectorProgressDeterminate(line: UiLogLine): boolean {
  return line.sectorPercent != null;
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
