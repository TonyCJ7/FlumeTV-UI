"use client";

import { keyframes } from "@emotion/react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Button } from "@/components/design-system/Button/Button";
import styled from "@/utils/styled.utils";
import {
  activeSwitchTokens,
  getLastOutcomeStatusTagTokenSet,
  getPrefetchStatusTagTokenSet,
  getSlateTokenSet,
  layoutTokens,
} from "@/theme/tokens";

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const ringRun = keyframes`
  to {
    stroke-dashoffset: -1;
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Styled = {
  Card: styled("article")<{ $detailsOpen?: boolean; $pending?: boolean }>(
    ({ theme, $detailsOpen, $pending }) => {
      const slate = getSlateTokenSet(theme.palette.mode);
      return {
        position: "relative",
        isolation: "isolate",
        ...($detailsOpen
          ? {
              zIndex: 10,
            }
          : {}),
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(10),
        minWidth: 0,
        padding: theme.spacing(4),
        borderRadius: layoutTokens.radiusMd,
        justifyContent: "space-between",
        border: `1px solid color-mix(in srgb, ${slate.primary} 18%, ${slate.border})`,
        background: `linear-gradient(165deg, color-mix(in srgb, ${slate.primary} 6%, ${slate.surface}) 0%, ${slate.bg} 48%, color-mix(in srgb, ${slate.link} 5%, ${slate.bg}) 100%)`,
        boxShadow: `0 1px 0 color-mix(in srgb, ${slate.text} 6%, transparent)`,
        ...($pending
          ? {
              pointerEvents: "none",
            }
          : {}),
      };
    },
  ),

  BusyOverlay: styled(Box)<{ $visible?: boolean }>(({ theme, $visible }) => {
    const slate = getSlateTokenSet(theme.palette.mode);
    return {
      display: $visible ? "block" : "none",
      position: "absolute",
      inset: 0,
      zIndex: 8,
      borderRadius: "inherit",
      pointerEvents: "auto",
      background: `linear-gradient(100deg, color-mix(in srgb, ${slate.text} 11%, transparent) 0%, color-mix(in srgb, ${slate.text} 26%, transparent) 44%, color-mix(in srgb, ${slate.text} 11%, transparent) 88%)`,
      backgroundSize: "200% 100%",
      animation: `${shimmer} 1.2s cubic-bezier(0.2, 0, 0, 1) infinite`,
    };
  }),

  Row: styled(Box)({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px 12px",
  }),

  RowTop: styled(Box)({
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "flex-start",
    gap: "8px 12px",
  }),

  RowBottom: styled(Box)({
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px 12px",
  }),

  TitleGroup: styled(Box)({
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "flex-start",
    flex: "1 1 0",
    minWidth: 0,
  }),

  /** Title + warning icon stay adjacent on the left; cluster caps at row width for ellipsis. */
  TitleCluster: styled(Box)(({ theme }) => ({
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: theme.spacing(2),
    minWidth: 0,
    width: "max-content",
    maxWidth: "100%",
    flex: "0 1 auto",
  })),

  Title: styled("h3")(({ theme }) => ({
    margin: 0,
    minWidth: 0,
    flex: "1 1 0",
    fontSize: "1.25rem",
    fontWeight: 700,
    lineHeight: 1.25,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: theme.palette.text.primary,
  })),

  /** View logs chip after title / warning; must not shrink below label. */
  TitleClusterAction: styled("span")({
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
  }),

  /** ClickAwayListener requires a DOM node; keep inline with title cluster. */
  WarningTooltipAnchor: styled("span")({
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    position: "relative",
    zIndex: 21,
  }),

  PrefetchWarningIcon: styled("button")<{ $fineHover?: boolean }>(({ theme, $fineHover }) => {
    const slate = getSlateTokenSet(theme.palette.mode);
    return {
      display: "inline-flex",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      width: 22,
      height: 22,
      margin: 0,
      padding: 0,
      border: 0,
      background: "transparent",
      color: slate.warning,
      cursor: $fineHover ? "help" : "pointer",
      WebkitTapHighlightColor: "transparent",
      "&:focus-visible": {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: 2,
        borderRadius: layoutTokens.radiusSm,
      },
    };
  }),

  TopEnd: styled(Box)({
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
    alignSelf: "flex-start",
    marginInlineStart: "auto",
  }),

  ActiveToggleWrap: styled("span")({
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }),

  ActiveToggleLoadingRing: styled("svg")(({ theme }) => ({
    position: "absolute",
    top: -4,
    left: -4,
    width: "calc(100% + 8px)",
    height: "calc(100% + 8px)",
    pointerEvents: "none",
    overflow: "visible",
    "& .active-toggle-ring__track": {
      fill: "none",
      stroke: `color-mix(in srgb, ${theme.palette.primary.main} 24%, transparent)`,
      strokeWidth: 2,
    },
    "& .active-toggle-ring__arc": {
      fill: "none",
      stroke: theme.palette.primary.main,
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeDasharray: "0.22 0.78",
      strokeDashoffset: 0,
      animation: `${ringRun} 0.75s linear infinite`,
    },
  })),

  ActiveToggle: styled("button")(({ theme }) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    border: 0,
    padding: 0,
    background: "transparent",
    cursor: "pointer",
    borderRadius: 999,
    lineHeight: 0,
    "&:focus-visible .switch-track": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
    "&:disabled": {
      cursor: "not-allowed",
      pointerEvents: "none",
    },
    "&:disabled:not([data-loading])": {
      opacity: 0.45,
    },
    "&[data-loading] .switch-track": {
      opacity: 0.55,
      filter: "grayscale(0.35)",
    },
  })),

  SwitchTrack: styled("span")<{ $on?: boolean }>(({ theme, $on }) => {
    const slate = getSlateTokenSet(theme.palette.mode);
    return {
      display: "block",
      width: 44,
      height: 26,
      borderRadius: 999,
      background: $on
        ? `linear-gradient(145deg, ${activeSwitchTokens.gradientStart}, ${activeSwitchTokens.gradientEnd})`
        : slate.border,
      border: `1px solid ${$on ? activeSwitchTokens.border : slate.border}`,
      position: "relative",
      boxShadow: $on
        ? `0 0 0 1px ${activeSwitchTokens.ring}, 0 2px 10px ${activeSwitchTokens.glow}`
        : undefined,
      transition: `background ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}, border-color ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
      "&::after": {
        content: '""',
        position: "absolute",
        top: 2,
        left: 2,
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: $on ? activeSwitchTokens.thumb : slate.bg,
        boxShadow: $on
          ? `0 1px 3px ${activeSwitchTokens.thumbShadow}`
          : `0 1px 2px color-mix(in srgb, ${slate.text} 18%, transparent)`,
        transform: $on ? "translateX(18px)" : undefined,
        transition: `transform ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeOut}`,
      },
    };
  }),

  StatusRoot: styled(Box)<{
    $hoverDetails?: boolean;
    $pinnedDetails?: boolean;
  }>(({ $hoverDetails, $pinnedDetails }) => ({
    // flex: "1 1 0",
    minWidth: 0,
    "& .status-details": {
      display: $hoverDetails || $pinnedDetails ? "block" : "none",
    },
  })),

  StatusHoverGroup: styled(Box)({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
  }),

  StatusTagsRow: styled("span")({
    display: "inline-flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
  }),

  StatusTag: styled("span")<{
    $variant: "idle" | "queue" | "work";
  }>(({ theme, $variant }) => {
    const tag = getPrefetchStatusTagTokenSet(theme.palette.mode, $variant);
    return {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      flex: "0 0 auto",
      minWidth: 0,
      maxWidth: "100%",
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: "0.75rem",
      fontWeight: 600,
      cursor: "pointer",
      border: "1px solid",
      overflow: "hidden",
      color: tag.color,
      background: tag.background,
      borderColor: tag.borderColor,
      "&:focus-visible": {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: 2,
      },
      "&:hover": {
        borderColor: tag.hoverBorderColor,
        boxShadow: tag.hoverBoxShadow,
      },
    };
  }),

  LastOutcomeTag: styled("span")<{
    $variant: "success" | "danger" | "neutral";
  }>(({ theme, $variant }) => {
    const tag = getLastOutcomeStatusTagTokenSet(theme.palette.mode, $variant);
    return {
      display: "inline-flex",
      alignItems: "center",
      flex: "0 0 auto",
      minWidth: 0,
      maxWidth: "100%",
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: "0.75rem",
      fontWeight: 600,
      cursor: "pointer",
      border: "1px solid",
      overflow: "hidden",
      color: tag.color,
      background: tag.background,
      borderColor: tag.borderColor,
      "&:focus-visible": {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: 2,
      },
      "&:hover": {
        borderColor: tag.hoverBorderColor,
        boxShadow: tag.hoverBoxShadow,
      },
    };
  }),

  StatusLabel: styled("span")({
    flex: "1 1 auto",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),

  SyncIconGlyph: styled("span")({
    display: "inline-flex",
    fontSize: 18,
  }),

  SyncIcon: styled("span")<{ $spin?: boolean; $variant?: "idle" | "queue" | "work" }>(
    ({ theme, $spin, $variant = "work" }) => ({
      display: "inline-flex",
      flexShrink: 0,
      color: getPrefetchStatusTagTokenSet(theme.palette.mode, $variant).syncIconColor,
      ...($spin ? { animation: `${spin} 1s linear infinite` } : {}),
    }),
  ),

  StatusDetails: styled(Box)(({ theme }) => {
    const slate = getSlateTokenSet(theme.palette.mode);
    return {
      position: "absolute",
      left: 0,
      top: "100%",
      paddingTop: theme.spacing(0.5),
      zIndex: 20,
      width: "max-content",
      maxWidth: "min(22rem, calc(100vw - 2.5rem))",
      minWidth: "11rem",
      padding: theme.spacing(1.5),
      background: slate.bg,
      border: `1px solid ${slate.border}`,
      borderRadius: layoutTokens.radiusMd,
      boxShadow: `0 8px 28px color-mix(in srgb, ${slate.text} 12%, transparent)`,
      fontSize: "0.8125rem",
    };
  }),

  StatusDetailsInner: styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: 8,
  }),

  StatusDetailsHead: styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    height: 32,
    boxSizing: "border-box",
  }),

  StatusDetailsTitle: styled("p")({
    margin: 0,
    fontSize: "0.8125rem",
    fontWeight: 650,
  }),

  DetailsClose: styled(IconButton)<{ $visible?: boolean }>(({ $visible }) => ({
    display: $visible ? "inline-flex" : "none",
    width: 32,
    height: 32,
    padding: 0,
  })),

  DetailDl: styled("dl")({
    margin: 0,
    display: "grid",
    gridTemplateColumns: "minmax(6rem, 8rem) 1fr",
    gap: "4px 8px",
    "& dt": {
      margin: 0,
      color: "inherit",
      opacity: 0.72,
      fontWeight: 500,
    },
    "& dd": {
      margin: 0,
      wordBreak: "break-word",
    },
  }),

  BottomActions: styled(Box)(({ theme }) => ({
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: theme.spacing(1),
    flex: "0 1 auto",
    maxWidth: "100%",
    alignSelf: "flex-end",
  })),

  LinkAction: styled(Button)({
    alignSelf: "center",
  }),

  IconBtn: styled(IconButton)<{ $danger?: boolean }>(({ theme, $danger }) => {
    const slate = getSlateTokenSet(theme.palette.mode);
    return {
      color: $danger ? slate.error : slate.textMuted,
      ...($danger
        ? {
            "&:hover": {
              color: slate.onPrimary,
              backgroundColor: slate.error,
            },
          }
        : {
            "&:hover": {
              color: slate.text,
              backgroundColor: slate.surface2,
            },
          }),
    };
  }),
};
