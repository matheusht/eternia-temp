import { supabase } from '@/integrations/supabase/client';
import type { Language } from '@/i18n/translations';

export const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('pt') ? 'pt' : 'en';
};

export const saveLanguagePreference = async (language: Language): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  
  await supabase
    .from('profiles')
    .update({ language_preference: language })
    .eq('user_id', user.id);
};

// Translation mappings for database values (English stored, Portuguese displayed)
export const goalTranslations: Record<string, { pt: string; en: string }> = {
  'self-knowledge': { pt: 'Autoconhecimento', en: 'Self-Knowledge' },
  'love': { pt: 'Amor', en: 'Love' },
  'prosperity': { pt: 'Prosperidade', en: 'Prosperity' },
  'spirituality': { pt: 'Espiritualidade', en: 'Spirituality' },
  'healing': { pt: 'Cura', en: 'Healing' },
  'guidance': { pt: 'Orientação', en: 'Guidance' },
  'protection': { pt: 'Proteção', en: 'Protection' },
  'intuition': { pt: 'Intuição', en: 'Intuition' },
  // Additional mappings for legacy/alternative keys
  'insights': { pt: 'Insights Diários', en: 'Daily Insights' },
  'future': { pt: 'Orientação Futura', en: 'Future Guidance' },
  'soulmate': { pt: 'Conexão com Alma Gêmea', en: 'Soulmate Connection' },
  'autoconhecimento': { pt: 'Autoconhecimento', en: 'Self-Knowledge' },
  'amor': { pt: 'Amor e Relacionamentos', en: 'Love and Relationships' },
  'futuro': { pt: 'Orientação Futura', en: 'Future Guidance' },
  'alma_gemea': { pt: 'Conexão com Alma Gêmea', en: 'Soulmate Connection' },
  'compatibilidade': { pt: 'Compatibilidade', en: 'Compatibility' },
  'orientacao': { pt: 'Orientação Espiritual', en: 'Spiritual Guidance' }
};

export const interestTranslations: Record<string, { pt: string; en: string }> = {
  'astrology': { pt: 'Astrologia', en: 'Astrology' },
  'tarot': { pt: 'Tarô', en: 'Tarot' },
  'meditation': { pt: 'Meditação', en: 'Meditation' },
  'crystals': { pt: 'Cristais', en: 'Crystals' },
  'numerology': { pt: 'Numerologia', en: 'Numerology' },
  'dreams': { pt: 'Sonhos', en: 'Dreams' }
};

export const maritalStatusTranslations: Record<string, { pt: string; en: string }> = {
  'single': { pt: 'Solteiro(a)', en: 'Single' },
  'relationship': { pt: 'Em um relacionamento', en: 'In a Relationship' },
  'engaged': { pt: 'Noivo(a)', en: 'Engaged' },
  'married': { pt: 'Casado(a)', en: 'Married' },
  'separated': { pt: 'Separado(a)', en: 'Separated' },
  'divorced': { pt: 'Divorciado(a)', en: 'Divorced' },
  'widowed': { pt: 'Viúvo(a)', en: 'Widowed' },
  'open-relationship': { pt: 'Relacionamento aberto', en: 'Open Relationship' },
  'complicated': { pt: 'É complicado', en: "It's Complicated" }
};

export const genderTranslations: Record<string, { pt: string; en: string }> = {
  'male': { pt: 'Masculino', en: 'Male' },
  'female': { pt: 'Feminino', en: 'Female' },
  'non-binary': { pt: 'Não-binário', en: 'Non-Binary' },
  'prefer-not-to-say': { pt: 'Prefiro não dizer', en: 'Prefer Not to Say' }
};

export const levelTranslations: Record<string, { pt: string; en: string }> = {
  'apprentice': { pt: 'Aprendiz', en: 'Apprentice' },
  'initiate': { pt: 'Iniciado', en: 'Initiate' },
  'sage': { pt: 'Sábio', en: 'Sage' },
  'master': { pt: 'Mestre', en: 'Master' },
  // Legacy translations
  'aprendiz': { pt: 'Aprendiz', en: 'Apprentice' },
  'iniciado': { pt: 'Iniciado', en: 'Initiate' },
  'sábio': { pt: 'Sábio', en: 'Sage' },
  'mestre': { pt: 'Mestre', en: 'Master' }
};

// Helper functions to translate values
export const translateGoal = (value: string, language: Language = 'pt'): string => {
  return goalTranslations[value]?.[language] || value;
};

export const translateInterest = (value: string, language: Language = 'pt'): string => {
  return interestTranslations[value]?.[language] || value;
};

export const translateMaritalStatus = (value: string, language: Language = 'pt'): string => {
  return maritalStatusTranslations[value]?.[language] || value;
};

export const translateGender = (value: string, language: Language = 'pt'): string => {
  return genderTranslations[value]?.[language] || value;
};

export const translateLevel = (value: string, language: Language = 'pt'): string => {
  const normalizedValue = value?.toLowerCase();
  return levelTranslations[normalizedValue]?.[language] || value;
};

// Reverse translation (Portuguese to English for database storage)
export const translateGoalToEnglish = (value: string): string => {
  const entry = Object.entries(goalTranslations).find(([_, v]) => v.pt === value);
  return entry ? entry[0] : value;
};

export const translateInterestToEnglish = (value: string): string => {
  const entry = Object.entries(interestTranslations).find(([_, v]) => v.pt === value);
  return entry ? entry[0] : value;
};

export const translateMaritalStatusToEnglish = (value: string): string => {
  const entry = Object.entries(maritalStatusTranslations).find(([_, v]) => v.pt === value);
  return entry ? entry[0] : value;
};

export const translateGenderToEnglish = (value: string): string => {
  const entry = Object.entries(genderTranslations).find(([_, v]) => v.pt === value);
  return entry ? entry[0] : value;
};

export const translateLevelToEnglish = (value: string): string => {
  const entry = Object.entries(levelTranslations).find(([_, v]) => v.pt === value);
  return entry ? entry[0] : value;
};