/**
 * REST request/response DTOs — mirrored from `../FlumeTV-API/src/types/rest.types.ts`
 * and auth handler JSON shapes. Do not import backend TypeScript in the app bundle.
 */

import type { RoomLastOutcome, RoomSyncProgress } from "@/types/room.types";

export type { RoomLastOutcome, RoomSyncProgress } from "@/types/room.types";

/** Scheduler row on config list items (`GET /api/configs`). */
export type ConfigListSchedulerSnapshot = {
  intervalMinutes: number;
  nextTriggerAt: string;
};

/**
 * `POST` / `PUT /api/configs` body for Xtream — after client validation.
 *
 * Backend `rest.types` uses `unknown` on each field because Express `req.body` is
 * unvalidated JSON; the handler parses at runtime. The app only sends this shape
 * from `toPostConfigXtreamRequestBody`.
 */
export type PostConfigXtreamRequestBody = {
  type: "xtream";
  configName: string;
  customEpg: string | null;
  epgOffset: number;
  epgUrl: string | null;
  hasCustomEpg: boolean;
  panelPassword: string;
  panelUrl: string;
  panelUsername: string;
};

/**
 * `POST` / `PUT /api/configs` body for Direct — after client validation.
 * See `PostConfigXtreamRequestBody` for why this differs from backend ingress types.
 */
export type PostConfigDirectRequestBody = {
  type: "direct";
  configName: string;
  epgOffset: number;
  epgUrl: string | null;
  hasCustomEpg: boolean;
  m3uUrl: string;
};

export type PostConfigRequestBody = PostConfigXtreamRequestBody | PostConfigDirectRequestBody;

/** `POST /api/configs` success body (`postConfig.handler.ts`). */
export type PostConfigResponseBody = {
  created: boolean;
  enqueueErrorCode: string | null;
  estimatedWaitMs: number | null;
  hash: string;
  linkStatus: "created" | "linked-existing";
  queuePosition: number | null;
  roomId?: number | null;
  roomStatus?: string | null;
  syncEnqueued: boolean;
};

export type ConfigListItemXtream = {
  configName: string;
  customEpg: string | null;
  epgOffset: number;
  epgUrl: string | null;
  hash: string;
  hasCustomEpg: boolean;
  isActive: boolean;
  isRoomActive: boolean;
  lastSyncedAt: string | null;
  progress: RoomSyncProgress | null;
  panelUrl: string;
  panelUsername: string;
  roomId: number | null;
  roomLastOutcome: RoomLastOutcome | null;
  roomStatus: string | null;
  scheduler: ConfigListSchedulerSnapshot | null;
  triggeredBy: string | null;
  triggeredByMe: boolean;
  type: "xtream";
};

export type ConfigListItemDirect = {
  configName: string;
  epgOffset: number;
  epgUrl: string | null;
  hash: string;
  hasCustomEpg: boolean;
  isActive: boolean;
  isRoomActive: boolean;
  lastSyncedAt: string | null;
  progress: RoomSyncProgress | null;
  m3uUrl: string;
  roomId: number | null;
  roomLastOutcome: RoomLastOutcome | null;
  roomStatus: string | null;
  scheduler: ConfigListSchedulerSnapshot | null;
  triggeredBy: string | null;
  triggeredByMe: boolean;
  type: "direct";
};

export type ConfigListItem = ConfigListItemDirect | ConfigListItemXtream;

export type GetConfigsResponseBody = {
  configs: ConfigListItem[];
};

/** `DELETE /api/configs/:hash` */
export type DeleteConfigResponseBody = {
  hashRemovedFromServer: boolean;
  hashUnlinked: boolean;
};

/**
 * `PUT /api/configs/:hash` — same body as POST (includes `configName`).
 * Same hash + same stored name → `{ unchanged: true }`.
 * Same hash + new `configName` → `{ unchanged: false, configNameUpdated: true }` only.
 */
export type PutConfigResponseBody =
  | {
      hash: string;
      unchanged: true;
    }
  | {
      configNameUpdated: true;
      hash: string;
      unchanged: false;
    }
  | {
      created: boolean;
      enqueueErrorCode: string | null;
      estimatedWaitMs: number | null;
      hash: string;
      hashRemovedFromServer: boolean;
      linkStatus: "created" | "linked-existing";
      oldHashUnlinked: true;
      queuePosition: number | null;
      roomId: number | null;
      roomStatus: string | null;
      syncEnqueued: boolean;
      unchanged: false;
    };

/** `POST /api/hashes/:hash/refetch` */
export type PostHashRefetchResponseBody = {
  estimatedWaitMs: number | null;
  queuePosition: number;
  roomId: number;
  roomStatus: string | null;
  syncEnqueued: true;
};

/** `POST /api/hashes/:hash/cancel` */
export type PostHashCancelResponseBody =
  | { cancelled: true; kind: "queued" }
  | { cancelled: true; kind: "running" };

/** `PATCH /api/hashes/:hash/active` */
export type PatchHashActiveRequestBody = {
  isActive: boolean;
};

export type PatchHashActiveResponseBody = {
  hash: string;
  isActive: boolean;
};

/** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` — success body */
export type AuthUserResponseBody = {
  userId: string;
};

/** `POST /api/auth/register` */
export type PostRegisterRequestBody = {
  password: string;
};

/** `POST /api/auth/login` */
export type PostLoginRequestBody = {
  password: string;
  userId: string;
};

/** `POST /api/auth/change-password` */
export type PostChangePasswordResponseBody = {
  ok: true;
};

/** `POST /api/auth/logout` — clears session cookie; always **200** when reachable. */
export type PostLogoutResponseBody = {
  ok: true;
};

/** `GET /api/stremio/manifest-url` */
export type GetStremioManifestUrlResponseBody = {
  manifestUrl: string;
  stremioWebInstallUrl: string;
};

/** `GET /api/configs/prefetch-status` — per-hash snapshot. */
export type ConfigPrefetchStatusEntry = {
  estimatedWaitMs: number | null;
  hash: string;
  /** True when `room_log_line` has replayable lines for the last sync (cleared on new enqueue). */
  hasLogs: boolean;
  isTerminal: boolean;
  lastSyncedAt: string | null;
  nextTriggerAt: string | null;
  progress: RoomSyncProgress | null;
  queuePosition: number | null;
  room: {
    closedReason: string | null;
    id: number | null;
    lastOutcome: RoomLastOutcome | null;
    status: string | null;
    triggeredBy: string | null;
    updatedAt: string | null;
  };
  schedulerIntervalMinutes: number | null;
  triggeredBy: string | null;
  triggeredByMe: boolean;
};

export type PrefetchGlobalQueue = {
  runningJobCount: number;
  totalQueueItems: number;
  waitingJobCount: number;
};

/** `GET /api/configs/prefetch-status` */
export type GetConfigsPrefetchStatusResponseBody = {
  byHash: Record<string, ConfigPrefetchStatusEntry>;
  globalQueue: PrefetchGlobalQueue;
};
