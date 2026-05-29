import type { PaletteMode } from "@mui/material";
import { getSlateTokenSet } from "@/theme/tokens";

/** Syncs `<html>` dataset, `color-scheme`, and page background before hydration. */
export function applyDocumentColorMode(mode: PaletteMode): void {
  if (typeof document === "undefined") {
    return;
  }

  const bg = getSlateTokenSet(mode).bg;

  document.documentElement.setAttribute("data-color-mode", mode);
  document.documentElement.style.colorScheme = mode === "light" ? "light" : "dark";
  document.documentElement.style.backgroundColor = bg;

  if (document.body) {
    document.body.style.backgroundColor = bg;
  }
}
