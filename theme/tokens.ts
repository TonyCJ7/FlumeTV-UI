import type { PaletteMode } from "@mui/material";

/**
 * Slate semantic palette for light/dark modes.
 */
const slateTokens = {
  light: {
    bg: "#f4f5f7",
    inputBg: "#ffffff",
    surface: "#ffffff",
    surface2: "#eceef2",
    text: "#0f1218",
    textMuted: "#4b5160",
    border: "#c5cad6",
    primary: "#2563eb",
    onPrimary: "#ffffff",
    primaryHover: "#1d4ed8",
    error: "#b91c1c",
    errorSurface: "#fef2f2",
    success: "#15803d",
    successSurface: "#f0fdf4",
    warning: "#b45309",
    warningSurface: "#fffbeb",
    info: "#1d4ed8",
    infoSurface: "#eff6ff",
    link: "#1d4ed8",
    focus: "#2563eb",
    shadow1: "0 1px 2px rgba(15, 18, 24, 0.06)",
    shadow2: "0 8px 24px rgba(15, 18, 24, 0.1)",
  },
  dark: {
    bg: "#0c0e12",
    inputBg: "#0c0e12",
    surface: "#13161c",
    surface2: "#1a1f2a",
    text: "#eef1f6",
    textMuted: "#9aa3b2",
    border: "#2a3140",
    primary: "#60a5fa",
    onPrimary: "#0b1220",
    primaryHover: "#93c5fd",
    error: "#f87171",
    errorSurface: "#3a1414",
    success: "#4ade80",
    successSurface: "#052e16",
    warning: "#fcd34d",
    warningSurface: "#422006",
    info: "#93c5fd",
    infoSurface: "#172554",
    link: "#93c5fd",
    focus: "#60a5fa",
    shadow1: "0 1px 2px rgba(0, 0, 0, 0.4)",
    shadow2: "0 10px 30px rgba(0, 0, 0, 0.45)",
  },
} as const;

export const motion = {
  durationFast: 140,
  durationNormal: 220,
  durationSlow: 360,
  easingStandard: "cubic-bezier(0.2, 0, 0, 1)",
  easingEmphasized: "cubic-bezier(0.2, 0, 0, 1)",
} as const;

/** Decorative sun/moon hues for the header theme toggle icon (flat fills). */
export const themeModeIconColors = {
  sunCore: "#f59e0b",
  sunRay: "#fbbf24",
  moon: "#5b9cf5",
} as const;

/** Layout scale (--space-*, --radius-*). */
export const layoutTokens = {
  /** Pixel strings — canonical radius scale; use these everywhere (numeric `borderRadius` in MUI `sx` is not pixel-safe). */
  radiusSm: "6px",
  radiusMd: "10px",
  radiusLg: "14px",
  space1: 4,
  space2: 8,
  space3: 12,
  space4: 16,
  space5: 24,
  space6: 32,
  /** Bottom clearance for mobile donate foot in app shell. */
  shellBottomClearance: 120,
  fieldMaxWidth: 420,
  dialogWidthDefault: 480,
  dialogWidthAddConfig: 520,
  bottomDonateMaxWidth: "22rem",
  /** Prototype `.toast` — fit-content, viewport-capped (not full shell width on mweb). */
  toastMaxWidth: "min(90vw, 400px)",
} as const;

export function getSlateTokenSet(mode: PaletteMode) {
  return mode === "light" ? slateTokens.light : slateTokens.dark;
}

export type SlateTokenSet = ReturnType<typeof getSlateTokenSet>;

/** Modal backdrop scrim. */
export const scrimTokens = {
  backdrop: "rgba(0, 0, 0, 0.52)",
} as const;

/** MUI `palette.action` translucent overlays derived from Slate text/primary. */
const actionStateTokens = {
  light: {
    hover: "rgba(15, 18, 24, 0.06)",
    selected: "rgba(37, 99, 235, 0.12)",
    disabledBackground: "rgba(15, 18, 24, 0.06)",
  },
  dark: {
    hover: "rgba(238, 241, 246, 0.08)",
    selected: "rgba(96, 165, 250, 0.16)",
    disabledBackground: "rgba(238, 241, 246, 0.06)",
  },
} as const;

export function getActionStateTokenSet(mode: PaletteMode) {
  return mode === "light" ? actionStateTokens.light : actionStateTokens.dark;
}

/** Elevation shadows for shell controls (not MUI shadow index). */
const elevationShadowTokens = {
  light: {
    dialogFooterUp: "0 -6px 16px rgba(0, 0, 0, 0.06)",
    segmentTabActive: "0 1px 3px rgba(0, 0, 0, 0.12)",
  },
  dark: {
    dialogFooterUp: "0 -6px 20px rgba(0, 0, 0, 0.35)",
    segmentTabActive:
      "0 0 0 1px color-mix(in srgb, var(--mui-palette-primary-main) 70%, transparent), 0 0 0 1px var(--mui-palette-divider) inset, 0 2px 8px rgba(0, 0, 0, 0.35)",
  },
} as const;

export function getElevationShadowTokenSet(mode: PaletteMode) {
  return mode === "light" ? elevationShadowTokens.light : elevationShadowTokens.dark;
}

/** Merged segment control (`.auth-segment`) — `SegmentTabs`. */
const segmentTabTokens = {
  light: {
    trackBackground: slateTokens.light.surface2,
    selectedBackground: `color-mix(in srgb, ${slateTokens.light.primary} 20%, ${slateTokens.light.surface})`,
    selectedBoxShadow: `0 0 0 1px color-mix(in srgb, ${slateTokens.light.primary} 55%, ${slateTokens.light.border}), ${elevationShadowTokens.light.segmentTabActive}`,
  },
  dark: {
    trackBackground: slateTokens.dark.surface2,
    selectedBackground: `color-mix(in srgb, ${slateTokens.dark.primary} 28%, ${slateTokens.dark.surface2})`,
    selectedBoxShadow: elevationShadowTokens.dark.segmentTabActive,
  },
} as const;

export function getSegmentTabTokenSet(mode: PaletteMode) {
  return mode === "light" ? segmentTabTokens.light : segmentTabTokens.dark;
}

/** Shell primary nav tab (`.app-nav` cells) — `PrimaryNavTabs`. */
const primaryNavTabTokens = {
  light: {
    inactiveBorder: `color-mix(in srgb, ${slateTokens.light.border} 72%, ${slateTokens.light.surface})`,
    hoverBorder: `color-mix(in srgb, ${slateTokens.light.border} 92%, ${slateTokens.light.surface})`,
    activeBackground: `color-mix(in srgb, ${slateTokens.light.primary} 16%, ${slateTokens.light.surface})`,
    activeBoxShadow: `inset 0 0 0 1px color-mix(in srgb, ${slateTokens.light.primary} 35%, transparent)`,
  },
  dark: {
    inactiveBorder: `color-mix(in srgb, ${slateTokens.dark.border} 72%, ${slateTokens.dark.surface})`,
    hoverBorder: `color-mix(in srgb, ${slateTokens.dark.border} 92%, ${slateTokens.dark.surface})`,
    activeBackground: `color-mix(in srgb, ${slateTokens.dark.primary} 18%, ${slateTokens.dark.surface})`,
    activeBoxShadow: `inset 0 0 0 1px color-mix(in srgb, ${slateTokens.dark.primary} 45%, transparent), 0 0 0 1px color-mix(in srgb, ${slateTokens.dark.primary} 20%, transparent)`,
  },
} as const;

export function getPrimaryNavTabTokenSet(mode: PaletteMode) {
  return mode === "light" ? primaryNavTabTokens.light : primaryNavTabTokens.dark;
}

/** `Button` appearance hover/active surfaces not covered by MUI palette slots. */
const buttonAppearanceTokens = {
  light: {
    secondaryHoverBackground: `color-mix(in srgb, ${slateTokens.light.primary} 10%, ${slateTokens.light.surface})`,
  },
  dark: {
    secondaryHoverBackground: `color-mix(in srgb, ${slateTokens.dark.primary} 14%, ${slateTokens.dark.surface})`,
  },
} as const;

export function getButtonAppearanceTokenSet(mode: PaletteMode) {
  return mode === "light" ? buttonAppearanceTokens.light : buttonAppearanceTokens.dark;
}

/** Active config-card switch colors. */
export const activeSwitchTokens = {
  gradientStart: "#22c55e",
  gradientEnd: "#16a34a",
  border: "#15803d",
  thumb: "#ffffff",
  ring: "color-mix(in srgb, #4ade80 55%, transparent)",
  glow: "color-mix(in srgb, #16a34a 45%, transparent)",
  thumbShadow: "color-mix(in srgb, #000000 28%, transparent)",
} as const;

type PrefetchStatusVariant = "idle" | "queue" | "work";

type PrefetchStatusTagTokens = Readonly<{
  color: string;
  background: string;
  borderColor: string;
  hoverBorderColor: string;
  hoverBoxShadow: string;
  syncIconColor: string;
}>;

/** Prefetch status pill colors per band variant. */
const prefetchStatusTagTokens = {
  light: {
    idle: {
      color: "color-mix(in srgb, #334155 90%, #0f1218)",
      background: "color-mix(in srgb, #64748b 20%, #eceef2)",
      borderColor: "color-mix(in srgb, #64748b 42%, #c5cad6)",
      hoverBorderColor: "color-mix(in srgb, #64748b 65%, #c5cad6)",
      hoverBoxShadow: "0 0 0 1px color-mix(in srgb, #94a3b8 35%, transparent)",
      syncIconColor: "#2563eb",
    },
    queue: {
      color: "color-mix(in srgb, #b45309 85%, #0f1218)",
      background: "color-mix(in srgb, #f59e0b 24%, #eceef2)",
      borderColor: "color-mix(in srgb, #d97706 50%, #c5cad6)",
      hoverBorderColor: "color-mix(in srgb, #f59e0b 70%, #c5cad6)",
      hoverBoxShadow: "0 0 0 1px color-mix(in srgb, #fbbf24 40%, transparent)",
      syncIconColor: "#2563eb",
    },
    work: {
      color: "color-mix(in srgb, #1d4ed8 82%, #0f1218)",
      background: "color-mix(in srgb, #3b82f6 22%, #eceef2)",
      borderColor: "color-mix(in srgb, #2563eb 48%, #c5cad6)",
      hoverBorderColor: "color-mix(in srgb, #60a5fa 55%, #c5cad6)",
      hoverBoxShadow: "0 0 0 1px color-mix(in srgb, #93c5fd 45%, transparent)",
      syncIconColor: "#2563eb",
    },
  },
  dark: {
    idle: {
      color: "#cbd5e1",
      background: "color-mix(in srgb, #64748b 32%, #1a1f2a)",
      borderColor: "color-mix(in srgb, #94a3b8 35%, #2a3140)",
      hoverBorderColor: "color-mix(in srgb, #64748b 65%, #2a3140)",
      hoverBoxShadow: "0 0 0 1px color-mix(in srgb, #94a3b8 35%, transparent)",
      syncIconColor: "#60a5fa",
    },
    queue: {
      color: "#fcd34d",
      background: "color-mix(in srgb, #d97706 26%, #1a1f2a)",
      borderColor: "color-mix(in srgb, #d97706 40%, #2a3140)",
      hoverBorderColor: "color-mix(in srgb, #f59e0b 70%, #2a3140)",
      hoverBoxShadow: "0 0 0 1px color-mix(in srgb, #fbbf24 40%, transparent)",
      syncIconColor: "#60a5fa",
    },
    work: {
      color: "#93c5fd",
      background: "color-mix(in srgb, #2563eb 30%, #1a1f2a)",
      borderColor: "color-mix(in srgb, #60a5fa 55%, #2a3140)",
      hoverBorderColor: "color-mix(in srgb, #60a5fa 55%, #2a3140)",
      hoverBoxShadow: "0 0 0 1px color-mix(in srgb, #93c5fd 45%, transparent)",
      syncIconColor: "#60a5fa",
    },
  },
} as const satisfies Record<PaletteMode, Record<PrefetchStatusVariant, PrefetchStatusTagTokens>>;

export function getPrefetchStatusTagTokenSet(
  mode: PaletteMode,
  variant: PrefetchStatusVariant,
): PrefetchStatusTagTokens {
  return prefetchStatusTagTokens[mode][variant];
}

type LastOutcomeStatusVariant = "success" | "danger" | "neutral";

/** Last-outcome pill colors on config cards (`room.last_outcome`). */
const lastOutcomeStatusTagTokens = {
  light: {
    success: {
      color: "color-mix(in srgb, #15803d 88%, #0f1218)",
      background: "color-mix(in srgb, #22c55e 22%, #eceef2)",
      borderColor: "color-mix(in srgb, #16a34a 48%, #c5cad6)",
      hoverBorderColor: "color-mix(in srgb, #22c55e 62%, #c5cad6)",
      hoverBoxShadow: "0 0 0 1px color-mix(in srgb, #4ade80 40%, transparent)",
      syncIconColor: "#16a34a",
    },
    danger: {
      color: "color-mix(in srgb, #b91c1c 88%, #0f1218)",
      background: "color-mix(in srgb, #ef4444 20%, #eceef2)",
      borderColor: "color-mix(in srgb, #dc2626 45%, #c5cad6)",
      hoverBorderColor: "color-mix(in srgb, #ef4444 58%, #c5cad6)",
      hoverBoxShadow: "0 0 0 1px color-mix(in srgb, #f87171 40%, transparent)",
      syncIconColor: "#dc2626",
    },
    neutral: {
      color: "color-mix(in srgb, #92400e 85%, #0f1218)",
      background: "color-mix(in srgb, #f59e0b 18%, #eceef2)",
      borderColor: "color-mix(in srgb, #d97706 42%, #c5cad6)",
      hoverBorderColor: "color-mix(in srgb, #f59e0b 58%, #c5cad6)",
      hoverBoxShadow: "0 0 0 1px color-mix(in srgb, #fbbf24 35%, transparent)",
      syncIconColor: "#d97706",
    },
  },
  dark: {
    success: {
      color: "#86efac",
      background: "color-mix(in srgb, #16a34a 28%, #1a1f2a)",
      borderColor: "color-mix(in srgb, #22c55e 42%, #2a3140)",
      hoverBorderColor: "color-mix(in srgb, #4ade80 55%, #2a3140)",
      hoverBoxShadow: "0 0 0 1px color-mix(in srgb, #4ade80 40%, transparent)",
      syncIconColor: "#4ade80",
    },
    danger: {
      color: "#fca5a5",
      background: "color-mix(in srgb, #dc2626 26%, #1a1f2a)",
      borderColor: "color-mix(in srgb, #ef4444 40%, #2a3140)",
      hoverBorderColor: "color-mix(in srgb, #f87171 52%, #2a3140)",
      hoverBoxShadow: "0 0 0 1px color-mix(in srgb, #f87171 40%, transparent)",
      syncIconColor: "#f87171",
    },
    neutral: {
      color: "#fcd34d",
      background: "color-mix(in srgb, #d97706 22%, #1a1f2a)",
      borderColor: "color-mix(in srgb, #d97706 38%, #2a3140)",
      hoverBorderColor: "color-mix(in srgb, #f59e0b 58%, #2a3140)",
      hoverBoxShadow: "0 0 0 1px color-mix(in srgb, #fbbf24 35%, transparent)",
      syncIconColor: "#fbbf24",
    },
  },
} as const satisfies Record<PaletteMode, Record<LastOutcomeStatusVariant, PrefetchStatusTagTokens>>;

export function getLastOutcomeStatusTagTokenSet(
  mode: PaletteMode,
  variant: LastOutcomeStatusVariant,
): PrefetchStatusTagTokens {
  return lastOutcomeStatusTagTokens[mode][variant];
}

/** Chromatic accent base colors for `ToneBadge` / source-type badges. */
const accentPaletteTokens = {
  teal: {
    light: { base: "#0f766e", mix: "#0d9488", borderMix: "#14b8a6" },
    dark: { base: "#5eead4", mix: "#0d9488", borderMix: "#2dd4bf" },
  },
  violet: {
    light: { base: "#6d28d9", mix: "#7c3aed", borderMix: "#a78bfa" },
    dark: { base: "#c4b5fd", mix: "#7c3aed", borderMix: "#a78bfa" },
  },
} as const;

/** Chromatic accent tones for badges and tags — domain-neutral palette slots. */
export type AccentTone = "teal" | "violet";

const accentTokens = {
  light: {
    teal: {
      color: `color-mix(in srgb, ${accentPaletteTokens.teal.light.base} 88%, ${slateTokens.light.text})`,
      background: `color-mix(in srgb, ${accentPaletteTokens.teal.light.mix} 22%, ${slateTokens.light.surface2})`,
      border: `color-mix(in srgb, ${accentPaletteTokens.teal.light.borderMix} 55%, ${slateTokens.light.border})`,
    },
    violet: {
      color: `color-mix(in srgb, ${accentPaletteTokens.violet.light.base} 82%, ${slateTokens.light.text})`,
      background: `color-mix(in srgb, ${accentPaletteTokens.violet.light.mix} 22%, ${slateTokens.light.surface2})`,
      border: `color-mix(in srgb, ${accentPaletteTokens.violet.light.borderMix} 45%, ${slateTokens.light.border})`,
    },
  },
  dark: {
    teal: {
      color: accentPaletteTokens.teal.dark.base,
      background: `color-mix(in srgb, ${accentPaletteTokens.teal.dark.mix} 28%, ${slateTokens.dark.surface2})`,
      border: `color-mix(in srgb, ${accentPaletteTokens.teal.dark.borderMix} 40%, ${slateTokens.dark.border})`,
    },
    violet: {
      color: accentPaletteTokens.violet.dark.base,
      background: `color-mix(in srgb, ${accentPaletteTokens.violet.dark.mix} 28%, ${slateTokens.dark.surface2})`,
      border: `color-mix(in srgb, ${accentPaletteTokens.violet.dark.borderMix} 35%, ${slateTokens.dark.border})`,
    },
  },
} as const;

export function getAccentTokenSet(mode: PaletteMode) {
  return mode === "light" ? accentTokens.light : accentTokens.dark;
}
