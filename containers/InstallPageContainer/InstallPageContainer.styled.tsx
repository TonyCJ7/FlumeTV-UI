import { Box, IconButton } from "@mui/material";
import { Button } from "@/components/design-system/Button/Button";
import { PageViewStyled } from "@/components/layout/PageView";
import { getSlateTokenSet, layoutTokens } from "@/theme/tokens";
import styled from "@/utils/styled.utils";

const accountIdStripShell = (theme: {
  palette: { mode: "light" | "dark" };
  spacing: (n: number) => string | number;
}) => {
  const slate = getSlateTokenSet(theme.palette.mode);
  return {
    borderRadius: layoutTokens.radiusMd,
    border: `1px solid ${slate.border}`,
    background: slate.surface2,
    overflow: "hidden" as const,
  };
};

/** Tablet+ (`sm`+): label, UUID, and copy on one row inside a single strip. */
const AccountIdRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 0,
    ...accountIdStripShell(theme),
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: "0.8125rem",
    lineHeight: 1.45,
  },
}));

const AccountIdLabel = styled("span")(({ theme }) => {
  const slate = getSlateTokenSet(theme.palette.mode);
  return {
    typography: "body2",
    color: theme.palette.text.secondary,
    flexShrink: 0,
    margin: 0,
    [theme.breakpoints.up("sm")]: {
      display: "inline-flex",
      alignItems: "center",
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
      borderRight: `1px solid ${slate.border}`,
      background: `color-mix(in srgb, ${slate.surface} 70%, ${slate.surface2})`,
      fontFamily: theme.typography.body2.fontFamily,
      fontSize: theme.typography.body2.fontSize,
      whiteSpace: "nowrap",
    },
  };
});

const AccountIdValueWrap = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "stretch",
  flex: 1,
  minWidth: 0,
  gap: 0,
  [theme.breakpoints.down("sm")]: {
    ...accountIdStripShell(theme),
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: "0.8125rem",
    lineHeight: 1.45,
  },
}));

const AccountIdCode = styled("code")(({ theme }) => ({
  flex: 1,
  margin: 0,
  minWidth: 0,
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1),
  wordBreak: "break-all",
  whiteSpace: "pre-wrap",
  font: "inherit",
  color: theme.palette.text.primary,
  backgroundColor: "transparent",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
    alignItems: "center",
    wordBreak: "normal",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const CopyAccountIdButton = styled(IconButton)(({ theme }) => {
  const slate = getSlateTokenSet(theme.palette.mode);
  return {
    flexShrink: 0,
    width: 44,
    height: "auto",
    margin: 0,
    padding: 0,
    borderRadius: 0,
    borderLeft: `1px solid ${slate.border}`,
    background: `color-mix(in srgb, ${slate.surface} 70%, ${slate.surface2})`,
    color: slate.textMuted,
    "&:hover": {
      color: slate.text,
      background: slate.surface,
    },
  };
});

/** Prototype `#btn-change-password` — inline width; gap after last `.field` (`margin-bottom: space-3`). */
const UpdatePasswordButton = styled(Button)(({ theme }) => ({
  alignSelf: "flex-start",
  width: "auto",
  maxWidth: "100%",
  marginTop: theme.spacing(3),
}));

export const Styled = {
  PageContainer: PageViewStyled.PageContainer,
  PagePanel: PageViewStyled.PagePanel,
  PanelTitle: PageViewStyled.PanelTitle,
  PanelHint: PageViewStyled.PanelHint,
  PanelInner: PageViewStyled.PanelInner,
  AccountIdRow,
  AccountIdLabel,
  AccountIdValueWrap,
  AccountIdCode,
  CopyAccountIdButton,
  FieldStackForm: PageViewStyled.FieldStackForm,
  StremioActions: PageViewStyled.StremioActions,
  StremioOrLabel: PageViewStyled.StremioOrLabel,
  UpdatePasswordButton,
} as const;
