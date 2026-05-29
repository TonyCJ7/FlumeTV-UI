"use client";

import { useId, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { InputAdornment } from "@mui/material";
import { FieldText, type FieldTextProps } from "@/components/design-system/FieldText";
import { Styled } from "./FieldPassword.styled";

type FieldPasswordProps = Omit<FieldTextProps, "type"> &
  Readonly<{
    /** Translated labels for the visibility toggle — supplied by product containers. */
    visibilityToggleAriaLabel: Readonly<{
      hide: string;
      show: string;
    }>;
  }>;

/** Password field with an in-field reveal control. */
export function FieldPassword({
  slotProps,
  visibilityToggleAriaLabel,
  ...rest
}: FieldPasswordProps) {
  const [visible, setVisible] = useState(false);
  const toggleId = useId();

  return (
    <FieldText
      {...rest}
      type={visible ? "text" : "password"}
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          endAdornment: (
            <InputAdornment position="end">
              <Styled.ToggleButton
                id={toggleId}
                type="button"
                edge="end"
                size="small"
                aria-pressed={visible}
                aria-label={
                  visible ? visibilityToggleAriaLabel.hide : visibilityToggleAriaLabel.show
                }
                onClick={() => setVisible((prev) => !prev)}
                tabIndex={rest.disabled ? -1 : 0}
                disabled={rest.disabled}
              >
                {visible ? (
                  <VisibilityOffIcon fontSize="small" />
                ) : (
                  <VisibilityIcon fontSize="small" />
                )}
              </Styled.ToggleButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
