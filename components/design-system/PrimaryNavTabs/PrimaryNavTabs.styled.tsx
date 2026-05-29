import styled from "@/utils/styled.utils";
import { getPrimaryNavTabTokenSet, getSlateTokenSet, layoutTokens } from "@/theme/tokens";

const Nav = styled("nav", {
  shouldForwardProp: (prop) => prop !== "$drawer",
})<{ $drawer?: boolean }>(({ theme, $drawer }) => ({
  display: $drawer ? "flex" : "grid",
  flexDirection: $drawer ? "column" : undefined,
  gridTemplateColumns: $drawer ? undefined : "1fr 1fr",
  alignItems: "stretch",
  gap: theme.spacing(2),
  flex: "1 1 0",
  minWidth: 0,
  width: "100%",
}));

const TabButton = styled("button")(({ theme }) => {
  const slate = getSlateTokenSet(theme.palette.mode);
  const navTab = getPrimaryNavTabTokenSet(theme.palette.mode);

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(2),
    minWidth: 0,
    minHeight: 44,
    padding: theme.spacing(2, 3),
    border: `1px solid ${navTab.inactiveBorder}`,
    borderRadius: layoutTokens.radiusMd,
    background: "transparent",
    color: slate.textMuted,
    font: "inherit",
    fontWeight: 600,
    lineHeight: 1.3,
    cursor: "pointer",
    transition: `color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}, background ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}, border-color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}, box-shadow ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}`,
    '&:hover:not([aria-current="true"])': {
      color: slate.text,
      borderColor: navTab.hoverBorder,
      "& .primary-nav-tab__icon": {
        color: slate.text,
      },
    },
    '&[aria-current="true"]': {
      color: slate.text,
      borderColor: slate.primary,
      background: navTab.activeBackground,
      boxShadow: navTab.activeBoxShadow,
      "& .primary-nav-tab__icon": {
        color: slate.primary,
      },
      "&:hover .primary-nav-tab__icon": {
        color: slate.primary,
      },
    },
    [theme.breakpoints.down("sm")]: {
      justifyContent: "flex-start",
      textAlign: "left",
      width: "100%",
      gap: theme.spacing(1),
      typography: "body2",
      paddingBlock: theme.spacing(2),
      "& .primary-nav-tab__icon svg": {
        width: 18,
        height: 18,
      },
    },
  };
});

const TabIcon = styled("span")(({ theme }) => {
  const slate = getSlateTokenSet(theme.palette.mode);
  return {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    color: slate.textMuted,
    transition: `color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}`,
  };
});

const TabLabel = styled("span")({
  textAlign: "left",
  typography: "subtitle1",
  minWidth: 0,
});

export const Styled = {
  Nav,
  TabButton,
  TabIcon,
  TabLabel,
} as const;
