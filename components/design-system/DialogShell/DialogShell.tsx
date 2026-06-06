"use client";

import type { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, type DialogProps } from "@mui/material";
import { motion } from "@/theme/tokens";
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
  return (
    <Styled.Dialog
      onClose={onClose}
      fullScreen={fullScreen}
      $fullScreen={fullScreen}
      $isMobile={isMobile}
      slotProps={{
        ...slotProps,
        transition: {
          timeout: motion.durationSlow,
          ...slotProps?.transition,
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
