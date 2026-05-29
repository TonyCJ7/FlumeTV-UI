/** Steady-state when no sync is active (mirrors FlumeTV-API `IDLE_ROOM_STATUS`). */
export const IDLE_ROOM_STATUS = "idle" as const;

/** Active sync statuses that block duplicate enqueue (mirrors FlumeTV-API). */
export const IN_PROGRESS_ROOM_STATUSES = ["running", "fetching"] as const;

/** Transient room states before reset to `idle` (mirrors FlumeTV-API). */
export const TERMINAL_ROOM_STATUSES = ["cancelled", "completed", "failed", "error"] as const;

export function isTerminalRoomStatus(status: string | null | undefined): boolean {
  if (status == null) {
    return false;
  }
  return (TERMINAL_ROOM_STATUSES as readonly string[]).includes(status);
}

/** Known `room.closed_reason` slugs from FlumeTV-API (exact match → i18n). */
export const ROOM_CLOSED_REASON_USER_CANCELLED = "user_cancelled" as const;
export const ROOM_CLOSED_REASON_CONFIG_DELETED = "config_deleted" as const;
export const ROOM_CLOSED_REASON_PROCESS_RESTARTED = "process_restarted" as const;
export const ROOM_CLOSED_REASON_PREFETCH_SYNC_FAILED = "prefetch_sync_failed" as const;

/** Prefix for worker exits with no parseable result — suffix is a free-text hint. */
export const ROOM_CLOSED_REASON_WORKER_NO_RESULT_PREFIX = "prefetch_worker_no_result:" as const;

export const ROOM_CLOSED_REASON_I18N_KEYS: Readonly<Record<string, string>> = {
  [ROOM_CLOSED_REASON_USER_CANCELLED]: "ConfigCard.ClosedReason_UserCancelled",
  [ROOM_CLOSED_REASON_CONFIG_DELETED]: "ConfigCard.ClosedReason_ConfigDeleted",
  [ROOM_CLOSED_REASON_PROCESS_RESTARTED]: "ConfigCard.ClosedReason_ProcessRestarted",
  [ROOM_CLOSED_REASON_PREFETCH_SYNC_FAILED]: "ConfigCard.ClosedReason_PrefetchSyncFailed",
};
