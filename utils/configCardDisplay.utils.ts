import type { MergedConfigRow } from "@/store/prefetchStatus/prefetchStatusSelectors";
import type {
  ConfigCardDetailFormatters,
  ConfigCardDetailRowLabels,
  ConfigSourceCardCtaVisibility,
  ConfigSourceCardLastOutcomeVariant,
  ConfigSourceCardStatusDisplay,
  ConfigSourceCardStatusLabels,
  ConfigSourceCardStatusVariant,
} from "@/types/configCard.types";
import {
  CONFIG_CARD_EMPTY_PLACEHOLDER,
  formatRoomCurrentStatus,
  isLastOutcomeWithFailureDetail,
} from "@/utils/configCardFormat.utils";
import type { RoomLastOutcome } from "@/types/room.types";
import type { PrefetchUiBand } from "@/utils/prefetchUiBand.utils";
import { extractProgressPercent } from "@/utils/progressDisplay.utils";

function buildLastOutcomeDetailRows(
  outcomeLabel: string,
  lastOutcome: RoomLastOutcome | null,
  closedReason: string | null,
  detailLabel: string,
  formatters: ConfigCardDetailFormatters,
): ReadonlyArray<readonly [string, string]> {
  const rows: Array<readonly [string, string]> = [
    [outcomeLabel, formatters.formatTerminal(lastOutcome)],
  ];
  if (isLastOutcomeWithFailureDetail(lastOutcome) && closedReason) {
    rows.push([detailLabel, formatters.formatClosedReason(closedReason)]);
  }
  return rows;
}

export function bandToStatusVariant(band: PrefetchUiBand): ConfigSourceCardStatusVariant {
  if (band === "inQueue") {
    return "queue";
  }
  if (band === "inProgress") {
    return "work";
  }
  return "idle";
}

export function lastOutcomeToTagVariant(
  outcome: RoomLastOutcome,
): ConfigSourceCardLastOutcomeVariant {
  if (outcome === "completed") {
    return "success";
  }
  if (outcome === "failed" || outcome === "error") {
    return "danger";
  }
  return "neutral";
}

export function buildConfigSourceCardStatusDisplay(
  row: MergedConfigRow,
  labels: ConfigSourceCardStatusLabels,
  formatTerminal: ConfigCardDetailFormatters["formatTerminal"],
): ConfigSourceCardStatusDisplay {
  const { bandFields, lastOutcome } = row;
  const primary = formatRoomCurrentStatus({
    band: bandFields.band,
    roomStatus: bandFields.roomStatus,
    progress: bandFields.progress,
    labels,
  });
  const hideLastOutcome = bandFields.band === "inProgress";
  const lastOutcomeLabel =
    !hideLastOutcome && lastOutcome ? formatTerminal(lastOutcome) : null;
  const lastOutcomeVariant =
    !hideLastOutcome && lastOutcome ? lastOutcomeToTagVariant(lastOutcome) : null;
  return { primary, lastOutcomeLabel, lastOutcomeVariant };
}

/**
 * Title-row prefetch warning when streams were never synced.
 * Hidden when `lastSyncedAt` exists or prefetch is queued / in progress.
 */
export function shouldShowConfigCardPrefetchWarning(row: MergedConfigRow): boolean {
  if (row.lastSyncedAt) {
    return false;
  }
  const band = row.bandFields.band;
  if (band === "inProgress" || band === "inQueue") {
    return false;
  }
  return true;
}

export function buildConfigSourceCardCtaVisibility(
  row: MergedConfigRow,
): ConfigSourceCardCtaVisibility {
  const { bandFields, prefetchEntry } = row;
  const band = bandFields.band;
  return {
    showRefetch: band === "refetchAvailable",
    showCancel: (band === "inQueue" || band === "inProgress") && bandFields.triggeredByMe,
    showLogs: prefetchEntry?.hasLogs === true,
  };
}

/** Build detail `<dl>` rows for the config card status popover (container supplies i18n labels). */
export function buildConfigCardDetailRows(
  row: MergedConfigRow,
  labels: ConfigCardDetailRowLabels,
  formatters: ConfigCardDetailFormatters,
  statusLabels: ConfigSourceCardStatusLabels,
): ReadonlyArray<readonly [string, string]> {
  const { bandFields, closedReason, lastSyncedAt, lastOutcome, nextTriggerAt, roomUpdatedAt } = row;
  const band = bandFields.band;
  const progressPct = extractProgressPercent(bandFields.progress);
  const progressValue = progressPct != null ? `${progressPct}%` : labels.syncing;
  const currentStatusRow: readonly [string, string] = [
    labels.detailCurrentStatus,
    formatRoomCurrentStatus({
      band,
      roomStatus: bandFields.roomStatus,
      progress: bandFields.progress,
      labels: statusLabels,
    }),
  ];

  if (band === "inProgress") {
    return [
      currentStatusRow,
      [labels.detailProgress, progressValue],
      ...buildLastOutcomeDetailRows(
        labels.detailLastOutcome,
        lastOutcome,
        closedReason,
        labels.detailOutcomeDetail,
        formatters,
      ),
      [labels.detailTriggered, formatters.formatIso(roomUpdatedAt)],
      [
        labels.detailEstComplete,
        progressPct != null ? labels.detailEstCompleteApprox : labels.detailEstCompleteUnavailable,
      ],
    ];
  }

  if (band === "inQueue") {
    const position =
      bandFields.queuePosition != null
        ? `#${bandFields.queuePosition}`
        : CONFIG_CARD_EMPTY_PLACEHOLDER;
    return [
      currentStatusRow,
      [labels.detailQueuePosition, position],
      [labels.detailEstWait, formatters.formatDuration(bandFields.estimatedWaitMs)],
      [labels.detailLastPrefetch, formatters.formatIso(lastSyncedAt)],
      ...buildLastOutcomeDetailRows(
        labels.detailLastOutcome,
        lastOutcome,
        closedReason,
        labels.detailOutcomeDetail,
        formatters,
      ),
    ];
  }

  return [
    currentStatusRow,
    [labels.detailNextScheduled, formatters.formatIso(nextTriggerAt)],
    [labels.detailLastPrefetch, formatters.formatIso(lastSyncedAt)],
    ...buildLastOutcomeDetailRows(
      labels.detailLastOutcome,
      lastOutcome,
      closedReason,
      labels.detailOutcomeDetail,
      formatters,
    ),
  ];
}
