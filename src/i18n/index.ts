import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en";
import fr from "./fr";

const savedLanguage =
  localStorage.getItem("app_language") ||
  localStorage.getItem("language") ||
  "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },

    fr: {
      translation: fr,
    },
  },

  lng: savedLanguage,
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;