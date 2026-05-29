import type { PaletteMode } from "@mui/material";
import { keyframes } from "@emotion/react";
import { getSlateTokenSet, motion, themeModeIconColors } from "@/theme/tokens";
import styled from "@/utils/styled.utils";

const morphTransition = `
  opacity ${motion.durationSlow}ms ${motion.easingEmphasized},
  transform ${motion.durationSlow}ms ${motion.easingEmphasized},
  fill ${motion.durationSlow}ms ${motion.easingEmphasized},
  stroke ${motion.durationSlow}ms ${motion.easingEmphasized}
`;

const Toggle = styled("button")(({ theme }) => {
  const slate = getSlateTokenSet(theme.palette.mode);

  return {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    padding: 0,
    border: `1px solid ${slate.border}`,
    borderRadius: "50%",
    background: slate.surface2,
    cursor: "pointer",
    transition: `opacity ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}, transform ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}`,
    "&:hover": {
      backgroundColor: slate.surface,
    },
    "&:focus-visible": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
  };
});

/** Sun disc + ray layout (viewBox units). */
export const SUN_CORE_RADIUS = 5.75;
/** Space between core edge and ray inner tip. */
export const SUN_RAY_GAP = 4;
/** Length of each ray segment (inner tip → outer tip). */
export const SUN_RAY_LENGTH = 3;
export const SUN_RAY_INNER = SUN_CORE_RADIUS + SUN_RAY_GAP;
export const SUN_RAY_OUTER = SUN_RAY_INNER + SUN_RAY_LENGTH;

/** Moon crescent mask — sits to the right of disc center; negative angle tilts like a “C” leaning left. */
export const MOON_MASK_ANGLE = -32;
export const MOON_MASK_DISTANCE = 4;
export const MOON_MASK_RADIUS = 5;
export const DISC_CENTER = 12;

/** Resting rotation for sun / moon (degrees). */
export const ICON_ROTATION_SUN = 120;
export const ICON_ROTATION_MOON = -12;

const iconSpinDurationMs = motion.durationSlow + 180;

const spinToDark = keyframes`
  0% { transform: rotate(${ICON_ROTATION_SUN}deg); }
  68% { transform: rotate(${ICON_ROTATION_MOON - 15}deg); }
  82% { transform: rotate(${ICON_ROTATION_MOON + 15}deg); }
  92% { transform: rotate(${ICON_ROTATION_MOON - 2}deg); }
  100% { transform: rotate(${ICON_ROTATION_MOON}deg); }
`;

const spinToLight = keyframes`
  0% { transform: rotate(${ICON_ROTATION_MOON}deg); }
  68% { transform: rotate(${ICON_ROTATION_SUN + 15}deg); }
  82% { transform: rotate(${ICON_ROTATION_SUN - 15}deg); }
  92% { transform: rotate(${ICON_ROTATION_SUN + 2}deg); }
  100% { transform: rotate(${ICON_ROTATION_SUN}deg); }
`;

/** Feather Icons sun base — morphs into moon via mask + ray/disc motion. */
const IconSvg = styled("svg")<{ $mode: PaletteMode; $spin: boolean }>(({ $mode, $spin }) => ({
  display: "block",
  overflow: "visible",
  flexShrink: 0,
  transformOrigin: "center",
  transform:
    $mode === "dark" ? `rotate(${ICON_ROTATION_MOON}deg)` : `rotate(${ICON_ROTATION_SUN}deg)`,
  animation: $spin
    ? `${$mode === "dark" ? spinToDark : spinToLight} ${iconSpinDurationMs}ms ${motion.easingEmphasized} forwards`
    : "none",
}));

const Rays = styled("g")<{ $mode: PaletteMode }>(({ $mode }) => ({
  stroke: themeModeIconColors.sunRay,
  transition: morphTransition,
  opacity: $mode === "light" ? 1 : 0,
  transform:
    $mode === "light"
      ? "translate(12px, 12px) scale(1) translate(-12px, -12px)"
      : "translate(12px, 12px) scale(0.35) translate(-12px, -12px)",
}));

const Disc = styled("circle")<{ $mode: PaletteMode }>(({ $mode }) => ({
  transition: morphTransition,
  fill: $mode === "dark" ? themeModeIconColors.moon : themeModeIconColors.sunCore,
}));

const DiscGroup = styled("g")<{ $mode: PaletteMode }>(({ $mode }) => ({
  transition: morphTransition,
  transform:
    $mode === "dark"
      ? "translate(12px, 12px) scale(1.8) translate(-12px, -12px)"
      : "translate(12px, 12px) scale(1) translate(-12px, -12px)",
}));

const MaskGroup = styled("g")<{ $mode: PaletteMode }>(({ $mode }) => ({
  transition: morphTransition,
  transform:
    $mode === "dark"
      ? `translate(${DISC_CENTER}px, ${DISC_CENTER}px) rotate(${MOON_MASK_ANGLE}deg) translate(${MOON_MASK_DISTANCE}px, 0) scale(1)`
      : `translate(${DISC_CENTER}px, ${DISC_CENTER}px) rotate(${MOON_MASK_ANGLE}deg) translate(${MOON_MASK_DISTANCE}px, 0) scale(0)`,
}));

export const Styled = {
  Toggle,
  IconSvg,
  Rays,
  DiscGroup,
  Disc,
  MaskGroup,
} as const;
