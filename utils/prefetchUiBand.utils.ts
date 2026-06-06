import { IN_PROGRESS_ROOM_STATUSES } from "@/constants/room.constants";
import type { MergedConfigRow } from "@/types/configCard.types";
import type { DerivePrefetchUiBandResult, PrefetchUiBand } from "@/types/prefetchUiBand.types";
import type { ConfigListItem, ConfigPrefetchStatusEntry } from "@/types/rest.types";

const IN_PROGRESS_ROOM_STATUS_SET = new Set<string>(IN_PROGRESS_ROOM_STATUSES);

type DerivePrefetchUiBandInput = {
  listItem: ConfigListItem;
  prefetchEntry?: ConfigPrefetchStatusEntry | null;
};

/**
 * Pure band derivation for config cards.
 * Prefers prefetch-status snapshot when present; falls back to list `roomStatus`.
 */
function derivePrefetchUiBand({
  listItem,
  prefetchEntry,
}: DerivePrefetchUiBandInput): DerivePrefetchUiBandResult {
  const roomStatus = prefetchEntry?.room.status ?? listItem.roomStatus ?? null;
  const queuePosition = prefetchEntry?.queuePosition ?? null;
  const estimatedWaitMs = prefetchEntry?.estimatedWaitMs ?? null;
  const triggeredByMe = prefetchEntry?.triggeredByMe ?? listItem.triggeredByMe;
  const progress = prefetchEntry?.progress ?? listItem.progress ?? null;

  let band: PrefetchUiBand = "refetchAvailable";

  if (queuePosition != null || roomStatus === "queued") {
    band = "inQueue";
  }

  if (roomStatus != null && IN_PROGRESS_ROOM_STATUS_SET.has(roomStatus)) {
    band = "inProgress";
  }

  if (prefetchEntry?.isTerminal === true && band === "inProgress") {
    band = queuePosition != null || roomStatus === "queued" ? "inQueue" : "refetchAvailable";
  }

  return {
    band,
    progress,
    roomStatus,
    queuePosition,
    estimatedWaitMs,
    triggeredByMe,
  };
}

export function mergeConfigRow(
  item: ConfigListItem,
  prefetchEntry: ConfigPrefetchStatusEntry | undefined,
): MergedConfigRow {
  const bandFields = derivePrefetchUiBand({ listItem: item, prefetchEntry });

  return {
    item,
    prefetchEntry,
    bandFields,
    nextTriggerAt: prefetchEntry?.nextTriggerAt ?? item.scheduler?.nextTriggerAt ?? null,
    lastSyncedAt: prefetchEntry?.lastSyncedAt ?? item.lastSyncedAt ?? null,
    lastOutcome: prefetchEntry?.room.lastOutcome ?? item.roomLastOutcome ?? null,
    closedReason: prefetchEntry?.room.closedReason ?? null,
    roomUpdatedAt: prefetchEntry?.room.updatedAt ?? null,
  };
}
