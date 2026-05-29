import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { LOG_STREAM_RING_BUFFER_MAX } from "@/constants/logStream.constants";
import type { ConfigConfirmKind } from "@/types/configConfirm.types";
import type { UiLogLine } from "@/types/logStream.types";

export type AddConfigTab = "direct" | "xtream";

type UiState = {
  logDialogOpen: boolean;
  logDialogHash: string | null;
  logLines: UiLogLine[];
  addConfigDialogOpen: boolean;
  addConfigTab: AddConfigTab;
  editConfigDialogOpen: boolean;
  editConfigHash: string | null;
  configConfirmOpen: boolean;
  configConfirmKind: ConfigConfirmKind | null;
  configConfirmHash: string | null;
};

const initialState: UiState = {
  logDialogOpen: false,
  logDialogHash: null,
  logLines: [],
  addConfigDialogOpen: false,
  addConfigTab: "direct",
  editConfigDialogOpen: false,
  editConfigHash: null,
  configConfirmOpen: false,
  configConfirmKind: null,
  configConfirmHash: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openLogDialog(state, action: PayloadAction<string>) {
      state.logDialogOpen = true;
      state.logDialogHash = action.payload;
      state.logLines = [];
    },
    closeLogDialog(state) {
      state.logDialogOpen = false;
      state.logDialogHash = null;
      state.logLines = [];
    },
    upsertLogLine(state, action: PayloadAction<UiLogLine>) {
      const incoming = action.payload;

      if (incoming.logKey) {
        const existingIndex = state.logLines.findIndex((line) => line.logKey === incoming.logKey);
        if (existingIndex >= 0) {
          const existing = state.logLines[existingIndex];
          if (incoming.seq >= existing.seq) {
            state.logLines[existingIndex] = incoming;
          }
          return;
        }
      } else if (state.logLines.some((line) => line.id === incoming.id)) {
        return;
      }

      state.logLines.push(incoming);
      if (state.logLines.length > LOG_STREAM_RING_BUFFER_MAX) {
        state.logLines = state.logLines.slice(-LOG_STREAM_RING_BUFFER_MAX);
      }
    },
    clearLogLines(state) {
      state.logLines = [];
    },
    openAddConfigDialog(state) {
      state.addConfigDialogOpen = true;
    },
    closeAddConfigDialog(state) {
      state.addConfigDialogOpen = false;
      state.addConfigTab = "direct";
    },
    setAddConfigTab(state, action: PayloadAction<AddConfigTab>) {
      state.addConfigTab = action.payload;
    },
    openEditConfigDialog(state, action: PayloadAction<string>) {
      state.editConfigDialogOpen = true;
      state.editConfigHash = action.payload;
    },
    closeEditConfigDialog(state) {
      state.editConfigDialogOpen = false;
      state.editConfigHash = null;
    },
    openConfigConfirmDialog(
      state,
      action: PayloadAction<{ kind: ConfigConfirmKind; hash: string }>,
    ) {
      state.configConfirmOpen = true;
      state.configConfirmKind = action.payload.kind;
      state.configConfirmHash = action.payload.hash;
    },
    closeConfigConfirmDialog(state) {
      state.configConfirmOpen = false;
      state.configConfirmKind = null;
      state.configConfirmHash = null;
    },
  },
});

export const {
  openLogDialog,
  closeLogDialog,
  upsertLogLine,
  clearLogLines,
  openAddConfigDialog,
  closeAddConfigDialog,
  setAddConfigTab,
  openEditConfigDialog,
  closeEditConfigDialog,
  openConfigConfirmDialog,
  closeConfigConfirmDialog,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;

export const selectLogDialogOpen = (state: { ui: UiState }) => state.ui.logDialogOpen;
export const selectLogDialogHash = (state: { ui: UiState }) => state.ui.logDialogHash;
export const selectLogLines = (state: { ui: UiState }) => state.ui.logLines;
export const selectAddConfigDialogOpen = (state: { ui: UiState }) => state.ui.addConfigDialogOpen;
export const selectAddConfigTab = (state: { ui: UiState }) => state.ui.addConfigTab;
export const selectEditConfigDialogOpen = (state: { ui: UiState }) => state.ui.editConfigDialogOpen;
export const selectEditConfigHash = (state: { ui: UiState }) => state.ui.editConfigHash;
export const selectConfigConfirmOpen = (state: { ui: UiState }) => state.ui.configConfirmOpen;
export const selectConfigConfirmKind = (state: { ui: UiState }) => state.ui.configConfirmKind;
export const selectConfigConfirmHash = (state: { ui: UiState }) => state.ui.configConfirmHash;
