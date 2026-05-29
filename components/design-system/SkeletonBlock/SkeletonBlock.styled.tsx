import styled from "@/utils/styled.utils";
import { Skeleton } from "@mui/material";
import { layoutTokens } from "@/theme/tokens";

const Line = styled(Skeleton)(() => ({
  borderRadius: layoutTokens.radiusSm,
}));

const Card = styled(Skeleton)(() => ({
  borderRadius: layoutTokens.radiusMd,
  minHeight: 120,
}));

export const Styled = {
  Line,
  Card,
} as const;
