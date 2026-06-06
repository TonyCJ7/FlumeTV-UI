"use client";

import { Stack } from "@mui/material";
import type { ReactNode } from "react";
import { Styled } from "@/components/core/ConfigEpgFieldset/ConfigEpgFieldset.styled";

type ConfigEpgFieldsetProps = Readonly<{
  legend: string;
  epgEnabled: boolean;
  children: ReactNode;
}>;

/** Bordered EPG section with collapsible inner stack spacing when EPG is disabled. */
export function ConfigEpgFieldset({ legend, epgEnabled, children }: ConfigEpgFieldsetProps) {
  return (
    <Styled.EpgFieldset>
      <Styled.EpgLegend>{legend}</Styled.EpgLegend>
      <Stack spacing={epgEnabled ? 3 : 0}>{children}</Stack>
    </Styled.EpgFieldset>
  );
}
