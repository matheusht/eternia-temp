import { pt } from './pt';
import { en } from './en';

export type Language = 'pt' | 'en';

export const translations = {
  pt,
  en
};

export const getTranslation = (language: Language, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      console.warn(`Translation key not found: ${key} for language: ${language}`);
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
};

// Helper to replace placeholders like {{name}}
export const replacePlaceholders = (text: string, values: Record<string, string>): string => {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] || '');
};

// Helper to get translated values from utils
export const getUtilTranslation = (language: Language, category: string, key: string): string => {
  return getTranslation(language, `utils.${category}.${key}`);
};