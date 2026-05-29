import type { PaletteMode } from "@mui/material";

export function parseColorModeValue(value: string | undefined | null): PaletteMode | null {
  if (value === "light" || value === "dark") {
    return value;
  }
  return null;
}
