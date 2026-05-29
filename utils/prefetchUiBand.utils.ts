import type { ConfigListItem, ConfigPrefetchStatusEntry } from "@/types/rest.types";
import type { RoomSyncProgress } from "@/types/room.types";
import { IN_PROGRESS_ROOM_STATUSES } from "@/constants/room.constants";

/** Three UI bands from [Config page: prefetch UX]. */
export type PrefetchUiBand = "refetchAvailable" | "inQueue" | "inProgress";

const IN_PROGRESS_ROOM_STATUS_SET = new Set<string>(IN_PROGRESS_ROOM_STATUSES);

type DerivePrefetchUiBandInput = {
  listItem: ConfigListItem;
  prefetchEntry?: ConfigPrefetchStatusEntry | null;
};

export type DerivePrefetchUiBandResult = {
  band: PrefetchUiBand;
  progress: RoomSyncProgress | null;
  roomStatus: string | null;
  queuePosition: number | null;
  estimatedWaitMs: number | null;
  triggeredByMe: boolean;
};

/**
 * Pure band derivation for config cards.
 * Prefers prefetch-status snapshot when present; falls back to list `roomStatus`.
 */
export function derivePrefetchUiBand({
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
