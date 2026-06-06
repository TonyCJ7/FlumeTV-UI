import type { RoomSyncProgress } from "@/types/room.types";

/** Three UI bands from [Config page: prefetch UX]. */
export type PrefetchUiBand = "refetchAvailable" | "inQueue" | "inProgress";

export type DerivePrefetchUiBandResult = {
  band: PrefetchUiBand;
  progress: RoomSyncProgress | null;
  roomStatus: string | null;
  queuePosition: number | null;
  estimatedWaitMs: number | null;
  triggeredByMe: boolean;
};
