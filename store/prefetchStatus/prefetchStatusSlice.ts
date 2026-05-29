import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { expireSession } from "@/store/auth/authSlice";
import { logoutUser } from "@/store/auth/authThunks";
import { fetchPrefetchStatus } from "@/store/prefetchStatus/prefetchStatusThunks";
import type { ConfigPrefetchStatusEntry, PrefetchGlobalQueue } from "@/types/rest.types";
import type { PrefetchStatusHashSsePayload } from "@/types/prefetchStatusStream.types";
import type { RoomSyncProgress } from "@/types/room.types";

export type PrefetchStatusState = {
  byHash: Record<string, ConfigPrefetchStatusEntry>;
  globalQueue: PrefetchGlobalQueue;
};

const emptyGlobalQueue: PrefetchGlobalQueue = {
  runningJobCount: 0,
  waitingJobCount: 0,
  totalQueueItems: 0,
};

const initialState: PrefetchStatusState = {
  byHash: {},
  globalQueue: emptyGlobalQueue,
};

const prefetchStatusSlice = createSlice({
  name: "prefetchStatus",
  initialState,
  reducers: {
    applyPrefetchStatusSnapshot(
      state,
      action: PayloadAction<{
        byHash: Record<string, ConfigPrefetchStatusEntry>;
        globalQueue: PrefetchGlobalQueue;
      }>,
    ) {
      state.byHash = action.payload.byHash;
      state.globalQueue = action.payload.globalQueue;
    },
    upsertPrefetchStatusHashEntry(state, action: PayloadAction<PrefetchStatusHashSsePayload>) {
      const { hash, entry } = action.payload;
      if (entry === null) {
        delete state.byHash[hash];
        return;
      }
      state.byHash[hash] = entry;
    },
    applyPrefetchStatusGlobalQueue(state, action: PayloadAction<PrefetchGlobalQueue>) {
      state.globalQueue = action.payload;
    },
    patchPrefetchEntryProgress(
      state,
      action: PayloadAction<{ hash: string; progress: RoomSyncProgress }>,
    ) {
      const entry = state.byHash[action.payload.hash];
      if (!entry) {
        return;
      }
      entry.progress = action.payload.progress;
    },
    resetPrefetchStatusState() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPrefetchStatus.fulfilled, (state, action) => {
        state.byHash = action.payload.byHash;
        state.globalQueue = action.payload.globalQueue;
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, () => initialState)
      .addCase(expireSession, () => initialState);
  },
});

export const {
  applyPrefetchStatusSnapshot,
  upsertPrefetchStatusHashEntry,
  applyPrefetchStatusGlobalQueue,
  patchPrefetchEntryProgress,
  resetPrefetchStatusState,
} = prefetchStatusSlice.actions;

export const prefetchStatusReducer = prefetchStatusSlice.reducer;

export const selectPrefetchEntry =
  (hash: string) => (state: { prefetchStatus: PrefetchStatusState }) =>
    state.prefetchStatus.byHash[hash];
