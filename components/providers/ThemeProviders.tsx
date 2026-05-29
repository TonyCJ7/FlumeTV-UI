"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import type { PaletteMode } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import { ColorModeProvider, useColorMode } from "./ColorModeProvider";
import { createAppTheme } from "@/theme";

type ThemeProvidersProps = Readonly<{
  children: ReactNode;
  initialColorMode: PaletteMode;
}>;

type ThemedTreeProps = Readonly<{
  children: ReactNode;
}>;

function ThemedTree({ children }: ThemedTreeProps) {
  const { mode } = useColorMode();
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <GlobalStyles
        styles={{
          html: { height: "100%" },
          body: { minHeight: "100%" },
          "*": { boxSizing: "border-box !important" },
        }}
      />
      {children}
    </ThemeProvider>
  );
}

export function ThemeProviders({ children, initialColorMode }: ThemeProvidersProps) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ColorModeProvider initialColorMode={initialColorMode}>
        <ThemedTree>{children}</ThemedTree>
      </ColorModeProvider>
    </AppRouterCacheProvider>
  );
}
