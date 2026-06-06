import type { RoomLogKind, RoomLogSectorStatus, RoomLogTone } from "@/types/room.types";

/** Matches backend `LOG_REPLAY_MAX_LINES` in `roomLogStream.db.ts`. */
export const LOG_STREAM_RING_BUFFER_MAX = 500;

/** Frozen log `tone` literals for SSE parsing (mirrors backend `ROOM_LOG_TONES`). */
export const ROOM_LOG_TONES: readonly RoomLogTone[] = [
  "default",
  "error",
  "warning",
  "success",
  "info",
] as const;

/** Frozen log `kind` literals for SSE parsing (mirrors backend sector/text contract). */
export const ROOM_LOG_KINDS: readonly RoomLogKind[] = ["text", "sector"] as const;

/** Frozen sector `status` literals for structured log SSE parsing. */
export const ROOM_LOG_SECTOR_STATUSES: readonly RoomLogSectorStatus[] = [
  "pending",
  "in_progress",
  "success",
  "error",
] as const;
