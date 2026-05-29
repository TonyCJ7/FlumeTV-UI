import { createTheme, type PaletteMode, type ThemeOptions } from "@mui/material/styles";
import "@/types/emotion.types";
import { getActionStateTokenSet, getSlateTokenSet, layoutTokens, motion } from "@/theme/tokens";

const systemFontStack =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';

export function createAppTheme(mode: PaletteMode) {
  const slate = getSlateTokenSet(mode);
  const actionState = getActionStateTokenSet(mode);

  return createTheme({
    slate,
    palette: {
      mode,
      primary: {
        main: slate.primary,
        dark: slate.primaryHover,
        contrastText: slate.onPrimary,
      },
      secondary: {
        main: slate.surface2,
        contrastText: slate.text,
      },
      error: {
        main: slate.error,
        contrastText: mode === "light" ? slate.onPrimary : slate.text,
      },
      success: {
        main: slate.success,
        contrastText: mode === "light" ? slate.onPrimary : slate.text,
      },
      warning: {
        main: slate.warning,
        contrastText: mode === "light" ? slate.text : slate.bg,
      },
      info: {
        main: slate.info,
        contrastText: mode === "light" ? slate.onPrimary : slate.text,
      },
      background: {
        default: slate.bg,
        paper: slate.surface,
      },
      text: {
        primary: slate.text,
        secondary: slate.textMuted,
      },
      divider: slate.border,
      action: {
        active: slate.text,
        hover: actionState.hover,
        selected: actionState.selected,
        disabledBackground: actionState.disabledBackground,
      },
    },
    spacing: 4,
    /** Above `modal` (1300) so page/dialog toasts stay readable over dialog backdrop. */
    zIndex: {
      snackbar: 1600,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 970,
        lg: 1200,
        xl: 1536,
      },
    },
    typography: {
      fontFamily: systemFontStack,
      body1: {
        fontSize: "1rem",
        lineHeight: 1.125,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.125,
      },
      h2: {
        fontSize: "1rem",
        lineHeight: 1.125,
        fontWeight: 700,
      },
      subtitle1: {
        fontSize: "1rem",
        lineHeight: 1.25,
        fontWeight: 600,
      },
      caption: {
        fontSize: "0.75rem",
        lineHeight: 1.25,
      },
      h6: {
        fontSize: "1.25rem",
        lineHeight: 1.2,
        fontWeight: 700,
      },
      button: {
        textTransform: "none",
        fontWeight: 700,
      },
    },
    transitions: {
      duration: {
        shortest: motion.durationFast,
        shorter: motion.durationFast,
        short: motion.durationNormal,
        standard: motion.durationNormal,
        complex: motion.durationSlow,
        enteringScreen: motion.durationSlow,
        leavingScreen: motion.durationNormal,
      },
      easing: {
        easeInOut: motion.easingStandard,
        easeOut: motion.easingEmphasized,
        easeIn: motion.easingStandard,
        sharp: motion.easingStandard,
      },
    },
    shadows: [
      "none",
      slate.shadow1,
      ...Array.from({ length: 23 }, () => slate.shadow2),
    ] as ThemeOptions["shadows"],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            height: "100%",
          },
          body: {
            minHeight: "100%",
            backgroundColor: slate.bg,
          },
          "*:focus-visible": {
            outline: `2px solid ${slate.focus}`,
            outlineOffset: 2,
          },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiStack: {
        defaultProps: {
          useFlexGap: true,
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: layoutTokens.radiusSm,
            minHeight: 44,
            fontWeight: 500,
            transitionProperty:
              "background-color, color, border-color, box-shadow, opacity, transform",
            [theme.breakpoints.down("sm")]: {
              minHeight: 36,
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: ({ theme }) => ({
            zIndex: theme.zIndex.snackbar,
            "& > *": {
              width: "fit-content",
              maxWidth: layoutTokens.toastMaxWidth,
            },
          }),
        },
      },
    },
  });
}
