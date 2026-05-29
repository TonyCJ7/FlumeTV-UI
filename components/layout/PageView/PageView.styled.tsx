import { Box, Stack } from "@mui/material";
import { SurfaceCard } from "@/components/design-system/SurfaceCard/SurfaceCard";
import { layoutTokens } from "@/theme/tokens";
import styled from "@/utils/styled.utils";

/** Full width of `AppLayout` main (no `maxWidth="md"` cap). */
/** No extra inset — shell `gap` / mobile `main` padding only. */
const PageContainer = styled(Box)({
  width: "100%",
  maxWidth: "100%",
  margin: 0,
  padding: 0,
});

const PagePanel = styled(SurfaceCard)(({ theme }) => ({
  padding: theme.spacing(4),
}));

/** Panel title — size only; normal weight (not brand 600). */
const PanelTitle = styled("h2")(({ theme }) => ({
  typography: "h2",
  margin: `0 0 ${theme.spacing(3)}`,
  color: theme.palette.text.primary,
}));

const PanelHint = styled("p")(({ theme }) => ({
  typography: "body2",
  color: theme.palette.text.secondary,
  margin: `0 0 ${theme.spacing(3)}`,
}));

const PanelInner = styled(Stack)<{ $gap?: "none" | "tight" | "normal" }>(
  ({ theme, $gap = "normal" }) => ({
    gap: $gap === "none" ? 0 : $gap === "tight" ? theme.spacing(1.5) : theme.spacing(2),
  }),
);

const MonospaceInline = styled("span")({
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
});

const FieldStackForm = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  maxWidth: layoutTokens.fieldMaxWidth,
  "& .MuiTextField-root": {
    width: "100%",
  },
}));

const InlineSignInButton = styled("button")(({ theme }) => ({
  border: 0,
  padding: 0,
  margin: 0,
  background: "transparent",
  color: theme.palette.primary.main,
  cursor: "pointer",
  font: "inherit",
  textDecoration: "underline",
}));

/** Prototype `.stremio-actions` — stacked full-width below `sm` (600px); row at tablet+ */
const StremioActions = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: theme.spacing(3),
  maxWidth: "28rem",
  "& .MuiButton-root": {
    width: "100%",
  },
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    maxWidth: "none",
    "& .MuiButton-root": {
      width: "auto",
    },
  },
}));

const StremioOrLabel = styled("span")(({ theme }) => ({
  typography: "body2",
  textAlign: "center",
  flexShrink: 0,
  fontWeight: 600,
  letterSpacing: "0.04em",
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  [theme.breakpoints.up("sm")]: {
    minWidth: "2.5rem",
  },
}));

export const Styled = {
  PageContainer,
  PagePanel,
  PanelTitle,
  PanelHint,
  PanelInner,
  MonospaceInline,
  FieldStackForm,
  InlineSignInButton,
  StremioActions,
  StremioOrLabel,
} as const;
