"use client";

import type { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, useTheme, type DialogProps } from "@mui/material";
import { layoutTokens, motion } from "@/theme/tokens";
import { Styled } from "./DialogShell.styled";
import { useIsMobileBreakpoint } from "@/hooks/useLayoutMode";

type DialogShellProps = Omit<DialogProps, "title"> &
  Readonly<{
    title: ReactNode;
    onDismiss?: () => void;
    closeAriaLabel?: string;
    footer?: ReactNode;
    children: ReactNode;
    hideHeaderSeparator?: boolean;
    hideFooterSeparator?: boolean;
  }>;

export function DialogShell({
  title,
  children,
  footer,
  onDismiss,
  closeAriaLabel,
  onClose,
  slotProps,
  hideHeaderSeparator = false,
  hideFooterSeparator = false,
  fullScreen = false,
  ...rest
}: DialogShellProps) {
  const isMobile = useIsMobileBreakpoint();
  const theme = useTheme();
  return (
    <Styled.Dialog
      onClose={onClose}
      fullScreen={fullScreen}
      slotProps={{
        ...slotProps,
        transition: {
          timeout: motion.durationSlow,
          ...slotProps?.transition,
        },
        paper: {
          ...slotProps?.paper,
          sx: {
            borderRadius: fullScreen ? 0 : layoutTokens.radiusLg,
            display: "flex",
            flexDirection: "column",
            maxHeight: fullScreen ? "100vh" : "90vh",
            overflow: "hidden",
            padding: 0,
            width: "100%",
            margin: fullScreen ? 0 : theme.spacing(4),
            maxWidth: !isMobile ? layoutTokens.dialogWidthDefault : "100%",
            ...(fullScreen
              ? {}
              : {
                  height: "auto",
                  alignSelf: "center",
                }),
            ...(slotProps?.paper && typeof slotProps.paper === "object" && "sx" in slotProps.paper
              ? (slotProps.paper.sx as object)
              : {}),
          },
        },
        backdrop: {
          ...slotProps?.backdrop,
          sx: {
            backdropFilter: "blur(3px)",
          },
        },
      }}
      {...rest}
    >
      <Styled.Title $hideSeparator={hideHeaderSeparator}>
        <span>{title}</span>
        {onDismiss ? (
          <IconButton aria-label={closeAriaLabel} onClick={onDismiss} size="small" edge="end">
            <CloseIcon fontSize="small" />
          </IconButton>
        ) : null}
      </Styled.Title>
      <Styled.Body $hideSeparator={hideFooterSeparator} $hasFooter={!!footer}>
        {children}
      </Styled.Body>
      {footer ? <Styled.Footer $hideSeparator={hideFooterSeparator}>{footer}</Styled.Footer> : null}
    </Styled.Dialog>
  );
}
