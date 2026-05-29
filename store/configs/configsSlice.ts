import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { expireSession } from "@/store/auth/authSlice";
import { logoutUser } from "@/store/auth/authThunks";
import { fetchConfigsList } from "@/store/configs/configsThunks";
import type { ConfigListItem } from "@/types/rest.types";
import type { ConfigMutationScope } from "@/types/configHashOps.types";
import type { RoomSyncProgress } from "@/types/room.types";

export type ConfigsListStatus = "idle" | "loading" | "succeeded" | "failed";

export type ConfigsState = {
  items: ConfigListItem[];
  listStatus: ConfigsListStatus;
  listError: string | null;
  mutatingHashes: Record<string, ConfigMutationScope>;
};

const initialState: ConfigsState = {
  items: [],
  listStatus: "idle",
  listError: null,
  mutatingHashes: {},
};

const configsSlice = createSlice({
  name: "configs",
  initialState,
  reducers: {
    removeConfigItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.hash !== action.payload);
    },
    patchConfigItemProgress(
      state,
      action: PayloadAction<{ hash: string; progress: RoomSyncProgress }>,
    ) {
      const item = state.items.find((entry) => entry.hash === action.payload.hash);
      if (item) {
        item.progress = action.payload.progress;
      }
    },
    patchConfigItemConfigName(state, action: PayloadAction<{ hash: string; configName: string }>) {
      const item = state.items.find((entry) => entry.hash === action.payload.hash);
      if (item) {
        item.configName = action.payload.configName;
      }
    },
    patchConfigItemActive(state, action: PayloadAction<{ hash: string; isActive: boolean }>) {
      const item = state.items.find((entry) => entry.hash === action.payload.hash);
      if (item) {
        item.isActive = action.payload.isActive;
      }
    },
    migrateConfigItemHash(state, action: PayloadAction<{ oldHash: string; newHash: string }>) {
      const item = state.items.find((entry) => entry.hash === action.payload.oldHash);
      if (item) {
        item.hash = action.payload.newHash;
      }
      const scope = state.mutatingHashes[action.payload.oldHash];
      if (scope) {
        state.mutatingHashes[action.payload.newHash] = scope;
        delete state.mutatingHashes[action.payload.oldHash];
      }
    },
    setConfigMutating(
      state,
      action: PayloadAction<{
        hash: string;
        inFlight: boolean;
        scope?: ConfigMutationScope;
      }>,
    ) {
      const { hash, inFlight, scope = "card" } = action.payload;
      if (inFlight) {
        state.mutatingHashes[hash] = scope;
      } else {
        delete state.mutatingHashes[hash];
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchConfigsList.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchConfigsList.fulfilled, (state, action) => {
        state.items = action.payload;
        state.listStatus = "succeeded";
        state.listError = null;
      })
      .addCase(fetchConfigsList.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload?.message ?? action.error.message ?? null;
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, () => initialState)
      .addCase(expireSession, () => initialState);
  },
});

export const {
  removeConfigItem,
  patchConfigItemProgress,
  patchConfigItemConfigName,
  patchConfigItemActive,
  migrateConfigItemHash,
  setConfigMutating,
} = configsSlice.actions;

export const configsReducer = configsSlice.reducer;

export const selectConfigsListStatus = (state: { configs: ConfigsState }) =>
  state.configs.listStatus;
export const selectConfigsListError = (state: { configs: ConfigsState }) => state.configs.listError;
export const selectConfigByHash = (hash: string) => (state: { configs: ConfigsState }) =>
  state.configs.items.find((item) => item.hash === hash);
export const selectIsConfigMutating = (hash: string) => (state: { configs: ConfigsState }) =>
  hash in state.configs.mutatingHashes;
export const selectIsConfigCardMutating = (hash: string) => (state: { configs: ConfigsState }) =>
  state.configs.mutatingHashes[hash] === "card";
export const selectIsActiveTogglePending = (hash: string) => (state: { configs: ConfigsState }) =>
  state.configs.mutatingHashes[hash] === "activeToggle";
