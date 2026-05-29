import { Stack } from "@mui/material";
import styled from "@/utils/styled.utils";

const OptionsStack = styled(Stack)(({ theme }) => ({
  width: "100%",
  gap: theme.spacing(1.5),
}));

const OptionLink = styled("a")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1.5),
  width: "100%",
  minHeight: 48,
  padding: theme.spacing(1.25, 2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontSize: theme.typography.button.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  lineHeight: theme.typography.button.lineHeight,
  textDecoration: "none",
  transition: theme.transitions.create(["background-color", "border-color"], {
    duration: theme.transitions.duration.shorter,
  }),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.text.secondary,
  },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

const OptionLogo = styled("img")({
  width: 28,
  height: 28,
  objectFit: "contain",
  flexShrink: 0,
});

export const Styled = {
  OptionsStack,
  OptionLink,
  OptionLogo,
} as const;
