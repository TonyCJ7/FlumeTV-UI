"use client";

import type { ButtonProps as MuiButtonProps } from "@mui/material";
import { Styled } from "./DonateButton.styled";

type DonateButtonProps = Omit<MuiButtonProps, "variant" | "color">;

/** Product-only donate CTA — gradient styling lives in `theme/brand`. */
export function DonateButton({ children, ...rest }: DonateButtonProps) {
  return (
    <Styled.Button variant="contained" disableElevation {...rest}>
      {children}
    </Styled.Button>
  );
}
