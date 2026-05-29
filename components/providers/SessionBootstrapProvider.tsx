"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthDialog } from "@/contexts/AuthDialogContext";
import { useConfigureRedirectAuth } from "@/hooks/useConfigureRedirectAuth";
import {
  openAuthDialog,
  selectAuthDialogOpen,
  selectIsAuthed,
  selectSessionReady,
} from "@/store/auth/authSlice";
import { bootstrapSession } from "@/store/auth/authThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { readConfigureUuidFromLocation } from "@/utils/configureRedirect.utils";

type SessionBootstrapProviderProps = Readonly<{
  children: ReactNode;
}>;

/**
 * Runs session bootstrap once per load and wires post-auth navigation,
 * and opens the auth dialog after bootstrap when there is no session.
 * Route guards are client-only — protected pages render disabled chrome until authed.
 */
export function SessionBootstrapProvider({ children }: SessionBootstrapProviderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { setOnLoginSuccess, setOnRegisterSuccess } = useAuthDialog();
  const sessionReady = useAppSelector(selectSessionReady);
  const isAuthed = useAppSelector(selectIsAuthed);
  const authDialogOpen = useAppSelector(selectAuthDialogOpen);
  const bootstrapStartedRef = useRef(false);

  useConfigureRedirectAuth();

  useEffect(() => {
    if (bootstrapStartedRef.current) {
      return;
    }
    bootstrapStartedRef.current = true;
    void dispatch(bootstrapSession());
  }, [dispatch]);

  useEffect(() => {
    setOnRegisterSuccess(() => {
      router.push("/config");
    });
    setOnLoginSuccess(() => {
      const configureUuid = readConfigureUuidFromLocation();
      if (configureUuid) {
        router.replace("/config");
        return;
      }
      router.push("/install");
    });

    return () => {
      setOnRegisterSuccess(null);
      setOnLoginSuccess(null);
    };
  }, [router, setOnLoginSuccess, setOnRegisterSuccess]);

  useEffect(() => {
    if (!sessionReady || isAuthed || authDialogOpen) {
      return;
    }
    if (readConfigureUuidFromLocation()) {
      return;
    }
    dispatch(openAuthDialog("login"));
  }, [authDialogOpen, dispatch, isAuthed, sessionReady]);

  return children;
}
