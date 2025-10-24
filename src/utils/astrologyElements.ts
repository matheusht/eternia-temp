import { getUtilTranslation, type Language } from '@/i18n/translations';

export const getMoonPhase = (language: Language = 'en'): { phase: string; emoji: string; description: string } => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  // Simplified moon phase calculation
  const dayOfYear = Math.floor((today.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const lunarCycle = 29.53;
  const phase = (dayOfYear % lunarCycle) / lunarCycle;

  if (phase < 0.125) return {
    phase: getUtilTranslation(language, 'astrology.moonPhases.newMoon', 'name'),
    emoji: "🌑",
    description: getUtilTranslation(language, 'astrology.moonPhases.newMoon', 'description')
  };
  if (phase < 0.375) return {
    phase: getUtilTranslation(language, 'astrology.moonPhases.waxingMoon', 'name'),
    emoji: "🌒",
    description: getUtilTranslation(language, 'astrology.moonPhases.waxingMoon', 'description')
  };
  if (phase < 0.625) return {
    phase: getUtilTranslation(language, 'astrology.moonPhases.fullMoon', 'name'),
    emoji: "🌕",
    description: getUtilTranslation(language, 'astrology.moonPhases.fullMoon', 'description')
  };
  return {
    phase: getUtilTranslation(language, 'astrology.moonPhases.waningMoon', 'name'),
    emoji: "🌘",
    description: getUtilTranslation(language, 'astrology.moonPhases.waningMoon', 'description')
  };
};

export const getDailyPlanet = (language: Language = 'en'): { planet: string; emoji: string; influence: string } => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const planets = [
    {
      planet: getUtilTranslation(language, 'astrology.planets.sun', 'name'),
      emoji: "☀️",
      influence: getUtilTranslation(language, 'astrology.planets.sun', 'influence')
    },
    {
      planet: getUtilTranslation(language, 'astrology.planets.moon', 'name'),
      emoji: "🌙",
      influence: getUtilTranslation(language, 'astrology.planets.moon', 'influence')
    },
    {
      planet: getUtilTranslation(language, 'astrology.planets.mars', 'name'),
      emoji: "♂️",
      influence: getUtilTranslation(language, 'astrology.planets.mars', 'influence')
    },
    {
      planet: getUtilTranslation(language, 'astrology.planets.mercury', 'name'),
      emoji: "☿",
      influence: getUtilTranslation(language, 'astrology.planets.mercury', 'influence')
    },
    {
      planet: getUtilTranslation(language, 'astrology.planets.jupiter', 'name'),
      emoji: "♃",
      influence: getUtilTranslation(language, 'astrology.planets.jupiter', 'influence')
    },
    {
      planet: getUtilTranslation(language, 'astrology.planets.venus', 'name'),
      emoji: "♀️",
      influence: getUtilTranslation(language, 'astrology.planets.venus', 'influence')
    },
    {
      planet: getUtilTranslation(language, 'astrology.planets.saturn', 'name'),
      emoji: "♄",
      influence: getUtilTranslation(language, 'astrology.planets.saturn', 'influence')
    }
  ];

  return planets[dayOfWeek];
};

export const getLuckyNumbers = (birthDate: string): number[] => {
  // Parse date manually to avoid timezone issues
  const parts = birthDate.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  // Generate 3 lucky numbers based on birth date
  const base = day + month + (year % 100);
  return [
    (base % 9) + 1,
    ((base * 2) % 9) + 1,
    ((base * 3) % 9) + 1
  ].filter((num, index, arr) => arr.indexOf(num) === index).slice(0, 3);
};

export const getCompatibleSigns = (sign: string): string[] => {
  const compatibility: Record<string, string[]> = {
    "Aries": ["Leo", "Sagittarius", "Gemini"],
    "Taurus": ["Virgo", "Capricorn", "Cancer"],
    "Gemini": ["Libra", "Aquarius", "Aries"],
    "Cancer": ["Scorpio", "Pisces", "Taurus"],
    "Leo": ["Aries", "Sagittarius", "Gemini"],
    "Virgo": ["Taurus", "Capricorn", "Scorpio"],
    "Libra": ["Gemini", "Aquarius", "Leo"],
    "Scorpio": ["Cancer", "Pisces", "Virgo"],
    "Sagittarius": ["Aries", "Leo", "Libra"],
    "Capricorn": ["Taurus", "Virgo", "Scorpio"],
    "Aquarius": ["Gemini", "Libra", "Sagittarius"],
    "Pisces": ["Cancer", "Scorpio", "Capricorn"]
  };

  return compatibility[sign] || ["Libra", "Gemini", "Aquarius"];
};