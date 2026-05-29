import { getBaseApiUrl } from "@/infra/env";
import type { ConfigPrefetchStatusEntry, PrefetchGlobalQueue } from "@/types/rest.types";
import type {
  PrefetchStatusGlobalQueueSsePayload,
  PrefetchStatusHashSsePayload,
  PrefetchStatusSnapshotSsePayload,
} from "@/types/prefetchStatusStream.types";
import { parseJsonObject } from "@/utils/json.utils";

export function buildConfigsPrefetchStatusStreamUrl(): string {
  const path = "/api/configs/prefetch-status/stream";
  const base = getBaseApiUrl();
  if (!base) {
    return path;
  }
  return `${base}${path}`;
}

function isPrefetchGlobalQueue(value: unknown): value is PrefetchGlobalQueue {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.runningJobCount === "number" &&
    typeof record.waitingJobCount === "number" &&
    typeof record.totalQueueItems === "number"
  );
}

function isConfigPrefetchStatusEntry(value: unknown): value is ConfigPrefetchStatusEntry {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.hash === "string" &&
    typeof record.hasLogs === "boolean" &&
    typeof record.isTerminal === "boolean" &&
    record.room != null &&
    typeof record.room === "object"
  );
}

export function parsePrefetchStatusSnapshotSsePayload(
  raw: string,
): PrefetchStatusSnapshotSsePayload | null {
  const record = parseJsonObject(raw);
  if (!record) {
    return null;
  }
  const byHashRaw = record.byHash;
  const globalQueueRaw = record.globalQueue;
  if (!byHashRaw || typeof byHashRaw !== "object") {
    return null;
  }
  if (!isPrefetchGlobalQueue(globalQueueRaw)) {
    return null;
  }

  const byHash: Record<string, ConfigPrefetchStatusEntry> = {};
  for (const [hash, entryRaw] of Object.entries(byHashRaw)) {
    if (isConfigPrefetchStatusEntry(entryRaw)) {
      byHash[hash] = entryRaw;
    }
  }

  return { byHash, globalQueue: globalQueueRaw };
}

export function parsePrefetchStatusHashSsePayload(
  raw: string,
): PrefetchStatusHashSsePayload | null {
  const record = parseJsonObject(raw);
  if (!record) {
    return null;
  }
  const hash = record.hash;
  if (typeof hash !== "string" || hash.length === 0) {
    return null;
  }

  const entryRaw = record.entry;
  if (entryRaw === null) {
    return { hash, entry: null };
  }
  if (!isConfigPrefetchStatusEntry(entryRaw)) {
    return null;
  }

  return { hash, entry: entryRaw };
}

export function parsePrefetchStatusGlobalQueueSsePayload(
  raw: string,
): PrefetchStatusGlobalQueueSsePayload | null {
  const record = parseJsonObject(raw);
  if (!record) {
    return null;
  }
  const globalQueueRaw = record.globalQueue;
  if (!isPrefetchGlobalQueue(globalQueueRaw)) {
    return null;
  }

  return { globalQueue: globalQueueRaw };
}
