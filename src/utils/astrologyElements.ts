export const getMoonPhase = (): { phase: string; emoji: string; description: string } => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  
  // Simplified moon phase calculation
  const dayOfYear = Math.floor((today.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const lunarCycle = 29.53;
  const phase = (dayOfYear % lunarCycle) / lunarCycle;
  
  if (phase < 0.125) return { phase: "New Moon", emoji: "🌑", description: "Time for new beginnings and intentions" };
  if (phase < 0.375) return { phase: "Waxing Moon", emoji: "🌒", description: "Moment of growth and expansion" };
  if (phase < 0.625) return { phase: "Full Moon", emoji: "🌕", description: "Maximum energy and manifestation" };
  return { phase: "Waning Moon", emoji: "🌘", description: "Period of reflection and release" };
};

export const getDailyPlanet = (): { planet: string; emoji: string; influence: string } => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  const planets = [
    { planet: "Sun", emoji: "☀️", influence: "Vitality and self-expression" },
    { planet: "Moon", emoji: "🌙", influence: "Intuition and emotions" },
    { planet: "Mars", emoji: "♂️", influence: "Energy and action" },
    { planet: "Mercury", emoji: "☿", influence: "Communication and intellect" },
    { planet: "Jupiter", emoji: "♃", influence: "Expansion and wisdom" },
    { planet: "Venus", emoji: "♀️", influence: "Love and harmony" },
    { planet: "Saturn", emoji: "♄", influence: "Discipline and structure" }
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