/** Frozen SSE event names on `GET /api/configs/prefetch-status/stream` (backend Step 28). */
export const PREFETCH_STATUS_SSE_EVENTS = ["snapshot", "hash", "global_queue"] as const;

export type PrefetchStatusSseEventName = (typeof PREFETCH_STATUS_SSE_EVENTS)[number];
