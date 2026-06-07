import type {
  ConfigPrefetchStatusEntry,
  GetConfigsPrefetchStatusResponseBody,
  PrefetchGlobalQueue,
} from "@/types/rest.types";
import { IN_PROGRESS_ROOM_STATUSES } from "@/constants/room.constants";
import { extractProgressPercent } from "@/utils/configCardFormat.utils";
import type {
  PrefetchStatusGlobalQueueSsePayload,
  PrefetchStatusHashSsePayload,
  PrefetchStatusSnapshotSsePayload,
} from "@/types/prefetchStatusStream.types";
import type { RoomLastOutcome, RoomSyncProgress } from "@/types/room.types";
import type { JsonObject } from "@/types/json.types";
import { isJsonObject, parseJsonObject } from "@/utils/json.utils";

export function parseRoomSyncProgress(value: unknown): RoomSyncProgress | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (!isJsonObject(value)) {
    return null;
  }
  const record: JsonObject = value;
  const percentRaw = record.percent;
  if (typeof percentRaw !== "number" || !Number.isFinite(percentRaw)) {
    return null;
  }

  const progress: RoomSyncProgress = {
    percent: Math.round(Math.min(100, Math.max(0, percentRaw))),
  };

  const phase = record.phase;
  if (typeof phase === "string" && phase.length > 0) {
    progress.phase = phase;
  }

  const bytesReadRaw = record.bytesRead;
  if (typeof bytesReadRaw === "number" && Number.isFinite(bytesReadRaw) && bytesReadRaw >= 0) {
    progress.bytesRead = Math.floor(bytesReadRaw);
  }

  const bytesTotalRaw = record.bytesTotal;
  if (bytesTotalRaw === null) {
    progress.bytesTotal = null;
  } else if (
    typeof bytesTotalRaw === "number" &&
    Number.isFinite(bytesTotalRaw) &&
    bytesTotalRaw >= 0
  ) {
    progress.bytesTotal = Math.floor(bytesTotalRaw);
  }

  return progress;
}

function isPrefetchGlobalQueue(value: unknown): value is PrefetchGlobalQueue {
  if (!isJsonObject(value)) {
    return false;
  }
  const record: JsonObject = value;
  return (
    typeof record.runningJobCount === "number" &&
    typeof record.waitingJobCount === "number" &&
    typeof record.totalQueueItems === "number"
  );
}

const ROOM_LAST_OUTCOMES: ReadonlySet<RoomLastOutcome> = new Set([
  "cancelled",
  "completed",
  "failed",
  "error",
]);

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isNullableFiniteNumber(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

/** API may send `room.id` as number or numeric string (pg int8 / JSON quirks). */
function parseNullableRoomId(value: unknown): number | null | undefined {
  if (value === null) {
    return null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  if (typeof value === "string" && value.length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.trunc(parsed);
    }
  }
  return undefined;
}

function isRoomLastOutcome(value: unknown): value is RoomLastOutcome | null {
  return (
    value === null ||
    (typeof value === "string" && ROOM_LAST_OUTCOMES.has(value as RoomLastOutcome))
  );
}

function parseConfigPrefetchStatusEntryRoom(
  value: unknown,
): ConfigPrefetchStatusEntry["room"] | null {
  if (!isJsonObject(value)) {
    return null;
  }
  const record: JsonObject = value;
  const id = parseNullableRoomId(record.id);
  if (
    id === undefined ||
    !isNullableString(record.closedReason) ||
    !isRoomLastOutcome(record.lastOutcome) ||
    !isNullableString(record.status) ||
    !isNullableString(record.triggeredBy) ||
    !isNullableString(record.updatedAt)
  ) {
    return null;
  }
  return {
    closedReason: record.closedReason,
    id,
    lastOutcome: record.lastOutcome,
    status: record.status,
    triggeredBy: record.triggeredBy,
    updatedAt: record.updatedAt,
  };
}

function parseConfigPrefetchStatusEntry(value: unknown): ConfigPrefetchStatusEntry | null {
  if (!isJsonObject(value)) {
    return null;
  }
  const record: JsonObject = value;
  const room = parseConfigPrefetchStatusEntryRoom(record.room);
  if (
    typeof record.hash !== "string" ||
    record.hash.length === 0 ||
    typeof record.hasLogs !== "boolean" ||
    typeof record.isTerminal !== "boolean" ||
    typeof record.triggeredByMe !== "boolean" ||
    !isNullableFiniteNumber(record.estimatedWaitMs) ||
    !isNullableString(record.lastSyncedAt) ||
    !isNullableString(record.nextTriggerAt) ||
    !isNullableFiniteNumber(record.queuePosition) ||
    !isNullableFiniteNumber(record.schedulerIntervalMinutes) ||
    !isNullableString(record.triggeredBy) ||
    !room
  ) {
    return null;
  }

  const progress = parseRoomSyncProgress(record.progress);

  return {
    estimatedWaitMs: record.estimatedWaitMs,
    hash: record.hash,
    hasLogs: record.hasLogs,
    isTerminal: record.isTerminal,
    lastSyncedAt: record.lastSyncedAt,
    nextTriggerAt: record.nextTriggerAt,
    progress,
    queuePosition: record.queuePosition,
    room,
    schedulerIntervalMinutes: record.schedulerIntervalMinutes,
    triggeredBy: record.triggeredBy,
    triggeredByMe: record.triggeredByMe,
  };
}

/** Validates and normalizes GET /api/configs/prefetch-status (same rules as SSE snapshot). */
export function parseGetConfigsPrefetchStatusResponseBody(
  value: unknown,
): GetConfigsPrefetchStatusResponseBody | null {
  if (!isJsonObject(value)) {
    return null;
  }
  const byHashRaw = value.byHash;
  const globalQueueRaw = value.globalQueue;
  if (!byHashRaw || typeof byHashRaw !== "object") {
    return null;
  }
  if (!isPrefetchGlobalQueue(globalQueueRaw)) {
    return null;
  }

  const byHash: Record<string, ConfigPrefetchStatusEntry> = {};
  for (const [hash, entryRaw] of Object.entries(byHashRaw)) {
    const entry = parseConfigPrefetchStatusEntry(entryRaw);
    if (entry) {
      byHash[hash] = entry;
    }
  }

  return { byHash, globalQueue: globalQueueRaw };
}

const IN_PROGRESS_ROOM_STATUS_SET = new Set<string>(IN_PROGRESS_ROOM_STATUSES);

/**
 * Prefetch-status SSE can arrive throttled behind log-stream progress patches — never regress
 * `progress.percent` while sync is active; clear progress once the room leaves active sync.
 */
export function mergePrefetchStatusHashEntry(
  existing: ConfigPrefetchStatusEntry,
  incoming: ConfigPrefetchStatusEntry,
): ConfigPrefetchStatusEntry {
  const inActiveSync =
    incoming.room.status != null && IN_PROGRESS_ROOM_STATUS_SET.has(incoming.room.status);

  if (!inActiveSync) {
    return { ...incoming, progress: null };
  }

  const existingPct = extractProgressPercent(existing.progress);
  const incomingPct = extractProgressPercent(incoming.progress);
  if (existingPct != null && (incomingPct == null || incomingPct < existingPct)) {
    return { ...incoming, progress: existing.progress };
  }

  return incoming;
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
    const entry = parseConfigPrefetchStatusEntry(entryRaw);
    if (entry) {
      byHash[hash] = entry;
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
  const entry = parseConfigPrefetchStatusEntry(entryRaw);
  if (!entry) {
    return null;
  }

  return { hash, entry };
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
