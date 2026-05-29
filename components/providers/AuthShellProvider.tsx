"use client";

import type { ReactNode } from "react";
import { AuthDialogProvider } from "@/contexts/AuthDialogContext";
import { SessionBootstrapProvider } from "@/components/providers/SessionBootstrapProvider";
import { AuthDialogContainer } from "@/containers/AuthDialogContainer";
import { RegisterSuccessDialogContainer } from "@/containers/RegisterSuccessDialogContainer";

type AuthShellProviderProps = Readonly<{
  children: ReactNode;
}>;

/** Auth bootstrap, dialog, and register-success modal (Steps 7–8). */
export function AuthShellProvider({ children }: AuthShellProviderProps) {
  return (
    <AuthDialogProvider>
      <SessionBootstrapProvider>
        {children}
        <AuthDialogContainer />
        <RegisterSuccessDialogContainer />
      </SessionBootstrapProvider>
    </AuthDialogProvider>
  );
}
