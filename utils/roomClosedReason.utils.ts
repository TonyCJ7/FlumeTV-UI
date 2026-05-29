import {
  ROOM_CLOSED_REASON_I18N_KEYS,
  ROOM_CLOSED_REASON_WORKER_NO_RESULT_PREFIX,
} from "@/constants/room.constants";

export type KnownRoomClosedReason =
  | Readonly<{ kind: "exact"; i18nKey: string }>
  | Readonly<{ hint: string; kind: "worker_no_result"; i18nKey: string }>;

/**
 * Returns i18n metadata when `closedReason` is a known API slug or
 * `prefetch_worker_no_result:${hint}`; otherwise `null` (show raw string).
 */
export function classifyKnownRoomClosedReason(
  closedReason: string,
): KnownRoomClosedReason | null {
  const exactKey = ROOM_CLOSED_REASON_I18N_KEYS[closedReason];
  if (exactKey) {
    return { kind: "exact", i18nKey: exactKey };
  }

  if (closedReason.startsWith(ROOM_CLOSED_REASON_WORKER_NO_RESULT_PREFIX)) {
    const hint = closedReason.slice(ROOM_CLOSED_REASON_WORKER_NO_RESULT_PREFIX.length);
    if (hint.length > 0) {
      return {
        kind: "worker_no_result",
        hint,
        i18nKey: "ConfigCard.ClosedReason_PrefetchWorkerNoResult",
      };
    }
  }

  return null;
}
