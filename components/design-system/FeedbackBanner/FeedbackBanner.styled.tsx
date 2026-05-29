import styled from "@/utils/styled.utils";
import MuiAlert from "@mui/material/Alert";
import { getSlateTokenSet, layoutTokens } from "@/theme/tokens";

const Root = styled(MuiAlert)(({ theme, severity = "error" }) => {
  const slate = getSlateTokenSet(theme.palette.mode);
  const resolvedSeverity = severity ?? "error";
  const surfaces = {
    error: {
      background: slate.errorSurface,
      color: slate.error,
      borderColor: `color-mix(in srgb, ${slate.error} 35%, ${slate.border})`,
    },
    success: {
      background: slate.successSurface,
      color: slate.success,
      borderColor: `color-mix(in srgb, ${slate.success} 35%, ${slate.border})`,
    },
    warning: {
      background: slate.warningSurface,
      color: slate.warning,
      borderColor: `color-mix(in srgb, ${slate.warning} 35%, ${slate.border})`,
    },
    info: {
      background: slate.infoSurface,
      color: slate.info,
      borderColor: `color-mix(in srgb, ${slate.info} 35%, ${slate.border})`,
    },
  } as const;
  const surface = surfaces[resolvedSeverity as keyof typeof surfaces] ?? surfaces.error;
  return {
    borderRadius: layoutTokens.radiusMd,
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: surface.background,
    color: surface.color,
    borderColor: surface.borderColor,
    "& .MuiAlert-icon": {
      color: surface.color,
    },
  };
});

export const Styled = {
  Root,
} as const;
