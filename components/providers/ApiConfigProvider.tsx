"use client";

import { createContext, useContext, useLayoutEffect, type ReactNode } from "react";
import { configureApiClientBaseUrl } from "@/infra/apiClient";

type ApiConfigContextValue = Readonly<{
  baseApiUrl: string;
}>;

const ApiConfigContext = createContext<ApiConfigContextValue | null>(null);

type ApiConfigProviderProps = Readonly<{
  children: ReactNode;
  /** From server `parseBaseApiUrl(process.env.BASE_API_URL)` — must match SSR for hydration. */
  baseApiUrl: string;
}>;

/**
 * Injects runtime `BASE_API_URL` into axios (thunks) and React context (SSE hooks).
 * Wrap the full client tree, outside `ReduxProvider`.
 */
export function ApiConfigProvider({ children, baseApiUrl }: ApiConfigProviderProps) {
  useLayoutEffect(() => {
    configureApiClientBaseUrl(baseApiUrl);
  }, [baseApiUrl]);

  return <ApiConfigContext.Provider value={{ baseApiUrl }}>{children}</ApiConfigContext.Provider>;
}

export function useBaseApiUrl(): string {
  const ctx = useContext(ApiConfigContext);
  if (!ctx) {
    throw new Error("useBaseApiUrl must be used within ApiConfigProvider");
  }
  return ctx.baseApiUrl;
}
