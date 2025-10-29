import { useCallback } from "react";
import {
  getTranslation,
  replacePlaceholders,
  type Language,
} from "@/i18n/translations";
import { useLanguageContext } from "@/contexts/LanguageContext";

export const useTranslation = () => {
  const { language } = useLanguageContext();

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
