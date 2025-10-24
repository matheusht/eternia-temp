import { useLocation } from 'react-router-dom';
import { getTranslation, replacePlaceholders, type Language } from '@/i18n/translations';

export const useTranslation = () => {
  const location = useLocation();
  
  // Route-based language detection: /pt prefix = Portuguese, otherwise English
  const language: Language = location.pathname.startsWith('/pt') ? 'pt' : 'en';
  
  const t = (key: string, values?: Record<string, string>): string => {
    const translation = getTranslation(language, key);
    return values ? replacePlaceholders(translation, values) : translation;
  };
  
  return { t, language };
};