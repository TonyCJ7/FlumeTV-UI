import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEn from "@/translations/en/common.json";

/** Default namespace bundled for the app; add more JSON files under `translations/<lng>/`. */
const DEFAULT_I18N_NAMESPACES = ["common"] as const;

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    defaultNS: "common",
    ns: DEFAULT_I18N_NAMESPACES,
    resources: {
      en: { common: commonEn },
    },
    interpolation: { escapeValue: false },
  });
}

export { i18n };
