import { keyframes } from "@emotion/react";
import styled from "@/utils/styled.utils";
import MuiAlert from "@mui/material/Alert";
import { getSlateTokenSet, layoutTokens } from "@/theme/tokens";

const toastFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

function severitySurface(
  severity: "error" | "success" | "warning" | "info",
  slate: ReturnType<typeof getSlateTokenSet>,
) {
  switch (severity) {
    case "error":
      return {
        background: slate.errorSurface,
        color: slate.error,
        borderColor: `color-mix(in srgb, ${slate.error} 35%, ${slate.border})`,
      };
    case "success":
      return {
        background: slate.successSurface,
        color: slate.success,
        borderColor: `color-mix(in srgb, ${slate.success} 35%, ${slate.border})`,
      };
    case "warning":
      return {
        background: slate.warningSurface,
        color: slate.warning,
        borderColor: `color-mix(in srgb, ${slate.warning} 35%, ${slate.border})`,
      };
    default:
      return {
        background: slate.infoSurface,
        color: slate.info,
        borderColor: `color-mix(in srgb, ${slate.info} 35%, ${slate.border})`,
      };
  }
}

const Root = styled(MuiAlert)<{ severity?: "error" | "success" | "warning" | "info" }>(({
  theme,
  severity = "info",
}) => {
  const slate = getSlateTokenSet(theme.palette.mode);
  const surface = severitySurface(severity, slate);
  return {
    borderRadius: layoutTokens.radiusMd,
    width: "fit-content",
    maxWidth: layoutTokens.toastMaxWidth,
    boxSizing: "border-box",
    alignItems: "flex-start",
    alignSelf: "center",
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: surface.background,
    color: surface.color,
    borderColor: surface.borderColor,
    animation: `${toastFadeIn} ${theme.transitions.duration.complex}ms ${theme.transitions.easing.easeOut} both`,
    "& .MuiAlert-icon": {
      color: surface.color,
      paddingTop: 2,
    },
    "& .MuiAlert-message": {
      whiteSpace: "normal",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
    },
    "& .MuiAlert-action": {
      paddingTop: 0,
      alignItems: "flex-start",
    },
  };
});

export const Styled = {
  Root,
} as const;
