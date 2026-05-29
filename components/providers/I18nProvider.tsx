"use client";

import type { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { i18n } from "@/infra/i18n/instance";

type I18nProviderProps = Readonly<{
  children: ReactNode;
}>;

/** Wraps client subtrees so `useTranslation` / `<Trans>` work. Import **`i18n` init** runs once via `instance`. */
export function I18nProvider({ children }: I18nProviderProps) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
