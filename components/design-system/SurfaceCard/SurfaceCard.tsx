"use client";

import type { PaperProps } from "@mui/material";
import type { ReactNode } from "react";
import { Styled } from "./SurfaceCard.styled";

type SurfaceCardProps = PaperProps &
  Readonly<{
    children: ReactNode;
  }>;

export function SurfaceCard({ children, ...rest }: SurfaceCardProps) {
  return <Styled.Root {...rest}>{children}</Styled.Root>;
}
