import type { PaletteMode } from "@mui/material";
import { writeColorModeCookie } from "@/infra/colorMode/writeColorModeCookie";
import { COLOR_MODE_STORAGE_KEY } from "@/infra/colorMode/constants";

type ResolvedColorMode = PaletteMode;

function readStoredMode(): ResolvedColorMode | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const value = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (value === "light" || value === "dark") {
      return value;
    }
  } catch {
    /* private mode / blocked storage */
  }
  return null;
}

function readSystemMode(): ResolvedColorMode {
  if (typeof window === "undefined") {
    return "dark";
  }
  try {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  } catch {
    /* matchMedia unavailable */
  }
  return "dark";
}

/** Client-only: saved manual choice, else OS light/dark, else `dark` (incl. `no-preference` / unreadable). */
export function getResolvedColorMode(): ResolvedColorMode {
  return readStoredMode() ?? readSystemMode();
}

export function persistColorMode(mode: ResolvedColorMode): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
  writeColorModeCookie(mode);
}

export function readColorModeFromDomDataset(): ResolvedColorMode | null {
  if (typeof document === "undefined") {
    return null;
  }
  const raw = document.documentElement.getAttribute("data-color-mode");
  if (raw === "light" || raw === "dark") {
    return raw;
  }
  return null;
}
