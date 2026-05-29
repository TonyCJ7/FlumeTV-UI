"use client";

import type { ReactNode } from "react";
import Checkbox from "@mui/material/Checkbox";
import { Styled } from "./CheckField.styled";

type CheckFieldProps = Readonly<{
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}>;

export function CheckField({ label, checked, onChange, disabled }: CheckFieldProps) {
  return (
    <Styled.LabeledControl
      disabled={disabled}
      control={
        <Checkbox
          size="small"
          checked={checked}
          onChange={(_, value) => onChange(value)}
          slotProps={{
            input: {
              "aria-checked": checked,
            },
          }}
        />
      }
      label={label}
    />
  );
}
