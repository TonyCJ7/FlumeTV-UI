"use client";

import type { ReactNode } from "react";
import { FormControl } from "@mui/material";
import Radio from "@mui/material/Radio";
import { Styled } from "./RadioField.styled";

type RadioFieldOption = Readonly<{
  value: string;
  label: ReactNode;
}>;

type RadioFieldProps = Readonly<{
  name: string;
  label?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: RadioFieldOption[];
  row?: boolean;
}>;

export function RadioField({ name, label, value, onChange, options, row }: RadioFieldProps) {
  return (
    <FormControl component="fieldset" variant="standard">
      {label ? <Styled.GroupLabel>{label}</Styled.GroupLabel> : null}
      <Styled.OptionGroup
        name={name}
        value={value}
        row={row}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <Styled.LabeledControl
            key={opt.value}
            value={opt.value}
            control={<Radio size="small" />}
            label={opt.label}
          />
        ))}
      </Styled.OptionGroup>
    </FormControl>
  );
}
