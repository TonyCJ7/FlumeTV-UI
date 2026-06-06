import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import type { MergedConfigRow } from "@/types/configCard.types";
import { mergeConfigRow } from "@/utils/prefetchUiBand.utils";

type ConfigPageState = Pick<RootState, "configs" | "prefetchStatus">;

const selectConfigItems = (state: ConfigPageState) => state.configs.items;
const selectPrefetchByHash = (state: ConfigPageState) => state.prefetchStatus.byHash;

export const selectPrefetchEntry = (hash: string) => (state: RootState) =>
  state.prefetchStatus.byHash[hash];

export const selectMergedConfigRows = createSelector(
  [selectConfigItems, selectPrefetchByHash],
  (items, byHash): MergedConfigRow[] =>
    items.map((item) => mergeConfigRow(item, byHash[item.hash])),
);
