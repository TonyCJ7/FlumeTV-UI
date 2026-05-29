import styled from "@/utils/styled.utils";
import MuiDialog from "@mui/material/Dialog";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogTitle from "@mui/material/DialogTitle";
import { layoutTokens } from "@/theme/tokens";

const Dialog = styled(MuiDialog)({});

const Title = styled(MuiDialogTitle)<{ $hideSeparator?: boolean }>(({ theme, $hideSeparator }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  typography: "subtitle1",
  flexShrink: 0,
  margin: 0,
  padding: $hideSeparator ? theme.spacing(4, 4, 3) : theme.spacing(4),
  borderBottom: $hideSeparator ? "none" : `1px solid ${theme.palette.divider}`,
}));

const Body = styled(MuiDialogContent)<{ $hideSeparator?: boolean; $hasFooter?: boolean }>(
  ({ theme, $hideSeparator, $hasFooter }) => ({
    flex: "1 1 auto",
    minHeight: 0,
    overflowX: "hidden",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    "&&": {
      padding: !$hideSeparator ? theme.spacing(4) : theme.spacing(0, 4, 3),
      paddingBottom: (() => {
        if (!$hasFooter || ($hasFooter && !$hideSeparator)) {
          return theme.spacing(4);
        }
        return theme.spacing(0);
      })(),
    },
    typography: "body1",
  }),
);

const Footer = styled(MuiDialogActions)<{ $hideSeparator?: boolean }>(
  ({ theme, $hideSeparator }) => ({
    flexShrink: 0,
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    margin: 0,
    padding: theme.spacing(3, 4, 4),
    borderTop: $hideSeparator ? "none" : `1px solid ${theme.palette.divider}`,
  }),
);

export const Styled = {
  Dialog,
  Title,
  Body,
  Footer,
  layoutTokens,
} as const;
