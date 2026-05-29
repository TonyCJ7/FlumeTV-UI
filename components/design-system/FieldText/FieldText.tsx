"use client";

import type { TextFieldProps as MuiTextFieldProps } from "@mui/material";
import { Styled } from "./FieldText.styled";

export type FieldTextProps = MuiTextFieldProps;

/**
 * Text field + optional error line (Mui FormHelperText).
 * Presentation-only wrapper around Material **TextField**.
 */
export function FieldText({ helperText, error, slotProps, ...rest }: FieldTextProps) {
  return (
    <Styled.Field
      fullWidth
      variant="outlined"
      error={error}
      helperText={helperText}
      slotProps={{
        ...slotProps,
        formHelperText: {
          component: "div",
          role: error ? "alert" : undefined,
          sx: { typography: "caption" },
          ...slotProps?.formHelperText,
        },
      }}
      {...rest}
    />
  );
}
