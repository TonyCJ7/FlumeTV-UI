import type { TFunction } from "i18next";
import { CONFIG_CARD_EMPTY_PLACEHOLDER } from "@/constants/config.constants";
import {
  ROOM_CLOSED_REASON_I18N_KEYS,
  ROOM_CLOSED_REASON_WORKER_NO_RESULT_PREFIX,
} from "@/constants/room.constants";
import type {
  ConfigCardDetailFormatters,
  ConfigSourceCardStatusLabels,
} from "@/types/configCard.types";
import type { PrefetchUiBand } from "@/types/prefetchUiBand.types";
import type { KnownRoomClosedReason, RoomLastOutcome, RoomSyncProgress } from "@/types/room.types";
import { formatIsoMediumShort, formatMsDurationCompact } from "@/utils/dateTime.utils";

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
 * Log dialog title progress: prefer the fresher/higher source and clear stale % after sync finishes.
 * Log SSE patches the list item; prefetch-status SSE can overwrite prefetch entry with throttled lag.
 */
export function resolveLogDialogSyncProgress(
  prefetchEntry:
    | {
        progress: RoomSyncProgress | null;
        room: { status: string | null; lastOutcome: RoomLastOutcome | null };
      }
    | undefined,
  listItem:
    | {
        progress: RoomSyncProgress | null;
        roomStatus: string | null;
        roomLastOutcome: RoomLastOutcome | null;
      }
    | undefined,
): RoomSyncProgress | null {
  const roomStatus = prefetchEntry?.room.status ?? listItem?.roomStatus ?? null;
  const lastOutcome = prefetchEntry?.room.lastOutcome ?? listItem?.roomLastOutcome ?? null;

  if (roomStatus === "idle" || roomStatus === null) {
    if (lastOutcome === "completed") {
      return null;
    }
  }

  const listProgress = listItem?.progress ?? null;
  const prefetchProgress = prefetchEntry?.progress ?? null;
  const listPct = extractProgressPercent(listProgress);
  const prefetchPct = extractProgressPercent(prefetchProgress);

  if (listPct == null && prefetchPct == null) {
    return null;
  }
  if (listPct == null) {
    return prefetchProgress;
  }
  if (prefetchPct == null) {
    return listProgress;
  }
  return listPct >= prefetchPct ? listProgress : prefetchProgress;
}

/**
 * Returns i18n metadata when `closedReason` is a known API slug or
 * `prefetch_worker_no_result:${hint}`; otherwise `null` (show raw string).
 */
function classifyKnownRoomClosedReason(closedReason: string): KnownRoomClosedReason | null {
  const exactKey = ROOM_CLOSED_REASON_I18N_KEYS[closedReason];
  if (exactKey) {
    return { kind: "exact", i18nKey: exactKey };
  }

  if (closedReason.startsWith(ROOM_CLOSED_REASON_WORKER_NO_RESULT_PREFIX)) {
    const hint = closedReason.slice(ROOM_CLOSED_REASON_WORKER_NO_RESULT_PREFIX.length);
    if (hint.length > 0) {
      return {
        kind: "worker_no_result",
        hint,
        i18nKey: "ConfigCard.ClosedReason_PrefetchWorkerNoResult",
      };
    }
  }

  return null;
}

export function buildConfigCardFormatters(t: TFunction): ConfigCardDetailFormatters {
  return {
    formatIso: formatIsoNice,
    formatDuration: formatDurationMs,
    formatTerminal: (outcome: RoomLastOutcome | null | undefined) =>
      formatPrefetchTerminalStatus(outcome, t),
    formatClosedReason: (closedReason: string | null | undefined) =>
      formatRoomClosedReason(closedReason, t),
  };
}

type ConfigSourceCardStatusLabelInput = Readonly<{
  syncing: string;
  labelRunning: string;
  labelFetching: string;
  labelInQueue: string;
  labelIdleReady: string;
  labelLastOutcome: string;
}>;

export function buildConfigSourceCardStatusLabels(
  labels: ConfigSourceCardStatusLabelInput,
  t: TFunction,
): ConfigSourceCardStatusLabels {
  return {
    syncing: labels.syncing,
    formatSyncingWithPercent: (percent: number) =>
      t("ConfigCard.Label_SyncingWithPercent", { percent }),
    labelRunning: labels.labelRunning,
    labelFetching: labels.labelFetching,
    labelInQueue: labels.labelInQueue,
    labelIdleReady: labels.labelIdleReady,
    labelLastOutcome: labels.labelLastOutcome,
  };
}

function formatDurationMs(ms: number | null | undefined): string {
  return formatMsDurationCompact(ms, CONFIG_CARD_EMPTY_PLACEHOLDER);
}

function formatIsoNice(iso: string | null | undefined): string {
  return formatIsoMediumShort(iso, CONFIG_CARD_EMPTY_PLACEHOLDER);
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

function formatPrefetchTerminalStatus(
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
function formatRoomClosedReason(closedReason: string | null | undefined, t: TFunction): string {
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
