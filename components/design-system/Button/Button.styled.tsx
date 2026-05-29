import type { Theme } from "@mui/material/styles";
import MuiButton from "@mui/material/Button";
import { getButtonAppearanceTokenSet, getSlateTokenSet, layoutTokens } from "@/theme/tokens";
import styled from "@/utils/styled.utils";

export type ButtonAppearance =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "link"
  | "chip"
  | "chipPrimary";

function appearanceStyles(theme: Theme, appearance: ButtonAppearance) {
  const slate = getSlateTokenSet(theme.palette.mode);
  const buttonAppearance = getButtonAppearanceTokenSet(theme.palette.mode);
  switch (appearance) {
    case "primary":
      return {
        backgroundColor: slate.primary,
        color: slate.onPrimary,
        border: "1px solid transparent",
        "&:hover:not(:disabled)": {
          backgroundColor: slate.primaryHover,
        },
      };
    case "secondary":
      return {
        backgroundColor: "transparent",
        color: slate.primary,
        border: `1px solid ${slate.primary}`,
        "&:hover:not(:disabled)": {
          backgroundColor: buttonAppearance.secondaryHoverBackground,
          borderColor: slate.primaryHover,
          color: slate.primaryHover,
        },
        "&:active:not(:disabled)": {
          backgroundColor: `color-mix(in srgb, ${slate.primary} 14%, ${slate.surface})`,
        },
      };
    case "ghost":
      return {
        color: slate.link,
        backgroundColor: "transparent",
        border: `1px solid ${slate.border}`,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      };
    case "link":
      return {
        minHeight: "auto",
        padding: "4px 8px",
        color: theme.palette.primary.main,
        textDecoration: "none",
        textUnderlineOffset: 3,
        "&:hover:not(:disabled)": {
          textDecoration: "underline",
          backgroundColor: "transparent",
        },
      };
    case "chip":
      return {
        minHeight: "auto",
        fontSize: "0.75rem",
        fontWeight: 600,
        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
        textTransform: "none",
        color: slate.text,
        backgroundColor: slate.surface2,
        border: `1px solid ${slate.border}`,
        borderRadius: layoutTokens.radiusSm,
        boxShadow: "none",
        "&:hover:not(:disabled)": {
          backgroundColor: slate.surface,
          borderColor: `color-mix(in srgb, ${slate.primary} 30%, ${slate.border})`,
        },
      };
    case "chipPrimary":
      return {
        minHeight: "auto",
        fontSize: "0.75rem",
        fontWeight: 600,
        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
        textTransform: "none",
        color: `color-mix(in srgb, ${slate.primary} 92%, ${slate.text})`,
        backgroundColor: `color-mix(in srgb, ${slate.primary} 22%, ${slate.surface})`,
        border: `1px solid color-mix(in srgb, ${slate.primary} 40%, ${slate.border})`,
        borderRadius: layoutTokens.radiusSm,
        boxShadow: "none",
        "&:hover:not(:disabled)": {
          backgroundColor: `color-mix(in srgb, ${slate.primary} 28%, ${slate.surface})`,
          borderColor: `color-mix(in srgb, ${slate.primary} 50%, ${slate.border})`,
        },
      };
    default:
      return {};
  }
}

const chipCompactHeight = {
  minHeight: "unset",
  height: "auto",
} as const;

const Button = styled(MuiButton)<{
  $dsAppearance: ButtonAppearance;
}>(({ theme, $dsAppearance }) => {
  const isChipVariant = $dsAppearance === "chip" || $dsAppearance === "chipPrimary";
  const isStandardAction =
    $dsAppearance === "primary" ||
    $dsAppearance === "secondary" ||
    $dsAppearance === "ghost" ||
    $dsAppearance === "danger";

  return {
    textTransform: "none",
    fontWeight: 500,
    fontSize: "inherit",
    lineHeight: 1.3,
    ...(isChipVariant ? chipCompactHeight : { minHeight: 44 }),
    padding: isChipVariant ? undefined : `0 ${theme.spacing(4)}`,
    borderRadius: layoutTokens.radiusSm,
    boxShadow: "none",
    transition: [
      `background-color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}`,
      `border-color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}`,
      `color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}`,
    ].join(", "),
    "&:disabled": {
      opacity: 0.45,
    },
    "&&:hover": {
      boxShadow: "none",
    },
    ...appearanceStyles(theme, $dsAppearance),
    ...(isChipVariant
      ? {
          "&&": chipCompactHeight,
          [theme.breakpoints.down("sm")]: chipCompactHeight,
        }
      : {}),
    ...(isStandardAction
      ? {
          [theme.breakpoints.down("sm")]: {
            minHeight: 36,
            padding: `0 ${theme.spacing(2.5)}`,
            fontSize: "0.875rem",
          },
        }
      : {}),
    ...($dsAppearance === "link"
      ? {
          [theme.breakpoints.down("sm")]: {
            fontSize: "0.875rem",
            padding: "2px 6px",
          },
        }
      : {}),
  };
});

export const Styled = {
  Button,
} as const;
