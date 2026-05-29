"use client";

import type { ButtonProps as MuiButtonProps } from "@mui/material";
import { Styled, type ButtonAppearance } from "./Button.styled";

type ButtonProps = Omit<MuiButtonProps, "variant" | "color"> & {
  appearance?: ButtonAppearance;
};

function resolveMuiVariant(
  appearance: ButtonAppearance,
): Pick<MuiButtonProps, "variant" | "color"> {
  switch (appearance) {
    case "secondary":
      return { variant: "outlined", color: "primary" };
    case "primary":
    case "chip":
    case "chipPrimary":
      return { variant: "contained", color: "inherit" };
    case "ghost":
    case "link":
      return { variant: "text", color: "primary" };
    case "danger":
      return { variant: "contained", color: "error" };
    default:
      return { variant: "contained", color: "inherit" };
  }
}

/** Design-system button — primary, secondary, link, chip variants. */
export function Button({ appearance = "primary", children, size, ...rest }: ButtonProps) {
  const mui = resolveMuiVariant(appearance);
  const isChipVariant = appearance === "chip" || appearance === "chipPrimary";

  return (
    <Styled.Button
      {...mui}
      $dsAppearance={appearance}
      size={size ?? (isChipVariant ? "small" : undefined)}
      {...rest}
    >
      {children}
    </Styled.Button>
  );
}
