import type { RoomLogTone } from "@/types/room.types";

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
