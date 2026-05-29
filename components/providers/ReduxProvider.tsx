"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { registerApiClientUnauthorizedHandler } from "@/infra/apiClient";
import { expireSession } from "@/store/auth/authSlice";
import { makeStore, type AppStore } from "@/store/store";

type ReduxProviderProps = Readonly<{
  children: ReactNode;
}>;

export function ReduxProvider({ children }: ReduxProviderProps) {
  const [store] = useState<AppStore>(() => makeStore());

  useEffect(() => {
    registerApiClientUnauthorizedHandler(() => {
      store.dispatch(expireSession());
    });

    return () => {
      registerApiClientUnauthorizedHandler(null);
    };
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
