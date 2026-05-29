/**
 * When poll/list merge would downgrade a card band (e.g. in progress → idle),
 * hold the previous band this long to avoid flip-flop between updates.
 */
export const PREFETCH_BAND_STABILIZE_MS = 450;

/** Higher rank = busier band (`inProgress` is highest). */
export const PREFETCH_BAND_RANK = {
  refetchAvailable: 0,
  inQueue: 1,
  inProgress: 2,
} as const;
