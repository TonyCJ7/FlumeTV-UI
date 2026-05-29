"use client";

import { useEffect, useRef, useState } from "react";
import { patchConfigItemProgress } from "@/store/configs/configsSlice";
import { useAppDispatch } from "@/store/hooks";
import { patchPrefetchEntryProgress } from "@/store/prefetchStatus/prefetchStatusSlice";
import { upsertLogLine, clearLogLines } from "@/store/ui/uiSlice";
import {
  buildHashLogsStreamUrl,
  parseRoomLogResetSsePayload,
  parseRoomLogSsePayload,
  parseRoomSyncProgressFromSse,
  roomLogPayloadToUiLogLine,
} from "@/utils/logStream.utils";

type ConfigLogStreamStatus = "idle" | "connecting" | "open" | "error";

/**
 * Opens `EventSource` to `GET /api/hashes/:hash/logs/stream` while the log dialog
 * is open; tears down on close. Native `Last-Event-ID` resume on reconnect.
 * Handles `event: log_reset` (backend Step 26) — clears the buffer when refetch
 * preempts logs while the dialog stays open on the same SSE connection.
 * Structured sector logs (backend Step 27) — `upsertLogLine` merges rows by `logKey` (highest `seq` wins).
 */
export function useConfigLogStream(open: boolean, hash: string | null): ConfigLogStreamStatus {
  const dispatch = useAppDispatch();
  const connectionGenRef = useRef(0);
  const [status, setStatus] = useState<ConfigLogStreamStatus>("idle");

  useEffect(() => {
    if (!open || !hash) {
      return undefined;
    }

    const gen = ++connectionGenRef.current;
    queueMicrotask(() => {
      if (connectionGenRef.current === gen) {
        setStatus("connecting");
      }
    });

    const url = buildHashLogsStreamUrl(hash);
    // Cross-origin SSE (e.g. :7000 → :7001) must opt in to cookies — default is false.
    const eventSource = new EventSource(url, { withCredentials: true });

    const isActive = (): boolean => connectionGenRef.current === gen;

    const onLog = (event: MessageEvent<string>): void => {
      if (!isActive()) {
        return;
      }
      const payload = parseRoomLogSsePayload(event.data);
      if (!payload) {
        return;
      }
      dispatch(upsertLogLine(roomLogPayloadToUiLogLine(payload)));
    };

    const onLogReset = (event: MessageEvent<string>): void => {
      if (!isActive()) {
        return;
      }
      const payload = parseRoomLogResetSsePayload(event.data);
      if (!payload || payload.hash !== hash) {
        return;
      }
      dispatch(clearLogLines());
    };

    const onProgress = (event: MessageEvent<string>): void => {
      if (!isActive()) {
        return;
      }
      const progress = parseRoomSyncProgressFromSse(event.data);
      if (!progress) {
        return;
      }
      dispatch(patchPrefetchEntryProgress({ hash, progress }));
      dispatch(patchConfigItemProgress({ hash, progress }));
    };

    eventSource.addEventListener("log", onLog);
    eventSource.addEventListener("log_reset", onLogReset);
    eventSource.addEventListener("progress", onProgress);

    eventSource.onopen = () => {
      if (isActive()) {
        setStatus("open");
      }
    };

    eventSource.onerror = () => {
      if (!isActive()) {
        return;
      }
      if (eventSource.readyState === EventSource.CLOSED) {
        setStatus("error");
      }
    };

    return () => {
      eventSource.removeEventListener("log", onLog);
      eventSource.removeEventListener("log_reset", onLogReset);
      eventSource.removeEventListener("progress", onProgress);
      eventSource.close();
    };
  }, [dispatch, hash, open]);

  return !open || !hash ? "idle" : status;
}
