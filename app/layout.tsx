import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import {
  ApiConfigProvider,
  AuthShellProvider,
  I18nProvider,
  ReduxProvider,
  ThemeProviders,
} from "@/components/providers";
import { COLOR_MODE_BOOTSTRAP_SCRIPT } from "@/infra/colorMode/bootstrapScript";
import { parseBaseApiUrl } from "@/infra/env";
import { getServerColorMode } from "@/infra/colorMode/getServerColorMode";
import { getSlateTokenSet } from "@/theme/tokens";

/** Default document language; localize with **`[locale]`** routing later to match **`i18n`**. */
export const metadata: Metadata = {
  title: { default: "FlumeTV", template: "%s · FlumeTV" },
  description: "FlumeTV — configure IPTV sources and Stremio install links.",
  icons: {
    icon: "/assets/flume.png",
    apple: "/assets/flume.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const baseApiUrl = parseBaseApiUrl(process.env.BASE_API_URL);
  const initialColorMode = await getServerColorMode();
  const pageBackground = getSlateTokenSet(initialColorMode).bg;

  return (
    <html
      lang="en"
      data-color-mode={initialColorMode}
      suppressHydrationWarning
      style={{
        colorScheme: initialColorMode === "light" ? "light" : "dark",
        backgroundColor: pageBackground,
      }}
    >
      <head>
        <script
          // Blocking: reconcile localStorage/cookie/OS before body paint (see infra/colorMode).
          dangerouslySetInnerHTML={{ __html: COLOR_MODE_BOOTSTRAP_SCRIPT }}
        />
      </head>
      <body suppressHydrationWarning style={{ backgroundColor: pageBackground, minHeight: "100%" }}>
        {/*
          Provider order: API config → Theme (MUI + color mode) → Redux → i18n.
          ApiConfigProvider must wrap Redux so thunks see `BASE_API_URL` before bootstrap.
        */}
        <ApiConfigProvider baseApiUrl={baseApiUrl}>
          <ThemeProviders initialColorMode={initialColorMode}>
            <ReduxProvider>
              <AuthShellProvider>
                <I18nProvider>{children}</I18nProvider>
              </AuthShellProvider>
            </ReduxProvider>
          </ThemeProviders>
        </ApiConfigProvider>
      </body>
    </html>
  );
}
