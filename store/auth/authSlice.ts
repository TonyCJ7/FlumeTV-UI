import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { bootstrapSession, loginUser, logoutUser, registerUser } from "@/store/auth/authThunks";

export type AuthDialogMode = "login" | "register";

type AuthState = {
  userId: string | null;
  /** Set true after bootstrap confirms session. */
  sessionReady: boolean;
  authDialogOpen: boolean;
  authDialogMode: AuthDialogMode;
  /**
   * Stremio configure redirect (`/config?uuid=`) — login-only, prefilled account id.
   * Cleared after successful login or when leaving configure context.
   */
  configureLoginUserId: string | null;
  /** Shown after register until the user dismisses the save-ID dialog. */
  registerSuccessUserId: string | null;
  authSubmitStatus: "idle" | "loading";
};

const initialState: AuthState = {
  userId: null,
  sessionReady: false,
  authDialogOpen: false,
  authDialogMode: "login",
  configureLoginUserId: null,
  registerSuccessUserId: null,
  authSubmitStatus: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthDialogMode(state, action: PayloadAction<AuthDialogMode>) {
      if (state.configureLoginUserId !== null) {
        state.authDialogMode = "login";
        return;
      }
      state.authDialogMode = action.payload;
    },
    openAuthDialog(state, action: PayloadAction<AuthDialogMode | undefined>) {
      state.authDialogOpen = true;
      if (action.payload) {
        state.authDialogMode = action.payload;
      }
    },
    setConfigureLoginUserId(state, action: PayloadAction<string | null>) {
      state.configureLoginUserId = action.payload;
      if (action.payload) {
        state.authDialogMode = "login";
      }
    },
    clearConfigureLoginHint(state) {
      state.configureLoginUserId = null;
    },
    clearAuth(state) {
      state.userId = null;
      state.sessionReady = false;
      state.authDialogOpen = false;
      state.authDialogMode = "login";
      state.configureLoginUserId = null;
      state.registerSuccessUserId = null;
      state.authSubmitStatus = "idle";
    },
    /** Session cookie missing or invalid — used by the API client interceptor. */
    expireSession(state) {
      state.userId = null;
      state.registerSuccessUserId = null;
      if (state.sessionReady) {
        state.authDialogOpen = true;
        state.authDialogMode = "login";
      }
    },
    dismissRegisterSuccess(state) {
      state.registerSuccessUserId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.userId = action.payload.userId;
        state.sessionReady = true;
        state.authDialogOpen = false;
      })
      .addCase(bootstrapSession.rejected, (state) => {
        state.userId = null;
        state.sessionReady = true;
        state.authDialogOpen = true;
        state.authDialogMode = "login";
      })
      .addCase(registerUser.pending, (state) => {
        state.authSubmitStatus = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.authSubmitStatus = "idle";
        state.userId = action.payload.userId;
        state.sessionReady = true;
        state.authDialogOpen = false;
        state.registerSuccessUserId = action.payload.userId;
      })
      .addCase(registerUser.rejected, (state) => {
        state.authSubmitStatus = "idle";
      })
      .addCase(loginUser.pending, (state) => {
        state.authSubmitStatus = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authSubmitStatus = "idle";
        state.userId = action.payload.userId;
        state.sessionReady = true;
        state.authDialogOpen = false;
        state.configureLoginUserId = null;
      })
      .addCase(loginUser.rejected, (state) => {
        state.authSubmitStatus = "idle";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userId = null;
        state.registerSuccessUserId = null;
        state.sessionReady = true;
        state.authDialogOpen = true;
        state.authDialogMode = "login";
        state.authSubmitStatus = "idle";
      })
      .addCase(logoutUser.rejected, (state) => {
        state.userId = null;
        state.registerSuccessUserId = null;
        state.sessionReady = true;
        state.authDialogOpen = true;
        state.authDialogMode = "login";
        state.authSubmitStatus = "idle";
      });
  },
});

export const {
  setAuthDialogMode,
  setConfigureLoginUserId,
  clearConfigureLoginHint,
  openAuthDialog,
  clearAuth,
  expireSession,
  dismissRegisterSuccess,
} = authSlice.actions;

export const authReducer = authSlice.reducer;

export const selectUserId = (state: { auth: AuthState }) => state.auth.userId;
export const selectIsAuthed = (state: { auth: AuthState }) => state.auth.userId !== null;
export const selectAuthDialogOpen = (state: { auth: AuthState }) => state.auth.authDialogOpen;
export const selectAuthDialogMode = (state: { auth: AuthState }) => state.auth.authDialogMode;
export const selectSessionReady = (state: { auth: AuthState }) => state.auth.sessionReady;
export const selectRegisterSuccessUserId = (state: { auth: AuthState }) =>
  state.auth.registerSuccessUserId;
export const selectAuthSubmitStatus = (state: { auth: AuthState }) => state.auth.authSubmitStatus;
export const selectConfigureLoginUserId = (state: { auth: AuthState }) =>
  state.auth.configureLoginUserId;
export const selectAuthRegisterAllowed = (state: { auth: AuthState }) =>
  state.auth.configureLoginUserId === null;
