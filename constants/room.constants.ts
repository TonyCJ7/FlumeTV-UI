/** Active sync statuses that block duplicate enqueue (mirrors FlumeTV-API). */
export const IN_PROGRESS_ROOM_STATUSES = ["running", "fetching"] as const;

/** Prefix for worker exits with no parseable result — suffix is a free-text hint. */
export const ROOM_CLOSED_REASON_WORKER_NO_RESULT_PREFIX = "prefetch_worker_no_result:" as const;

/** Known `room.closed_reason` slugs from FlumeTV-API (exact match → i18n). */
export const ROOM_CLOSED_REASON_I18N_KEYS: Readonly<Record<string, string>> = {
  user_cancelled: "ConfigCard.ClosedReason_UserCancelled",
  config_deleted: "ConfigCard.ClosedReason_ConfigDeleted",
  process_restarted: "ConfigCard.ClosedReason_ProcessRestarted",
  prefetch_sync_failed: "ConfigCard.ClosedReason_PrefetchSyncFailed",
};
