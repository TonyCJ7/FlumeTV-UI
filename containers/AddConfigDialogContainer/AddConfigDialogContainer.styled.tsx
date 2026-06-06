import { Box, Stack } from "@mui/material";
import { Button } from "@/components/design-system/Button/Button";
import styled from "@/utils/styled.utils";

/** Body scroll is on DialogShell; this wrapper only stacks form content. */
const ScrollBody = styled(Box)({});

const FooterWrap = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "center",
});

const TabPanel = styled(Box)({
  "& .MuiTextField-root": {
    width: "100%",
  },
});

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
  ScrollBody,
  FooterWrap,
  FieldStack,
  TabPanel,
  PrimarySubmit,
} as const;
