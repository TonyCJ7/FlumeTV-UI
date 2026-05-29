"use client";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

/** Below 600px (`sm`) — hamburger shell, drawer nav, bottom donate duplicate. */
export function useIsMobileBreakpoint(): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
}

/** Below 600px (`sm`) — dialog `fullScreen`; tablet+ uses fit-content paper capped at `90vh`. */
export function useDialogFullScreen(): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
}
