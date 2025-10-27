type Language = 'en' | 'pt';

export const getMoonPhase = (language: Language = 'en'): { phase: string; emoji: string; description: string } => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  // Simplified moon phase calculation
  const dayOfYear = Math.floor((today.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const lunarCycle = 29.53;
  const phase = (dayOfYear % lunarCycle) / lunarCycle;

  const moonPhases = {
    en: {
      newMoon: { name: "New Moon", description: "A time for new beginnings and setting intentions" },
      waxingMoon: { name: "Waxing Moon", description: "A time for growth and building energy" },
      fullMoon: { name: "Full Moon", description: "A time of culmination and heightened energy" },
      waningMoon: { name: "Waning Moon", description: "A time for release and letting go" }
    },
    pt: {
      newMoon: { name: "Lua Nova", description: "Um tempo para novos começos e definir intenções" },
      waxingMoon: { name: "Lua Crescente", description: "Um tempo para crescimento e construção de energia" },
      fullMoon: { name: "Lua Cheia", description: "Um tempo de culminação e energia elevada" },
      waningMoon: { name: "Lua Minguante", description: "Um tempo para liberação e deixar ir" }
    }
  };

  if (phase < 0.125) return {
    phase: moonPhases[language].newMoon.name,
    emoji: "🌑",
    description: moonPhases[language].newMoon.description
  };
  if (phase < 0.375) return {
    phase: moonPhases[language].waxingMoon.name,
    emoji: "🌒",
    description: moonPhases[language].waxingMoon.description
  };
  if (phase < 0.625) return {
    phase: moonPhases[language].fullMoon.name,
    emoji: "🌕",
    description: moonPhases[language].fullMoon.description
  };
  return {
    phase: moonPhases[language].waningMoon.name,
    emoji: "🌘",
    description: moonPhases[language].waningMoon.description
  };
};

export const getDailyPlanet = (language: Language = 'en'): { planet: string; emoji: string; influence: string } => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const planetData = {
    en: [
      { planet: "Sun", emoji: "☀️", influence: "Vitality and leadership energy" },
      { planet: "Moon", emoji: "🌙", influence: "Intuition and emotional depth" },
      { planet: "Mars", emoji: "♂️", influence: "Action and determination" },
      { planet: "Mercury", emoji: "☿", influence: "Communication and mental agility" },
      { planet: "Jupiter", emoji: "♃", influence: "Expansion and good fortune" },
      { planet: "Venus", emoji: "♀️", influence: "Love and harmony" },
      { planet: "Saturn", emoji: "♄", influence: "Discipline and structure" }
    ],
    pt: [
      { planet: "Sol", emoji: "☀️", influence: "Vitalidade e energia de liderança" },
      { planet: "Lua", emoji: "🌙", influence: "Intuição e profundidade emocional" },
      { planet: "Marte", emoji: "♂️", influence: "Ação e determinação" },
      { planet: "Mercúrio", emoji: "☿", influence: "Comunicação e agilidade mental" },
      { planet: "Júpiter", emoji: "♃", influence: "Expansão e boa sorte" },
      { planet: "Vênus", emoji: "♀️", influence: "Amor e harmonia" },
      { planet: "Saturno", emoji: "♄", influence: "Disciplina e estrutura" }
    ]
  };

  return planetData[language][dayOfWeek];
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