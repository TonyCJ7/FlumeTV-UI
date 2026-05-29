"use client";

import Portal from "@mui/material/Portal";
import Snackbar, { type SnackbarProps } from "@mui/material/Snackbar";

/**
 * Snackbar portaled to `document.body` so fixed positioning is not trapped under
 * ancestors with `transform` (e.g. shell main enter animation) below modal layers.
 */
export function ToastSnackbar(props: SnackbarProps) {
  return (
    <Portal>
      <Snackbar
        {...props}
        slotProps={{
          ...props.slotProps,
          root: {
            ...props.slotProps?.root,
            sx: (theme) => ({
              zIndex: theme.zIndex.snackbar,
            }),
          },
        }}
      />
    </Portal>
  );
}
