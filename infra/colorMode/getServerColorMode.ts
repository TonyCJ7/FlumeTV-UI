import type { PaletteMode } from "@mui/material";
import { cookies } from "next/headers";
import { COLOR_MODE_COOKIE_NAME } from "@/infra/colorMode/constants";
import { parseColorModeValue } from "@/infra/colorMode/parseColorModeValue";

/** Server layout: cookie from last toggle, else `dark` (OS preference applied client-side before hydration). */
export async function getServerColorMode(): Promise<PaletteMode> {
  const cookieStore = await cookies();
  return parseColorModeValue(cookieStore.get(COLOR_MODE_COOKIE_NAME)?.value) ?? "dark";
}
