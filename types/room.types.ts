/**
 * Room / sync progress — mirrored from `../FlumeTV-API/src/types/room.types.ts`.
 * HTTP and SSE use camelCase `progress`; SQLite uses `sync_*` columns server-side.
 */

/** Persisted on `room.last_outcome` — result of the most recent finished sync run. */
export type RoomLastOutcome = "cancelled" | "completed" | "failed" | "error";

/** Log line color contract for `/logs/stream` (`event: log` payload field `tone`). */
export type RoomLogTone = "default" | "error" | "warning" | "success" | "info";

export type RoomLogKind = "text" | "sector";

export type RoomLogSectorStatus = "pending" | "in_progress" | "success" | "error";

/** Structured prefetch log line on log SSE and in `room_log_line` replay (backend Step 27). */
export type RoomLogSsePayload = Readonly<{
  seq: number;
  line: string;
  tone: RoomLogTone;
  kind?: RoomLogKind;
  logKey?: string;
  sector?: string;
  status?: RoomLogSectorStatus;
  bytesRead?: number;
  bytesTotal?: number | null;
  sectorPercent?: number | null;
}>;

/** Assembled from `room.sync_*` on list, prefetch-status, room SSE, and log SSE. */
export type RoomSyncProgress = {
  /** Integer 0–100, monotonic non-decreasing within one room run. */
  percent: number;
  /** e.g. `auth` | `live` | `vod` | `series` | `m3u` | `db` */
  phase?: string;
  bytesRead?: number;
  /** `null` when `Content-Length` is unavailable. */
  bytesTotal?: number | null;
};
