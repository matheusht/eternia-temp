import { type Language } from "@/i18n/translations";
import { en } from "@/i18n/en";
import { pt } from "@/i18n/pt";

interface SpiritualPractice {
  type: string;
  title: string;
  description: string;
  duration: string;
  level: string[];
}

// Practice keys that map to translation paths
const practiceKeys = [
  {
    key: "consciousBreathing",
    type: "meditation",
    level: ["Apprentice", "Initiate", "Sage", "Master"],
  },
  {
    key: "chakraMeditation",
    type: "meditation",
    level: ["Initiate", "Sage", "Master"],
  },
  {
    key: "gratitudeMeditation",
    type: "meditation",
    level: ["Apprentice", "Initiate", "Sage", "Master"],
  },
  {
    key: "saltBath",
    type: "bath",
    level: ["Apprentice", "Initiate", "Sage", "Master"],
  },
  { key: "roseBath", type: "bath", level: ["Initiate", "Sage", "Master"] },
  { key: "basilBath", type: "bath", level: ["Initiate", "Sage", "Master"] },
];

// Duration mappings
const durations: Record<string, { en: string; pt: string }> = {
  consciousBreathing: { en: "15 minutes", pt: "15 minutos" },
  chakraMeditation: { en: "20 minutes", pt: "20 minutos" },
  gratitudeMeditation: { en: "10 minutes", pt: "10 minutos" },
  saltBath: { en: "20 minutes", pt: "20 minutos" },
  roseBath: { en: "25 minutes", pt: "25 minutos" },
  basilBath: { en: "20 minutes", pt: "20 minutos" },
};

function getPracticeFromTranslations(
  key: string,
  type: string,
  level: string[],
  language: Language
): SpiritualPractice {
  const translationObj = language === "pt" ? pt : en;

  const practice = translationObj.utils?.spiritualPractices?.practices?.[key];
  const typeLabel =
    translationObj.utils?.spiritualPractices?.types?.[type] || type;

  if (practice) {
    return {
      type: typeLabel,
      title: practice.title,
      description: practice.description,
      duration: durations[key]?.[language] || "15 minutes",
      level,
    };
  }

  // Fallback
  return {
    type: typeLabel,
    title: "Spiritual Practice",
    description: "A practice for spiritual growth",
    duration: "15 minutes",
    level,
  };
}

export const getSpiritualPractices = (
  language: Language = "en"
): SpiritualPractice[] => {
  return practiceKeys.map(({ key, type, level }) =>
    getPracticeFromTranslations(key, type, level, language)
  );
};

export const getDailyPractice = (
  userLevel: string,
  goal: string,
  date: Date,
  language: Language = "en"
): SpiritualPractice => {
  // Default to "Apprentice" if level is undefined or not recognized
  const safeLevel = userLevel || "Apprentice";

  // Get all practices for this language
  const allPractices = getSpiritualPractices(language);

  // Filter practices by user level
  const availablePractices = allPractices.filter((practice) =>
    practice.level.includes(safeLevel)
  );

  // If no practices found for level, return all practices
  const finalPractices =
    availablePractices.length > 0 ? availablePractices : allPractices;

  // Use date as seed for consistent daily practice
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const practiceIndex = dayOfYear % finalPractices.length;

  return finalPractices[practiceIndex];
};
