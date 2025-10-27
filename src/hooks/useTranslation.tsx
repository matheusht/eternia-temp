import { useLocation } from "react-router-dom";
import { useCallback } from "react";
import {
  getTranslation,
  replacePlaceholders,
  type Language,
} from "@/i18n/translations";

export const useTranslation = () => {
  const location = useLocation();

  // Route-based language detection: /pt prefix = Portuguese, otherwise English
  const language: Language = location.pathname.startsWith("/pt") ? "pt" : "en";

  // Memoize the translation function to prevent infinite re-renders
  const t = useCallback(
    (key: string, values?: Record<string, string>): string => {
      const translation = getTranslation(language, key);
      return values ? replacePlaceholders(translation, values) : translation;
    },
    [language]
  );

  return { t, language };
};
