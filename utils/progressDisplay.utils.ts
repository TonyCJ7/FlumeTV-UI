import type { TFunction } from "i18next";
import type { RoomSyncProgress } from "@/types/room.types";

/** Integer 0–100 from API `progress.percent`, or `null` when absent. */
export function extractProgressPercent(
  progress: RoomSyncProgress | null | undefined,
): number | null {
  if (progress?.percent == null) {
    return null;
  }
  return Math.round(progress.percent);
}

/**
 * Status tag / detail label for in-progress band.
 * Pass `syncingLabel` from i18n (e.g. `t('ConfigCard.Label_Syncing')`) when `percent` is missing.
 */
export function formatSyncProgressLabel(
  progress: RoomSyncProgress | null | undefined,
  syncingLabel: string,
): string {
  const pct = extractProgressPercent(progress);
  if (pct == null) {
    return syncingLabel;
  }
  return `${pct}%`;
}
