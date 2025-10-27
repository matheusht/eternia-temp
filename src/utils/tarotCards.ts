import { getUtilTranslation, type Language } from "@/i18n/translations";
import { en } from "@/i18n/en";
import { pt } from "@/i18n/pt";

export interface TarotCard {
  id: number;
  name: string;
  meaning: string;
  reversedMeaning: string;
  suit: "major" | "cups" | "wands" | "swords" | "pentacles";
  element: "fire" | "water" | "air" | "earth" | "spirit";
  keywords: string[];
  description: string;
  isReversed?: boolean;
}

// Helper function to get translations
const getTranslations = (language: Language = "en") => {
  return language === "pt" ? pt : en;
};

// Card key mappings for major arcana
const majorArcanaKeys = [
  "theFool",
  "theMagician",
  "theHighPriestess",
  "theEmpress",
  "theEmperor",
  "theHierophant",
  "theLovers",
  "theChariot",
  "strength",
  "theHermit",
  "wheelOfFortune",
  "justice",
  "theHangedMan",
  "death",
  "temperance",
  "theDevil",
  "theTower",
  "theStar",
  "theMoon",
  "theSun",
  "judgement",
  "theWorld",
];

// Card key mappings for minor arcana
const minorArcanaKeys = [
  { key: "aceOfCups", suit: "cups", element: "water" },
  { key: "twoOfCups", suit: "cups", element: "water" },
  { key: "aceOfWands", suit: "wands", element: "fire" },
  { key: "twoOfWands", suit: "wands", element: "fire" },
  { key: "aceOfSwords", suit: "swords", element: "air" },
  { key: "twoOfSwords", suit: "swords", element: "air" },
  { key: "aceOfPentacles", suit: "pentacles", element: "earth" },
  { key: "twoOfPentacles", suit: "pentacles", element: "earth" },
];

// Generate major arcana from translations
const getMajorArcana = (language: Language = "en"): TarotCard[] => {
  const translations = getTranslations(language);
  const tarotData = (translations.utils as any).oracle.tarot;

  return majorArcanaKeys.map((key, index) => {
    const card = tarotData.majorArcana[key];
    return {
      id: index,
      name: card.name,
      meaning: card.meaning,
      reversedMeaning: card.reversedMeaning,
      suit: "major" as const,
      element: "spirit" as const,
      keywords: [],
      description: card.description,
    };
  });
};

// Generate minor arcana from translations
const getMinorArcana = (language: Language = "en"): TarotCard[] => {
  const translations = getTranslations(language);
  const tarotData = (translations.utils as any).oracle.tarot;

  return minorArcanaKeys.map((item, index) => {
    const card = tarotData.minorArcana[item.key];
    return {
      id: 22 + index,
      name: card.name,
      meaning: card.meaning,
      reversedMeaning: card.reversedMeaning,
      suit: item.suit as any,
      element: item.element as any,
      keywords: [],
      description: card.description,
    };
  });
};

// Export with default language (English) for backward compatibility
export const majorArcana: TarotCard[] = getMajorArcana("en");
export const minorArcana: TarotCard[] = getMinorArcana("en");
export const allCards: TarotCard[] = [...majorArcana, ...minorArcana];

// Keep the old hardcoded arrays commented out for reference
/* export const majorArcana: TarotCard[] = [
  {
    id: 0,
    name: "The Fool",
    meaning: "New beginnings, spontaneity, innocence",
    reversedMeaning: "Recklessness, irresponsibility, lack of direction",
    suit: "major",
    element: "spirit",
    keywords: ["freedom", "adventure", "potential"],
    description:
      "Represents the beginning of a journey, courage to start something new",
  },
  {
    id: 1,
    name: "The Magician",
    meaning: "Personal power, skill, concentration",
    reversedMeaning: "Manipulation, poor direction, lack of energy",
    suit: "major",
    element: "spirit",
    keywords: ["manifestation", "power", "will"],
    description: "Symbolizes the ability to manifest desires into reality",
  },
  {
    id: 2,
    name: "The High Priestess",
    meaning: "Intuition, hidden wisdom, sacred feminine",
    reversedMeaning: "Ignorance, lack of intuition, secrets revealed",
    suit: "major",
    element: "spirit",
    keywords: ["intuition", "mystery", "wisdom"],
    description: "Represents connection with the unconscious and inner wisdom",
  },
  {
    id: 3,
    name: "The Empress",
    meaning: "Fertility, creativity, abundance",
    reversedMeaning: "Dependence, neglect, sterility",
    suit: "major",
    element: "spirit",
    keywords: ["abundance", "nature", "creation"],
    description: "Symbolizes feminine creative energy and natural abundance",
  },
  {
    id: 4,
    name: "The Emperor",
    meaning: "Authority, structure, control",
    reversedMeaning: "Tyranny, rigidity, lack of discipline",
    suit: "major",
    element: "spirit",
    keywords: ["leadership", "order", "stability"],
    description: "Represents authority, order and structure in life",
  },
  {
    id: 5,
    name: "The Hierophant",
    meaning: "Tradition, education, spirituality",
    reversedMeaning: "Rebellion, subversion, non-conformity",
    suit: "major",
    element: "spirit",
    keywords: ["tradition", "teaching", "spirituality"],
    description: "Symbolizes spiritual traditions and search for meaning",
  },
  {
    id: 6,
    name: "The Lovers",
    meaning: "Love, union, choices",
    reversedMeaning: "Separation, bad choice, imbalance",
    suit: "major",
    element: "spirit",
    keywords: ["love", "union", "harmony"],
    description: "Represents important choices and deep connections",
  },
  {
    id: 7,
    name: "The Chariot",
    meaning: "Victory, determination, control",
    reversedMeaning: "Lack of control, aggression, lack of direction",
    suit: "major",
    element: "spirit",
    keywords: ["victory", "progress", "determination"],
    description: "Symbolizes triumph through determination and willpower",
  },
  {
    id: 8,
    name: "Strength",
    meaning: "Inner strength, courage, patience",
    reversedMeaning: "Weakness, insecurity, lack of self-control",
    suit: "major",
    element: "spirit",
    keywords: ["courage", "strength", "compassion"],
    description: "Represents inner strength and gentle control over adversity",
  },
  {
    id: 9,
    name: "The Hermit",
    meaning: "Introspection, inner search, guidance",
    reversedMeaning: "Isolation, paranoia, rejection of help",
    suit: "major",
    element: "spirit",
    keywords: ["wisdom", "reflection", "search"],
    description: "Symbolizes the inner journey in search of wisdom",
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    meaning: "Cycles, destiny, good luck",
    reversedMeaning: "Bad luck, lack of control, negative cycles",
    suit: "major",
    element: "spirit",
    keywords: ["destiny", "change", "cycles"],
    description: "Represents life cycles and changes of destiny",
  },
  {
    id: 11,
    name: "Justice",
    meaning: "Justice, truth, cause and effect",
    reversedMeaning: "Injustice, lack of responsibility, dishonesty",
    suit: "major",
    element: "spirit",
    keywords: ["balance", "truth", "responsibility"],
    description: "Symbolizes balance, truth and consequences of our actions",
  },
  {
    id: 12,
    name: "The Hanged Man",
    meaning: "Suspension, surrender, new perspective",
    reversedMeaning: "Delay, resistance, indecision",
    suit: "major",
    element: "spirit",
    keywords: ["sacrifice", "patience", "perspective"],
    description: "Represents necessary sacrifice and change of perspective",
  },
  {
    id: 13,
    name: "Death",
    meaning: "Transformation, ending, rebirth",
    reversedMeaning: "Resistance to change, fear, stagnation",
    suit: "major",
    element: "spirit",
    keywords: ["transformation", "ending", "rebirth"],
    description: "Symbolizes profound transformation and new beginnings",
  },
  {
    id: 14,
    name: "Temperance",
    meaning: "Balance, moderation, patience",
    reversedMeaning: "Imbalance, excess, lack of harmony",
    suit: "major",
    element: "spirit",
    keywords: ["balance", "moderation", "harmony"],
    description: "Represents balance and integration of opposites",
  },
  {
    id: 15,
    name: "The Devil",
    meaning: "Temptation, materialism, ignorance",
    reversedMeaning: "Freedom, revelation, breaking chains",
    suit: "major",
    element: "spirit",
    keywords: ["temptation", "illusion", "liberation"],
    description:
      "Symbolizes illusions that bind us and the need for liberation",
  },
  {
    id: 16,
    name: "The Tower",
    meaning: "Sudden change, revelation, liberation",
    reversedMeaning: "Resistance to change, fear, disaster averted",
    suit: "major",
    element: "spirit",
    keywords: ["change", "revelation", "liberation"],
    description: "Represents sudden changes that break old structures",
  },
  {
    id: 17,
    name: "The Star",
    meaning: "Hope, inspiration, spiritual guidance",
    reversedMeaning: "Despair, lack of faith, lost guidance",
    suit: "major",
    element: "spirit",
    keywords: ["hope", "inspiration", "faith"],
    description: "Symbolizes hope, inspiration and divine guidance",
  },
  {
    id: 18,
    name: "The Moon",
    meaning: "Illusion, intuition, unconscious",
    reversedMeaning: "Truth revealed, clarity, overcoming fears",
    suit: "major",
    element: "spirit",
    keywords: ["intuition", "mystery", "illusion"],
    description: "Represents the world of dreams, intuition and hidden fears",
  },
  {
    id: 19,
    name: "The Sun",
    meaning: "Joy, success, vitality",
    reversedMeaning: "Pessimism, lack of enthusiasm, delays",
    suit: "major",
    element: "spirit",
    keywords: ["joy", "success", "vitality"],
    description: "Symbolizes joy, success and positive energy",
  },
  {
    id: 20,
    name: "Judgement",
    meaning: "Rebirth, inner judgment, calling",
    reversedMeaning: "Severe self-criticism, fear of judgment, delays",
    suit: "major",
    element: "spirit",
    keywords: ["rebirth", "judgment", "awakening"],
    description: "Represents spiritual awakening and inner judgment",
  },
  {
    id: 21,
    name: "The World",
    meaning: "Achievement, success, journey",
    reversedMeaning: "Lack of closure, seeking shortcuts, delays",
    suit: "major",
    element: "spirit",
    keywords: ["achievement", "completion", "success"],
    description: "Symbolizes complete achievement and success on all levels",
  },
]; */

/* export const minorArcana: TarotCard[] = [
  // Cups (Emotions/Water)
  {
    id: 22,
    name: "Ace of Cups",
    meaning: "New love, spiritual joy, intuition",
    reversedMeaning: "Emotional blockage, unrequited love",
    suit: "cups",
    element: "water",
    keywords: ["new love", "joy", "intuition"],
    description: "Represents emotional new beginnings and opening of the heart",
  },
  {
    id: 23,
    name: "Two of Cups",
    meaning: "Partnership, mutual love, union",
    reversedMeaning: "Separation, disagreement, self-love",
    suit: "cups",
    element: "water",
    keywords: ["partnership", "union", "love"],
    description: "Symbolizes deep emotional connections and partnerships",
  },
  // Wands (Creativity/Fire)
  {
    id: 24,
    name: "Ace of Wands",
    meaning: "New project, inspiration, growth",
    reversedMeaning: "Lack of direction, delayed projects",
    suit: "wands",
    element: "fire",
    keywords: ["inspiration", "creativity", "beginning"],
    description: "Represents new projects and creative energy",
  },
  {
    id: 25,
    name: "Two of Wands",
    meaning: "Planning, progress, discoveries",
    reversedMeaning: "Lack of planning, fear of change",
    suit: "wands",
    element: "fire",
    keywords: ["planning", "vision", "progress"],
    description: "Symbolizes future planning and long-term vision",
  },
  // Swords (Mind/Air)
  {
    id: 26,
    name: "Ace of Swords",
    meaning: "Mental clarity, truth, new thought",
    reversedMeaning: "Confusion, lack of clarity, chaotic thoughts",
    suit: "swords",
    element: "air",
    keywords: ["clarity", "truth", "mental"],
    description: "Represents mental clarity and new insights",
  },
  {
    id: 27,
    name: "Two of Swords",
    meaning: "Difficult decision, balance, dilemma",
    reversedMeaning: "Indecision, confusion, hidden information",
    suit: "swords",
    element: "air",
    keywords: ["decision", "balance", "dilemma"],
    description: "Symbolizes the need to make important decisions",
  },
  // Pentacles (Material/Earth)
  {
    id: 28,
    name: "Ace of Pentacles",
    meaning: "Prosperity, opportunity, manifestation",
    reversedMeaning: "Lost opportunity, greed, lack of prosperity",
    suit: "pentacles",
    element: "earth",
    keywords: ["prosperity", "opportunity", "material"],
    description: "Represents new material opportunities and prosperity",
  },
  {
    id: 29,
    name: "Two of Pentacles",
    meaning: "Balance, adaptability, multiple options",
    reversedMeaning: "Imbalance, lack of organization, overwhelm",
    suit: "pentacles",
    element: "earth",
    keywords: ["balance", "adaptation", "flexibility"],
    description: "Symbolizes the need to balance multiple responsibilities",
  },
]; */

// export const allCards: TarotCard[] = [...majorArcana, ...minorArcana]; // Already exported above

export const getRandomCards = (
  count: number,
  language: Language = "en"
): TarotCard[] => {
  const cards = [...getMajorArcana(language), ...getMinorArcana(language)];
  const shuffled = [...cards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((card) => ({
    ...card,
    isReversed: Math.random() < 0.3, // 30% chance of reversed card
  }));
};

export const getCardInterpretation = (
  card: TarotCard,
  position: string,
  userProfile: any,
  language: Language = "en"
): string => {
  const meaning = card.isReversed ? card.reversedMeaning : card.meaning;
  const personalizedContext = getPersonalizedContext(userProfile, language);
  const reversedText = card.isReversed
    ? language === "pt"
      ? " (Invertida)"
      : " (Reversed)"
    : "";

  return `**${card.name}**${reversedText} ${
    language === "pt" ? "na posição de" : "in the position of"
  } **${position}**:\n\n${meaning}\n\n${personalizedContext}`;
};

const getPersonalizedContext = (
  userProfile: any,
  language: Language = "en"
): string => {
  if (!userProfile) return "";

  const contexts =
    language === "pt"
      ? [
          `Como ${
            userProfile.goal || "sua jornada espiritual"
          } é importante para você, esta carta sugere reflexão sobre seus valores pessoais.`,
          `Considerando seu momento atual, esta energia pode trazer insights valiosos para seu crescimento.`,
          `Esta carta ressoa com sua busca por ${
            userProfile.goal || "autoconhecimento"
          } e pode indicar o próximo passo em sua jornada.`,
          `Sua intuição será fundamental para compreender plenamente esta mensagem.`,
        ]
      : [
          `As ${
            userProfile.goal || "your spiritual journey"
          } is important to you, this card suggests reflection on your personal values.`,
          `Considering your current moment, this energy may bring valuable insights for your growth.`,
          `This card resonates with your quest for ${
            userProfile.goal || "self-knowledge"
          } and may indicate the next step in your journey.`,
          `Your intuition will be fundamental to fully understand this message.`,
        ];

  return contexts[Math.floor(Math.random() * contexts.length)];
};
