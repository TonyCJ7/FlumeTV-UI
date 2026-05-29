import { createSelector } from "@reduxjs/toolkit";
import type { ConfigsState } from "@/store/configs/configsSlice";
import type { PrefetchStatusState } from "@/store/prefetchStatus/prefetchStatusSlice";
import type { ConfigListItem, ConfigPrefetchStatusEntry, RoomLastOutcome } from "@/types/rest.types";
import {
  derivePrefetchUiBand,
  type DerivePrefetchUiBandResult,
} from "@/utils/prefetchUiBand.utils";

export type MergedConfigRow = Readonly<{
  item: ConfigListItem;
  prefetchEntry: ConfigPrefetchStatusEntry | undefined;
  bandFields: DerivePrefetchUiBandResult;
  nextTriggerAt: string | null;
  lastSyncedAt: string | null;
  lastOutcome: RoomLastOutcome | null;
  closedReason: string | null;
  roomUpdatedAt: string | null;
}>;

type ConfigPageSliceState = {
  configs: ConfigsState;
  prefetchStatus: PrefetchStatusState;
};

const selectConfigItems = (state: ConfigPageSliceState) => state.configs.items;
const selectPrefetchByHash = (state: ConfigPageSliceState) => state.prefetchStatus.byHash;

function mergeConfigRow(
  item: ConfigListItem,
  prefetchEntry: ConfigPrefetchStatusEntry | undefined,
): MergedConfigRow {
  const bandFields = derivePrefetchUiBand({ listItem: item, prefetchEntry });

  return {
    item,
    prefetchEntry,
    bandFields,
    nextTriggerAt: prefetchEntry?.nextTriggerAt ?? item.scheduler?.nextTriggerAt ?? null,
    lastSyncedAt: prefetchEntry?.lastSyncedAt ?? item.lastSyncedAt ?? null,
    lastOutcome: prefetchEntry?.room.lastOutcome ?? item.roomLastOutcome ?? null,
    closedReason: prefetchEntry?.room.closedReason ?? null,
    roomUpdatedAt: prefetchEntry?.room.updatedAt ?? null,
  };
}

export const selectMergedConfigRows = createSelector(
  [selectConfigItems, selectPrefetchByHash],
  (items, byHash): MergedConfigRow[] =>
    items.map((item) => mergeConfigRow(item, byHash[item.hash])),
);
