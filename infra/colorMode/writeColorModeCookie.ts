import type { PaletteMode } from "@mui/material";
import {
  COLOR_MODE_COOKIE_MAX_AGE_SECONDS,
  COLOR_MODE_COOKIE_NAME,
} from "@/infra/colorMode/constants";

/** Client: mirror `localStorage` so the next SSR response matches manual choice. */
export function writeColorModeCookie(mode: PaletteMode): void {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${COLOR_MODE_COOKIE_NAME}=${mode}; path=/; max-age=${COLOR_MODE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}
