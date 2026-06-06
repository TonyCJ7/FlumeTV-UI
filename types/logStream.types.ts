/**
 * Log dialog UI shapes — SSE payloads live in `room.types.ts` (mirrored from backend).
 */

import type { RoomLogKind, RoomLogSectorStatus, RoomLogTone } from "@/types/room.types";

/** `event: log_reset` on `GET /api/hashes/:hash/logs/stream` (backend Step 26). */
export type RoomLogResetSsePayload = Readonly<{
  hash: string;
}>;

/** One rendered row in the log dialog (Redux `ui.logLines`). */
export type UiLogLine = Readonly<{
  /** Stable React key — `logKey` when present, else `String(seq)`. */
  id: string;
  seq: number;
  message: string;
  /** Display time prefix (`HH:mm:ss`). */
  time: string;
  timestamp: string | null;
  tone: RoomLogTone;
  kind?: RoomLogKind;
  logKey?: string;
  sector?: string;
  status?: RoomLogSectorStatus;
  bytesRead?: number;
  bytesTotal?: number | null;
  sectorPercent?: number | null;
}>;
