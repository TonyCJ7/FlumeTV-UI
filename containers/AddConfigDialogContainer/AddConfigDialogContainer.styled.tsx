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

/** EPG fieldset block (bordered section above EPG fields). */
const EpgFieldset = styled("fieldset")(({ theme }) => ({
  border: 0,
  margin: `${theme.spacing(4)} 0 0`,
  padding: `${theme.spacing(3)} 0 0`,
  borderTop: `1px solid ${theme.palette.divider}`,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}));

const EpgLegend = styled("legend")(({ theme }) => ({
  margin: 0,
  padding: 0,
  typography: "body2",
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

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
  EpgFieldset,
  EpgLegend,
  FieldStack,
  TabPanel,
  PrimarySubmit,
} as const;
