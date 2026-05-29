import { Box, IconButton } from "@mui/material";
import { Button } from "@/components/design-system/Button/Button";
import { getSlateTokenSet, layoutTokens } from "@/theme/tokens";
import styled from "@/utils/styled.utils";

const UuidBlock = styled(Box)(({ theme }) => {
  const slate = getSlateTokenSet(theme.palette.mode);
  return {
    display: "flex",
    alignItems: "stretch",
    gap: 0,
    marginBottom: theme.spacing(3),
    borderRadius: layoutTokens.radiusMd,
    border: `1px solid ${slate.border}`,
    background: slate.surface2,
    overflow: "hidden",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: "0.8125rem",
    lineHeight: 1.45,
  };
});

const UuidCode = styled("code")({
  flex: 1,
  margin: 0,
  paddingTop: 12,
  paddingBottom: 12,
  paddingLeft: 12,
  paddingRight: 8,
  wordBreak: "break-all",
  whiteSpace: "pre-wrap",
  font: "inherit",
  backgroundColor: "transparent",
});

const CopyButton = styled(IconButton)(({ theme }) => {
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

const ContinueButton = styled(Button)({
  width: "100%",
});

export const Styled = {
  UuidBlock,
  UuidCode,
  CopyButton,
  ContinueButton,
} as const;
