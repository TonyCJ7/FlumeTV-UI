import { createSlice } from "@reduxjs/toolkit";
import { expireSession } from "@/store/auth/authSlice";
import { logoutUser } from "@/store/auth/authThunks";
import { changePassword, fetchStremioManifestUrl } from "@/store/install/installThunks";
import type { RootState } from "@/store/store";

type InstallState = {
  manifestUrl: string | null;
  stremioWebInstallUrl: string | null;
  manifestStatus: "idle" | "loading" | "succeeded" | "failed";
  manifestError: string | null;
  changePasswordStatus: "idle" | "loading";
};

const initialState: InstallState = {
  manifestUrl: null,
  stremioWebInstallUrl: null,
  manifestStatus: "idle",
  manifestError: null,
  changePasswordStatus: "idle",
};

const installSlice = createSlice({
  name: "install",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStremioManifestUrl.pending, (state) => {
        state.manifestStatus = "loading";
        state.manifestError = null;
      })
      .addCase(fetchStremioManifestUrl.fulfilled, (state, action) => {
        state.manifestStatus = "succeeded";
        state.manifestUrl = action.payload.manifestUrl;
        state.stremioWebInstallUrl = action.payload.stremioWebInstallUrl;
        state.manifestError = null;
      })
      .addCase(fetchStremioManifestUrl.rejected, (state, action) => {
        state.manifestStatus = "failed";
        state.manifestUrl = null;
        state.stremioWebInstallUrl = null;
        state.manifestError = action.payload?.message ?? action.error.message ?? null;
      })
      .addCase(changePassword.pending, (state) => {
        state.changePasswordStatus = "loading";
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordStatus = "idle";
      })
      .addCase(changePassword.rejected, (state) => {
        state.changePasswordStatus = "idle";
      })
      .addCase(expireSession, () => initialState)
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, () => initialState);
  },
});

export const installReducer = installSlice.reducer;

export const selectManifestUrl = (state: RootState) => state.install.manifestUrl;
export const selectStremioWebInstallUrl = (state: RootState) => state.install.stremioWebInstallUrl;
export const selectManifestStatus = (state: RootState) => state.install.manifestStatus;
export const selectManifestError = (state: RootState) => state.install.manifestError;
export const selectChangePasswordStatus = (state: RootState) => state.install.changePasswordStatus;
