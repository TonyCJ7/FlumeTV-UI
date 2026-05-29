import type { PaletteMode } from "@mui/material";
import { COLOR_MODE_STORAGE_KEY } from "@/infra/colorMode/constants";
import {
  getResolvedColorMode,
  readColorModeFromDomDataset,
} from "@/infra/colorMode/resolveColorMode";

const COLOR_MODE_CHANGE_EVENT = "flumetv-color-mode-change";

export function getClientColorModeSnapshot(): PaletteMode {
  return readColorModeFromDomDataset() ?? getResolvedColorMode();
}

export function notifyColorModeChange(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(COLOR_MODE_CHANGE_EVENT));
}

export function subscribeColorMode(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key !== COLOR_MODE_STORAGE_KEY) {
      return;
    }
    onStoreChange();
  };

  const onCustom = () => {
    onStoreChange();
  };

  const onSystemChange = () => {
    try {
      const hasManual = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
      if (hasManual === "light" || hasManual === "dark") {
        return;
      }
    } catch {
      return;
    }
    onStoreChange();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(COLOR_MODE_CHANGE_EVENT, onCustom);

  const mq = window.matchMedia("(prefers-color-scheme: light)");
  mq.addEventListener("change", onSystemChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(COLOR_MODE_CHANGE_EVENT, onCustom);
    mq.removeEventListener("change", onSystemChange);
  };
}
