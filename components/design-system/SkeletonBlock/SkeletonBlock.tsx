"use client";

import { Stack } from "@mui/material";
import { Styled } from "./SkeletonBlock.styled";

type SkeletonBlockProps = Readonly<{
  /** “Card” block for list placeholder intent. */
  showCard?: boolean;
}>;

export function SkeletonBlock({ showCard }: SkeletonBlockProps) {
  if (showCard) {
    return (
      <Styled.Card variant="rounded" animation="wave" aria-hidden>
        &nbsp;
      </Styled.Card>
    );
  }
  return (
    <Stack spacing={1} aria-hidden>
      <Styled.Line variant="rounded" width="100%" height={12} animation="wave" />
      <Styled.Line variant="rounded" width="70%" height={12} animation="wave" />
    </Stack>
  );
}
