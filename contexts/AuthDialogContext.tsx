"use client";

import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";

type AuthSuccessHandler = (userId: string) => void;

type AuthDialogContextValue = Readonly<{
  setOnRegisterSuccess: (handler: AuthSuccessHandler | null) => void;
  setOnLoginSuccess: (handler: AuthSuccessHandler | null) => void;
  notifyRegisterSuccess: (userId: string) => void;
  notifyLoginSuccess: (userId: string) => void;
}>;

const AuthDialogContext = createContext<AuthDialogContextValue | null>(null);

type AuthDialogProviderProps = Readonly<{
  children: ReactNode;
}>;

export function AuthDialogProvider({ children }: AuthDialogProviderProps) {
  const onRegisterSuccessRef = useRef<AuthSuccessHandler | null>(null);
  const onLoginSuccessRef = useRef<AuthSuccessHandler | null>(null);

  const setOnRegisterSuccess = useCallback((handler: AuthSuccessHandler | null) => {
    onRegisterSuccessRef.current = handler;
  }, []);

  const setOnLoginSuccess = useCallback((handler: AuthSuccessHandler | null) => {
    onLoginSuccessRef.current = handler;
  }, []);

  const notifyRegisterSuccess = useCallback((userId: string) => {
    onRegisterSuccessRef.current?.(userId);
  }, []);

  const notifyLoginSuccess = useCallback((userId: string) => {
    onLoginSuccessRef.current?.(userId);
  }, []);

  const value = useMemo(
    () => ({
      setOnRegisterSuccess,
      setOnLoginSuccess,
      notifyRegisterSuccess,
      notifyLoginSuccess,
    }),
    [setOnRegisterSuccess, setOnLoginSuccess, notifyRegisterSuccess, notifyLoginSuccess],
  );

  return <AuthDialogContext.Provider value={value}>{children}</AuthDialogContext.Provider>;
}

export function useAuthDialog(): AuthDialogContextValue {
  const context = useContext(AuthDialogContext);
  if (!context) {
    throw new Error("useAuthDialog must be used within AuthDialogProvider");
  }
  return context;
}
