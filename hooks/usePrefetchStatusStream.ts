"use client";

import { useEffect, useRef } from "react";
import { useBaseApiUrl } from "@/components/providers";
import { useAppDispatch } from "@/store/hooks";
import {
  applyPrefetchStatusGlobalQueue,
  applyPrefetchStatusSnapshot,
  upsertPrefetchStatusHashEntry,
} from "@/store/prefetchStatus/prefetchStatusSlice";
import {
  parsePrefetchStatusGlobalQueueSsePayload,
  parsePrefetchStatusHashSsePayload,
  parsePrefetchStatusSnapshotSsePayload,
} from "@/utils/prefetchStatusStream.utils";

/**
 * Opens `EventSource` to `GET /api/configs/prefetch-status/stream` while enabled.
 * Server pushes `snapshot`, `hash`, and `global_queue` on the prefetch-status stream.
 * Callers should pass `enabled: false` when the config list is empty.
 * Tears down on unmount (route leave).
 */
export function usePrefetchStatusStream(enabled: boolean): void {
  const baseApiUrl = useBaseApiUrl();
  const dispatch = useAppDispatch();
  const connectionGenRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const gen = ++connectionGenRef.current;
    const path = "/api/configs/prefetch-status/stream";
    const url = baseApiUrl ? `${baseApiUrl}${path}` : path;
    const eventSource = new EventSource(url, { withCredentials: true });

    const isActive = (): boolean => connectionGenRef.current === gen;

    const onSnapshot = (event: MessageEvent<string>): void => {
      if (!isActive()) {
        return;
      }
      const payload = parsePrefetchStatusSnapshotSsePayload(event.data);
      if (!payload) {
        return;
      }
      dispatch(applyPrefetchStatusSnapshot(payload));
    };

    const onHash = (event: MessageEvent<string>): void => {
      if (!isActive()) {
        return;
      }
      const payload = parsePrefetchStatusHashSsePayload(event.data);
      if (!payload) {
        return;
      }
      dispatch(upsertPrefetchStatusHashEntry(payload));
    };

    const onGlobalQueue = (event: MessageEvent<string>): void => {
      if (!isActive()) {
        return;
      }
      const payload = parsePrefetchStatusGlobalQueueSsePayload(event.data);
      if (!payload) {
        return;
      }
      dispatch(applyPrefetchStatusGlobalQueue(payload.globalQueue));
    };

    eventSource.addEventListener("snapshot", onSnapshot);
    eventSource.addEventListener("hash", onHash);
    eventSource.addEventListener("global_queue", onGlobalQueue);

    return () => {
      eventSource.removeEventListener("snapshot", onSnapshot);
      eventSource.removeEventListener("hash", onHash);
      eventSource.removeEventListener("global_queue", onGlobalQueue);
      eventSource.close();
    };
  }, [baseApiUrl, dispatch, enabled]);
}
