import { format } from "date-fns";
import {
  ROOM_LOG_KINDS,
  ROOM_LOG_SECTOR_STATUSES,
  ROOM_LOG_TONES,
} from "@/constants/logStream.constants";
import { getBaseApiUrl } from "@/infra/env";
import type { RoomLogResetSsePayload } from "@/types/logStream.types";
import type { UiLogLine } from "@/types/logStream.types";
import type {
  RoomLogKind,
  RoomLogSectorStatus,
  RoomLogSsePayload,
  RoomLogTone,
} from "@/types/room.types";
import { nowIso } from "@/utils/dateTime.utils";
import { parseJsonObject } from "@/utils/json.utils";

export function buildHashLogsStreamUrl(hash: string): string {
  const encoded = encodeURIComponent(hash);
  const path = `/api/hashes/${encoded}/logs/stream`;
  const base = getBaseApiUrl();
  if (!base) {
    return path;
  }
  return `${base}${path}`;
}

export function parseRoomLogResetSsePayload(raw: string): RoomLogResetSsePayload | null {
  const record = parseJsonObject(raw);
  if (!record) {
    return null;
  }
  const hash = record.hash;
  if (typeof hash !== "string" || hash.length === 0) {
    return null;
  }
  return { hash };
}

function isRoomLogTone(value: string): value is RoomLogTone {
  return (ROOM_LOG_TONES as readonly string[]).includes(value);
}

/** Maps legacy worker `level` to `tone` when `tone` is absent on SSE payloads. */
function roomLogToneFromLegacyLevel(level: string | null | undefined): RoomLogTone {
  switch (level) {
    case "success":
      return "success";
    case "warn":
      return "warning";
    case "error":
      return "error";
    case "info":
    default:
      return "default";
  }
}

function parseOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length === 0) {
    return undefined;
  }
  return value;
}

function parseRoomLogKind(value: unknown): RoomLogKind | undefined {
  if (typeof value === "string" && (ROOM_LOG_KINDS as readonly string[]).includes(value)) {
    return value as RoomLogKind;
  }
  return undefined;
}

function parseRoomLogSectorStatus(value: unknown): RoomLogSectorStatus | undefined {
  if (
    typeof value === "string" &&
    (ROOM_LOG_SECTOR_STATUSES as readonly string[]).includes(value)
  ) {
    return value as RoomLogSectorStatus;
  }
  return undefined;
}

function parseOptionalByteCount(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return undefined;
  }
  return Math.floor(value);
}

function parseOptionalBytesTotal(value: unknown): number | null | undefined {
  if (value === null) {
    return null;
  }
  return parseOptionalByteCount(value);
}

function parseOptionalSectorPercent(value: unknown): number | null | undefined {
  if (value === null) {
    return null;
  }
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function parseRoomLogSsePayload(raw: string): RoomLogSsePayload | null {
  const record = parseJsonObject(raw);
  if (!record) {
    return null;
  }
  const line = record.line;
  const seq = record.seq;
  if (typeof line !== "string" || line.length === 0) {
    return null;
  }
  if (typeof seq !== "number" || !Number.isFinite(seq)) {
    return null;
  }

  const toneRaw = record.tone;
  const level = record.level;
  const tone =
    typeof toneRaw === "string" && isRoomLogTone(toneRaw)
      ? toneRaw
      : roomLogToneFromLegacyLevel(typeof level === "string" ? level : undefined);

  const kind = parseRoomLogKind(record.kind);
  const logKey = parseOptionalString(record.logKey);
  const sector = parseOptionalString(record.sector);
  const status = parseRoomLogSectorStatus(record.status);
  const bytesRead = parseOptionalByteCount(record.bytesRead);
  const bytesTotal = parseOptionalBytesTotal(record.bytesTotal);
  const sectorPercent = parseOptionalSectorPercent(record.sectorPercent);

  return {
    line,
    seq,
    tone,
    ...(kind ? { kind } : {}),
    ...(logKey ? { logKey } : {}),
    ...(sector ? { sector } : {}),
    ...(status ? { status } : {}),
    ...(bytesRead != null ? { bytesRead } : {}),
    ...(bytesTotal !== undefined ? { bytesTotal } : {}),
    ...(sectorPercent !== undefined ? { sectorPercent } : {}),
  };
}

function isTerminalLogSectorStatus(status: RoomLogSectorStatus | undefined): boolean {
  return status === "success" || status === "error";
}

/**
 * Whether an incoming line should replace an existing row with the same `logKey`.
 * Highest `seq` wins, except terminal sector rows beat stale `in_progress` when
 * concurrent persists reorder SSE delivery.
 */
export function shouldReplaceMergedLogLine(existing: UiLogLine, incoming: UiLogLine): boolean {
  const existingTerminal = isTerminalLogSectorStatus(existing.status);
  const incomingTerminal = isTerminalLogSectorStatus(incoming.status);

  if (existingTerminal && incoming.status === "in_progress") {
    return false;
  }

  if (incoming.seq > existing.seq) {
    return true;
  }

  if (incoming.seq < existing.seq) {
    return incomingTerminal && !existingTerminal;
  }

  return true;
}

export function roomLogPayloadToUiLogLine(payload: RoomLogSsePayload): UiLogLine {
  const time = format(new Date(), "HH:mm:ss");
  const id = payload.logKey ?? String(payload.seq);

  return {
    id,
    seq: payload.seq,
    message: payload.line,
    time,
    timestamp: nowIso(),
    tone: payload.tone,
    ...(payload.kind ? { kind: payload.kind } : {}),
    ...(payload.logKey ? { logKey: payload.logKey } : {}),
    ...(payload.sector ? { sector: payload.sector } : {}),
    ...(payload.status ? { status: payload.status } : {}),
    ...(payload.bytesRead != null ? { bytesRead: payload.bytesRead } : {}),
    ...(payload.bytesTotal !== undefined ? { bytesTotal: payload.bytesTotal } : {}),
    ...(payload.sectorPercent !== undefined ? { sectorPercent: payload.sectorPercent } : {}),
  };
}
