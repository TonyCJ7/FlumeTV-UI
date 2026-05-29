import styled from "@/utils/styled.utils";
import { Paper } from "@mui/material";
import { layoutTokens } from "@/theme/tokens";

const Root = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  borderRadius: layoutTokens.radiusLg,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
}));

export const Styled = {
  Root,
} as const;
