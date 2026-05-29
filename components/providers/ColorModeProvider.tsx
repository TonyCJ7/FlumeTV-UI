"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { PaletteMode } from "@mui/material";
import { applyDocumentColorMode } from "@/infra/colorMode/applyDocumentColorMode";
import {
  getClientColorModeSnapshot,
  notifyColorModeChange,
  subscribeColorMode,
} from "@/infra/colorMode/colorModeStore";
import { persistColorMode } from "@/infra/colorMode/resolveColorMode";

type ColorModeContextValue = Readonly<{
  mode: PaletteMode;
  setColorMode: (mode: PaletteMode) => void;
  toggleColorMode: () => void;
}>;

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

type ColorModeProviderProps = Readonly<{
  children: ReactNode;
  /** From server cookie — must match `getServerColorMode()` for SSR/hydration. */
  initialColorMode: PaletteMode;
}>;

export function ColorModeProvider({ children, initialColorMode }: ColorModeProviderProps) {
  const mode = useSyncExternalStore(
    subscribeColorMode,
    getClientColorModeSnapshot,
    () => initialColorMode,
  );

  useLayoutEffect(() => {
    applyDocumentColorMode(mode);
  }, [mode]);

  const setColorMode = useCallback((next: PaletteMode) => {
    persistColorMode(next);
    applyDocumentColorMode(next);
    notifyColorModeChange();
  }, []);

  const toggleColorMode = useCallback(() => {
    const next = mode === "light" ? "dark" : "light";
    setColorMode(next);
  }, [mode, setColorMode]);

  const value = useMemo(
    () => ({ mode, setColorMode, toggleColorMode }),
    [mode, setColorMode, toggleColorMode],
  );

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode(): ColorModeContextValue {
  const ctx = useContext(ColorModeContext);
  if (!ctx) {
    throw new Error("useColorMode must be used within ColorModeProvider");
  }
  return ctx;
}
