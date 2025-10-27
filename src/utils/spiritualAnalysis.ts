// Local Spiritual Analysis System - No API costs
import {
  getTranslation,
  replacePlaceholders,
  type Language,
} from "@/i18n/translations";
import { en } from "@/i18n/en";
import { pt } from "@/i18n/pt";

interface AnalysisInput {
  type: "dream" | "feeling" | "insight" | "experience";
  title: string;
  content: string;
  userGoal: "self-knowledge" | "love" | "prosperity" | "spirituality";
  language?: Language;
}

interface SpiritualKeywords {
  positive: string[];
  transformative: string[];
  challenging: string[];
  spiritual: string[];
}

const getKeywords = (language: Language): SpiritualKeywords => {
  const translations = language === "pt" ? pt : en;
  return translations.spiritualAnalysis.keywords as SpiritualKeywords;
};

function detectSentiment(
  text: string,
  language: Language
): "positive" | "transformative" | "challenging" | "spiritual" {
  const lowerText = text.toLowerCase();
  const keywords = getKeywords(language);

  let scores = {
    positive: 0,
    transformative: 0,
    challenging: 0,
    spiritual: 0,
  };

  // Count keywords from each category
  Object.entries(keywords).forEach(([category, keywordList]) => {
    keywordList.forEach((keyword) => {
      const matches = (lowerText.match(new RegExp(keyword, "gi")) || []).length;
      scores[category as keyof typeof scores] += matches;
    });
  });

  // Return category with highest score, or 'positive' as default
  const maxCategory = Object.entries(scores).reduce((a, b) =>
    scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores]
      ? a
      : b
  );
  return maxCategory[1] > 0
    ? (maxCategory[0] as keyof typeof scores)
    : "positive";
}

function generateInsight(
  type: string,
  sentiment: string,
  language: Language
): string {
  return getTranslation(
    language,
    `spiritualAnalysis.insights.${type}.${sentiment}`
  );
}

export function generateSpiritualAnalysis(input: AnalysisInput): string {
  const language = input.language || "en";
  const sentiment = detectSentiment(
    input.content + " " + input.title,
    language
  );
  const insight = generateInsight(input.type, sentiment, language);

  // Map userGoal to goal ID for translation key
  const goalMap: Record<string, string> = {
    "self-knowledge": "autoconhecimento",
    love: "amor",
    prosperity: "prosperidade",
    spirituality: "espiritualidade",
  };
  const goalId = goalMap[input.userGoal] || "autoconhecimento";
  const goalText = getTranslation(
    language,
    `spiritualAnalysis.goalTexts.${goalId}`
  );

  const template = getTranslation(
    language,
    `spiritualAnalysis.templates.${input.type}.${sentiment}`
  );

  return replacePlaceholders(template, {
    insight,
    goal: goalText,
  });
}

// Quick analysis function (compatible with previous API)
export function analyzeEntry(
  type: string,
  title: string,
  content: string,
  userGoal: string,
  language: Language = "en"
): string {
  // Convert goal from Portuguese to English format
  const goalMap: Record<string, string> = {
    autoconhecimento: "self-knowledge",
    amor: "love",
    prosperidade: "prosperity",
    espiritualidade: "spirituality",
  };

  const englishGoal = goalMap[userGoal] || "self-knowledge";

  return generateSpiritualAnalysis({
    type: type as any,
    title,
    content,
    userGoal: englishGoal as any,
    language,
  });
}
