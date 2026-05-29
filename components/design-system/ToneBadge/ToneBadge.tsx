"use client";

import type { ChipProps } from "@mui/material";
import type { AccentTone } from "@/theme/tokens";
import { Styled } from "./ToneBadge.styled";

export type ToneBadgeProps = Omit<ChipProps, "label"> &
  Readonly<{
    tone: AccentTone;
    label: string;
  }>;

export function ToneBadge({
  tone,
  label,
  size = "small",
  variant = "outlined",
  ...rest
}: ToneBadgeProps) {
  const ChipEl = tone === "teal" ? Styled.TealChip : Styled.VioletChip;
  return <ChipEl label={label} size={size} variant={variant} {...rest} />;
}
