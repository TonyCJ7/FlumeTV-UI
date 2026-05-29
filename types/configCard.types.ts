import type { RoomLastOutcome } from "@/types/room.types";

export type ConfigSourceCardStatusVariant = "idle" | "queue" | "work";

export type ConfigSourceCardLastOutcomeVariant = "success" | "danger" | "neutral";

export type ConfigSourceCardStatusLabels = Readonly<{
  syncing: string;
  formatSyncingWithPercent: (percent: number) => string;
  labelRunning: string;
  labelFetching: string;
  labelInQueue: string;
  labelIdleReady: string;
  labelLastOutcome: string;
}>;

export type ConfigSourceCardStatusDisplay = Readonly<{
  primary: string;
  lastOutcomeLabel: string | null;
  lastOutcomeVariant: ConfigSourceCardLastOutcomeVariant | null;
}>;

export type ConfigSourceCardCtaVisibility = Readonly<{
  showRefetch: boolean;
  showCancel: boolean;
  showLogs: boolean;
}>;

export type ConfigCardDetailRowLabels = Readonly<{
  detailCurrentStatus: string;
  detailProgress: string;
  detailTriggered: string;
  detailEstComplete: string;
  detailEstCompleteApprox: string;
  detailEstCompleteUnavailable: string;
  detailQueuePosition: string;
  detailEstWait: string;
  detailLastPrefetch: string;
  detailNextScheduled: string;
  detailLastOutcome: string;
  detailOutcomeDetail: string;
  syncing: string;
}>;

export type ConfigCardDetailFormatters = Readonly<{
  formatIso: (iso: string | null | undefined) => string;
  formatDuration: (ms: number | null | undefined) => string;
  formatTerminal: (outcome: RoomLastOutcome | null | undefined) => string;
  formatClosedReason: (closedReason: string | null | undefined) => string;
}>;
