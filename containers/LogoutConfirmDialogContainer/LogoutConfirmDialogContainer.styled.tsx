import { Stack } from "@mui/material";
import styled from "@/utils/styled.utils";

const ActionsRow = styled(Stack)(({ theme }) => ({
  width: "100%",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

export const Styled = {
  ActionsRow,
} as const;
