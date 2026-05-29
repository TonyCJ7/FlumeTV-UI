"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  clearConfigureLoginHint,
  openAuthDialog,
  selectConfigureLoginUserId,
  selectIsAuthed,
  selectSessionReady,
  selectUserId,
  setConfigureLoginUserId,
} from "@/store/auth/authSlice";
import { logoutUser } from "@/store/auth/authThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  parseConfigureUuidFromSearchParams,
  readConfigureUuidFromLocation,
} from "@/utils/configureRedirect.utils";

/**
 * Handles Stremio configure redirect (`/config?uuid=`) after session bootstrap:
 * login-only auth, prefilled account id, logout when session user mismatches.
 */
export function useConfigureRedirectAuth(): void {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const sessionReady = useAppSelector(selectSessionReady);
  const isAuthed = useAppSelector(selectIsAuthed);
  const userId = useAppSelector(selectUserId);
  const configureLoginUserId = useAppSelector(selectConfigureLoginUserId);
  const mismatchLogoutStartedRef = useRef(false);
  const lastConfigureUuidRef = useRef<string | null>(null);

  useEffect(() => {
    if (pathname !== "/config") {
      if (configureLoginUserId !== null) {
        dispatch(clearConfigureLoginHint());
      }
      mismatchLogoutStartedRef.current = false;
      lastConfigureUuidRef.current = null;
      return;
    }

    const configureUuid = readConfigureUuidFromLocation();
    if (configureUuid !== lastConfigureUuidRef.current) {
      mismatchLogoutStartedRef.current = false;
      lastConfigureUuidRef.current = configureUuid;
    }

    if (!configureUuid) {
      if (configureLoginUserId !== null) {
        dispatch(clearConfigureLoginHint());
      }
      return;
    }

    dispatch(setConfigureLoginUserId(configureUuid));

    if (!sessionReady) {
      return;
    }

    if (isAuthed && userId === configureUuid) {
      const params = new URLSearchParams(window.location.search);
      if (parseConfigureUuidFromSearchParams(params) !== null) {
        router.replace("/config");
      }
      dispatch(clearConfigureLoginHint());
      return;
    }

    if (isAuthed && userId !== configureUuid) {
      if (mismatchLogoutStartedRef.current) {
        return;
      }
      mismatchLogoutStartedRef.current = true;
      void dispatch(logoutUser());
      return;
    }

    dispatch(openAuthDialog("login"));
  }, [configureLoginUserId, dispatch, isAuthed, pathname, router, sessionReady, userId]);
}
