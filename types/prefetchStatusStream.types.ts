import type {
  ConfigPrefetchStatusEntry,
  GetConfigsPrefetchStatusResponseBody,
  PrefetchGlobalQueue,
} from "@/types/rest.types";

/** `event: snapshot` — full prefetch-status body (same as GET poll). */
export type PrefetchStatusSnapshotSsePayload = GetConfigsPrefetchStatusResponseBody;

/** `event: hash` — one hash entry changed or unlinked (`entry: null` → remove from `byHash`). */
export type PrefetchStatusHashSsePayload = Readonly<{
  hash: string;
  entry: ConfigPrefetchStatusEntry | null;
}>;

/** `event: global_queue` — global FIFO depth changed. */
export type PrefetchStatusGlobalQueueSsePayload = Readonly<{
  globalQueue: PrefetchGlobalQueue;
}>;
