"use client";

import type { AlertProps } from "@mui/material";
import { Styled } from "./ToastWell.styled";

type ToastWellProps = AlertProps;

/** Static toast presentation (product will use **Snackbar** + this styling). */
export function ToastWell({ severity = "info", variant = "outlined", ...rest }: ToastWellProps) {
  return <Styled.Root severity={severity} variant={variant} {...rest} />;
}
