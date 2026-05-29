import { Box, Drawer, IconButton } from "@mui/material";
import { Button } from "@/components/design-system/Button/Button";
import { keyframes } from "@emotion/react";
import { layoutTokens } from "@/theme/tokens";
import styled from "@/utils/styled.utils";

/** Opacity only — `transform` on `main` traps `position: fixed` toasts below modal portals. */
const viewFadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Shell = styled(Box)(({ theme }) => ({
  maxWidth: 1200,
  margin: "0 auto",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    gap: 0,
  },
}));

const Main = styled("main")(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  animation: `${viewFadeIn} ${theme.transitions.duration.complex}ms ${theme.transitions.easing.easeOut} both`,
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(4),
  },
}));

const Header = styled("header")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(10),
  padding: theme.spacing(3, 4),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: layoutTokens.radiusLg,
  boxShadow: theme.shadows[1],
  [theme.breakpoints.up("md")]: {
    flexWrap: "nowrap",
  },
  "@media (min-width: 600px) and (max-width: 969px)": {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gridTemplateRows: "auto auto",
    columnGap: theme.spacing(3),
    rowGap: theme.spacing(3),
  },
  [theme.breakpoints.down("sm")]: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    gridTemplateRows: "auto",
    columnGap: theme.spacing(2),
    rowGap: 0,
    padding: theme.spacing(2, 3, 3),
    position: "sticky",
    top: 0,
    zIndex: theme.zIndex.appBar,
    width: "100%",
    borderRadius: 0,
    borderLeft: "none",
    borderRight: "none",
    boxShadow: theme.shadows[4],
  },
}));

const Brand = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  minWidth: 0,
  "@media (min-width: 600px) and (max-width: 969px)": {
    gridColumn: 1,
    gridRow: 1,
  },
  [theme.breakpoints.down("sm")]: {
    gridColumn: 2,
    gridRow: 1,
  },
}));

const BrandLogo = styled("img")(({ theme }) => ({
  display: "block",
  height: theme.typography.pxToRem(44),
  width: "auto",
  maxWidth: "100%",
  objectFit: "contain",
  [theme.breakpoints.down("sm")]: {
    height: theme.typography.pxToRem(28),
  },
}));

const MenuToggle = styled(IconButton)(({ theme }) => ({
  display: "none",
  width: 44,
  height: 44,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: layoutTokens.radiusLg,
  backgroundColor: theme.palette.action.hover,
  [theme.breakpoints.down("sm")]: {
    display: "inline-flex",
    gridColumn: 1,
    gridRow: 1,
  },
}));

const MenuIcon = styled("span", {
  shouldForwardProp: (prop) => prop !== "$open",
})<{ $open?: boolean }>(({ $open }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: 5,
  width: 18,
  height: 14,
  "& span": {
    display: "block",
    height: 2,
    width: "100%",
    borderRadius: 1,
    backgroundColor: "currentColor",
    transition: "transform 0.2s ease, opacity 0.2s ease",
  },
  ...($open
    ? {
        "& span:nth-of-type(1)": { transform: "translateY(7px) rotate(45deg)" },
        "& span:nth-of-type(2)": { opacity: 0 },
        "& span:nth-of-type(3)": { transform: "translateY(-7px) rotate(-45deg)" },
      }
    : {}),
}));

const NavRegion = styled(Box)(({ theme }) => ({
  flex: "1 1 0",
  minWidth: 0,
  width: "100%",
  "& nav": {
    width: "100%",
  },
  "@media (min-width: 600px) and (max-width: 969px)": {
    gridColumn: "1 / -1",
    gridRow: 2,
    width: "100%",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const HeaderActions = styled(Box)(({ theme }) => ({
  display: "flex",
  flexShrink: 0,
  alignItems: "center",
  gap: theme.spacing(2),
  flexWrap: "wrap",
  justifyContent: "flex-end",
  "@media (min-width: 600px) and (max-width: 969px)": {
    gridColumn: 2,
    gridRow: 1,
    justifySelf: "end",
  },
  [theme.breakpoints.down("sm")]: {
    gridColumn: 3,
    gridRow: 1,
    flexWrap: "nowrap",
    gap: theme.spacing(1),
  },
}));

const DrawerBrand = styled(Brand)({
  justifyContent: "flex-start",
});

const ShellLogoutButton = styled(Button)(({ theme }) => ({
  minHeight: 44,
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const DonateDesktop = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
  "@media (max-width: 380px)": {
    "& .btn-donate-label": {
      display: "none",
    },
    "& .MuiButton-root": {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      gap: 0,
    },
  },
}));

const DrawerSheetTop = styled(Box)(({ theme }) => ({
  display: "none",
  flexShrink: 0,
  [theme.breakpoints.down("sm")]: {
    display: "block",
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: `color-mix(in srgb, ${theme.palette.primary.main} 8%, ${theme.palette.background.paper})`,
  },
}));

const DrawerBody = styled(Box)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    flex: "1 1 auto",
    minHeight: 0,
    padding: theme.spacing(2),
  },
}));

const DrawerDonateWrap = styled(Box)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    flexDirection: "column",
    paddingTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}));

const BottomDonate = styled(Box)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(4),
    paddingBottom: `max(${theme.spacing(6)}, env(safe-area-inset-bottom, 0px))`,
    "& .view-bottom-donate__btn": {
      width: "100%",
      maxWidth: layoutTokens.bottomDonateMaxWidth,
    },
  },
}));

const NavDrawer = styled(Drawer)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("sm")]: {
    display: "block",
    "& .MuiDrawer-paper": {
      width: "min(100vw - 48px, 320px)",
      padding: 0,
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    },
  },
}));

export const Styled = {
  Shell,
  Main,
  Header,
  Brand,
  BrandLogo,
  MenuToggle,
  MenuIcon,
  NavRegion,
  HeaderActions,
  DrawerBrand,
  ShellLogoutButton,
  DonateDesktop,
  DrawerSheetTop,
  DrawerBody,
  DrawerDonateWrap,
  BottomDonate,
  NavDrawer,
} as const;
