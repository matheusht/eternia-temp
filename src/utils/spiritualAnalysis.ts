// Local Spiritual Analysis System - No API costs
interface AnalysisInput {
  type: 'dream' | 'feeling' | 'insight' | 'experience';
  title: string;
  content: string;
  userGoal: 'self-knowledge' | 'love' | 'prosperity' | 'spirituality';
}

interface SpiritualKeywords {
  positive: string[];
  transformative: string[];
  challenging: string[];
  spiritual: string[];
}

const SPIRITUAL_KEYWORDS: SpiritualKeywords = {
  positive: ['light', 'peace', 'love', 'harmony', 'joy', 'gratitude', 'happiness', 'balance', 'clarity', 'serenity'],
  transformative: ['change', 'transformation', 'growth', 'evolution', 'awakening', 'renewal', 'liberation', 'healing'],
  challenging: ['fear', 'anxiety', 'sadness', 'anger', 'confusion', 'doubt', 'conflict', 'blockage', 'resistance'],
  spiritual: ['meditation', 'prayer', 'intuition', 'energy', 'chakra', 'soul', 'spirit', 'divine', 'universe', 'connection']
};

const ANALYSIS_TEMPLATES = {
  dream: {
    positive: "This dream reveals positive messages from your subconscious. {insight} Your dreams are aligned with your quest for {goal}.",
    transformative: "Your dream indicates a period of spiritual transformation. {insight} The universe is preparing important changes in your journey.",
    challenging: "This dream may reflect aspects that need attention in your life. {insight} See this as an opportunity for healing and growth.",
    spiritual: "Your dream is charged with spiritual symbolism. {insight} Continue cultivating your connection with the sacred."
  },
  feeling: {
    positive: "Your feelings reveal a harmonious state of energy. {insight} This positive vibration attracts experiences aligned with {goal}.",
    transformative: "The feelings you are experiencing indicate inner growth. {insight} Allow yourself to live this transformation fully.",
    challenging: "Recognizing these feelings is the first step toward healing. {insight} Every emotion has an important message for your evolution.",
    spiritual: "You are in tune with elevated energies. {insight} Stay open to messages that come through feelings."
  },
  insight: {
    positive: "What a beautiful spiritual revelation! {insight} This understanding is a gift from the universe for your journey of {goal}.",
    transformative: "This insight marks a turning point in your evolution. {insight} Integrate this wisdom into your daily life.",
    challenging: "Even challenging insights are gifts of growth. {insight} Truth always frees and strengthens us.",
    spiritual: "You received an important divine message. {insight} Trust the wisdom that is emerging in you."
  },
  experience: {
    positive: "What an enriching experience! {insight} The universe is validating your path toward {goal}.",
    transformative: "This experience is a milestone in your spiritual journey. {insight} Each experience brings us closer to our essence.",
    challenging: "Challenging experiences are disguised opportunities. {insight} Trust that everything has a greater purpose.",
    spiritual: "You experienced something sacred and meaningful. {insight} These experiences are bridges to higher dimensions of consciousness."
  }
};

const GOAL_INSIGHTS = {
  "self-knowledge": "your quest for self-knowledge",
  "love": "your journey toward true love",
  "prosperity": "your path to abundance and prosperity",
  "spirituality": "your connection with the sacred and divine"
};

function detectSentiment(text: string): 'positive' | 'transformative' | 'challenging' | 'spiritual' {
  const lowerText = text.toLowerCase();
  
  let scores = {
    positive: 0,
    transformative: 0,
    challenging: 0,
    spiritual: 0
  };

  // Count keywords from each category
  Object.entries(SPIRITUAL_KEYWORDS).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      const matches = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
      scores[category as keyof typeof scores] += matches;
    });
  });

  // Return category with highest score, or 'positive' as default
  const maxCategory = Object.entries(scores).reduce((a, b) => scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b);
  return maxCategory[1] > 0 ? maxCategory[0] as keyof typeof scores : 'positive';
}

function generateInsight(type: string, content: string, sentiment: string): string {
  const insights = {
    dream: {
      positive: "The symbols present point to achievements and blessings coming",
      transformative: "Important changes are manifesting in your reality",
      challenging: "It's time to face inner fears and find your strength",
      spiritual: "Divine messages are coming through your dreams"
    },
    feeling: {
      positive: "Your emotional energy is in perfect tune with your desires",
      transformative: "You are going through a deep inner revolution",
      challenging: "These emotions are catalysts for your personal evolution",
      spiritual: "Your heart is open to receive divine guidance"
    },
    insight: {
      positive: "This understanding illuminates the path to your achievements",
      transformative: "A new perspective is revolutionizing your worldview",
      challenging: "The emerging truth brings liberation and growth",
      spiritual: "You are channeling wisdom from higher dimensions"
    },
    experience: {
      positive: "This experience confirms you are on the right path",
      transformative: "Each experience is a step in your spiritual ascent",
      challenging: "Challenges are polishing your inner diamond",
      spiritual: "The sacred manifests through your everyday experiences"
    }
  };

  return insights[type as keyof typeof insights][sentiment as keyof typeof insights.dream] || 
         "This experience has important messages for your journey.";
}

export function generateSpiritualAnalysis(input: AnalysisInput): string {
  const sentiment = detectSentiment(input.content + ' ' + input.title);
  const insight = generateInsight(input.type, input.content, sentiment);
  const goalText = GOAL_INSIGHTS[input.userGoal];
  
  const template = ANALYSIS_TEMPLATES[input.type][sentiment];
  
  return template
    .replace('{insight}', insight)
    .replace('{goal}', goalText);
}

// Quick analysis function (compatible with previous API)
export function analyzeEntry(type: string, title: string, content: string, userGoal: string): string {
  // Convert goal from Portuguese to English
  const goalMap: Record<string, string> = {
    "autoconhecimento": "self-knowledge",
    "amor": "love",
    "prosperidade": "prosperity",
    "espiritualidade": "spirituality"
  };
  
  const englishGoal = goalMap[userGoal] || "self-knowledge";
  
  return generateSpiritualAnalysis({
    type: type as any,
    title,
    content,
    userGoal: englishGoal as any
  });
}