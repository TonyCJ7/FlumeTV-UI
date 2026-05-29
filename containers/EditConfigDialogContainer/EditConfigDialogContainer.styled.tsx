import { Stack } from "@mui/material";
import { Button } from "@/components/design-system/Button/Button";
import styled from "@/utils/styled.utils";

const TitleRow = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  minWidth: 0,
}));

const FieldStack = styled(Stack)({
  "& .MuiTextField-root": {
    width: "100%",
  },
});

const PrimarySubmit = styled(Button)({
  width: "100%",
  maxWidth: "34rem",
  minHeight: 48,
});

export const Styled = {
  TitleRow,
  FieldStack,
  PrimarySubmit,
} as const;
