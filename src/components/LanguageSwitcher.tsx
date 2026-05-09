import { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const [open, setOpen] = useState(false);

  const currentLanguage = i18n.language || "fr";

  const changeLanguage = (lang: "en" | "fr") => {
    i18n.changeLanguage(lang);

    localStorage.setItem("app_language", lang);

    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold shadow-sm"
      >
        {currentLanguage === "fr" ? "🇫🇷 FR" : "🇺🇸 EN"}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-44 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
          <button
            onClick={() => changeLanguage("fr")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold hover:bg-gray-100"
          >
            🇫🇷 Français
          </button>

          <button
            onClick={() => changeLanguage("en")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold hover:bg-gray-100"
          >
            🇺🇸 English
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;