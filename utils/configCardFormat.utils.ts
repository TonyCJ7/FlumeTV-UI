import type { TFunction } from "i18next";
import type { RoomLastOutcome } from "@/types/room.types";
import type { RoomSyncProgress } from "@/types/room.types";
import type { PrefetchUiBand } from "@/utils/prefetchUiBand.utils";
import { formatIsoMediumShort, formatMsDurationCompact } from "@/utils/dateTime.utils";
import { classifyKnownRoomClosedReason } from "@/utils/roomClosedReason.utils";
import { extractProgressPercent } from "@/utils/progressDisplay.utils";

export const CONFIG_CARD_EMPTY_PLACEHOLDER = "—";

export function formatDurationMs(ms: number | null | undefined): string {
  return formatMsDurationCompact(ms, CONFIG_CARD_EMPTY_PLACEHOLDER);
}

export function formatIsoNice(iso: string | null | undefined): string {
  return formatIsoMediumShort(iso, CONFIG_CARD_EMPTY_PLACEHOLDER);
}

/** Approximate queue execution instant from wait duration (for title-row warning tooltip). */
export function formatApproxExecuteTime(
  estimatedWaitMs: number | null | undefined,
  nowMs: number = Date.now(),
): string | null {
  if (estimatedWaitMs == null || !Number.isFinite(Number(estimatedWaitMs))) {
    return null;
  }
  return formatIsoMediumShort(new Date(nowMs + Number(estimatedWaitMs)).toISOString(), "");
}

export function formatQueuedActionToast(
  t: TFunction,
  queuePosition: number,
  estimatedWaitMs: number | null | undefined,
  keys: Readonly<{ withWait: string; withoutWait: string }>,
): string {
  const wait = estimatedWaitMs != null ? formatDurationMs(estimatedWaitMs) : null;
  if (wait) {
    return t(keys.withWait, { position: queuePosition, duration: wait });
  }
  return t(keys.withoutWait, { position: queuePosition });
}

export function isLastOutcomeWithFailureDetail(
  outcome: RoomLastOutcome | null | undefined,
): outcome is "failed" | "error" {
  return outcome === "failed" || outcome === "error";
}

export function formatPrefetchTerminalStatus(
  outcome: RoomLastOutcome | null | undefined,
  t: TFunction,
): string {
  if (!outcome) {
    return CONFIG_CARD_EMPTY_PLACEHOLDER;
  }
  const keyByOutcome: Record<RoomLastOutcome, string> = {
    completed: "ConfigCard.Terminal_Completed",
    failed: "ConfigCard.Terminal_Failed",
    error: "ConfigCard.Terminal_Error",
    cancelled: "ConfigCard.Terminal_Cancelled",
  };
  const key = keyByOutcome[outcome];
  return key ? t(key) : outcome;
}

type FormatRoomCurrentStatusLabels = Readonly<{
  syncing: string;
  formatSyncingWithPercent: (percent: number) => string;
  labelRunning: string;
  labelFetching: string;
  labelInQueue: string;
  labelIdleReady: string;
}>;

/**
 * Human-readable label for the live prefetch band on config cards.
 * Terminal `room.status` values are transient before reset to `idle`; use `lastOutcome` for history.
 */
export function formatRoomCurrentStatus(
  params: Readonly<{
    band: PrefetchUiBand;
    roomStatus: string | null;
    progress: RoomSyncProgress | null;
    labels: FormatRoomCurrentStatusLabels;
  }>,
): string {
  const { band, roomStatus, progress, labels } = params;

  if (band === "inProgress") {
    const progressPct = extractProgressPercent(progress);
    if (progressPct != null) {
      return labels.formatSyncingWithPercent(progressPct);
    }
    if (roomStatus === "fetching") {
      return labels.labelFetching;
    }
    if (roomStatus === "running") {
      return labels.labelRunning;
    }
    return labels.syncing;
  }

  if (band === "inQueue") {
    return labels.labelInQueue;
  }

  return labels.labelIdleReady;
}

/** Known slugs / worker prefix → i18n; any other non-empty string is shown as-is. */
export function formatRoomClosedReason(
  closedReason: string | null | undefined,
  t: TFunction,
): string {
  if (!closedReason) {
    return CONFIG_CARD_EMPTY_PLACEHOLDER;
  }

  const known = classifyKnownRoomClosedReason(closedReason);
  if (!known) {
    return closedReason;
  }

  if (known.kind === "worker_no_result") {
    return t(known.i18nKey, { hint: known.hint });
  }

  return t(known.i18nKey);
}
