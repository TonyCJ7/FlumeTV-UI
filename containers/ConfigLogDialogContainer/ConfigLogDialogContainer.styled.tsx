import { Stack, Typography } from "@mui/material";
import styled from "@/utils/styled.utils";

const LogBody = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
}));

const LogHint = styled(Typography)({
  margin: 0,
});

export const Styled = {
  LogBody,
  LogHint,
} as const;
