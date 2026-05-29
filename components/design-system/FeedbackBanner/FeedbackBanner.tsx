"use client";

import type { AlertProps } from "@mui/material";
import { Styled } from "./FeedbackBanner.styled";

type FeedbackBannerProps = AlertProps;

export function FeedbackBanner(props: FeedbackBannerProps) {
  return <Styled.Root variant="outlined" {...props} />;
}
