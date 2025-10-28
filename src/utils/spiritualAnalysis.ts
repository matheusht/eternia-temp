// Local Spiritual Analysis System - No API costs
import { type Language } from "@/i18n/translations";

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
  const keywords = {
    en: {
      positive: [
        "light", "peace", "love", "harmony", "joy", "gratitude",
        "happiness", "balance", "clarity", "serenity"
      ],
      transformative: [
        "change", "transformation", "growth", "evolution", "awakening",
        "renewal", "liberation", "healing"
      ],
      challenging: [
        "fear", "anxiety", "sadness", "anger", "confusion",
        "doubt", "conflict", "blockage", "resistance"
      ],
      spiritual: [
        "meditation", "prayer", "intuition", "energy", "chakra",
        "soul", "spirit", "divine", "universe", "connection"
      ]
    },
    pt: {
      positive: [
        "luz", "paz", "amor", "harmonia", "alegria", "gratidão",
        "felicidade", "equilíbrio", "clareza", "serenidade"
      ],
      transformative: [
        "mudança", "transformação", "crescimento", "evolução", "despertar",
        "renovação", "libertação", "cura"
      ],
      challenging: [
        "medo", "ansiedade", "tristeza", "raiva", "confusão",
        "dúvida", "conflito", "bloqueio", "resistência"
      ],
      spiritual: [
        "meditação", "oração", "intuição", "energia", "chakra",
        "alma", "espírito", "divino", "universo", "conexão"
      ]
    }
  };

  return keywords[language] || keywords['en'];
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
    keywordList.forEach((keyword: string) => {
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
  const insights = {
    en: {
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
    },
    pt: {
      dream: {
        positive: "Os símbolos presentes apontam para conquistas e bênçãos vindouras",
        transformative: "Mudanças importantes estão se manifestando em sua realidade",
        challenging: "É hora de enfrentar medos internos e encontrar sua força",
        spiritual: "Mensagens divinas estão vindo através dos seus sonhos"
      },
      feeling: {
        positive: "Sua energia emocional está em perfeita sintonia com seus desejos",
        transformative: "Você está passando por uma revolução interior profunda",
        challenging: "Essas emoções são catalisadoras para sua evolução pessoal",
        spiritual: "Seu coração está aberto para receber orientação divina"
      },
      insight: {
        positive: "Este entendimento ilumina o caminho para suas conquistas",
        transformative: "Uma nova perspectiva está revolucionando sua visão de mundo",
        challenging: "A verdade emergente traz libertação e crescimento",
        spiritual: "Você está canalizando sabedoria de dimensões superiores"
      },
      experience: {
        positive: "Esta experiência confirma que você está no caminho certo",
        transformative: "Cada experiência é um degrau em sua ascensão espiritual",
        challenging: "Desafios estão polindo seu diamante interior",
        spiritual: "O sagrado se manifesta através de suas experiências cotidianas"
      }
    }
  };

  const langInsights = insights[language] || insights['en'];
  const typeInsights = langInsights[type as keyof typeof langInsights] || langInsights['experience'];
  return typeInsights[sentiment as keyof typeof typeInsights] || typeInsights['positive'];
}

export function generateSpiritualAnalysis(input: AnalysisInput): string {
  const language = input.language || "en";
  const sentiment = detectSentiment(
    input.content + " " + input.title,
    language
  );
  const insight = generateInsight(input.type, sentiment, language);

  // Get goal text
  const goalTexts = {
    en: {
      "self-knowledge": "your quest for self-knowledge",
      "love": "your journey toward true love",
      "prosperity": "your path to abundance and prosperity",
      "spirituality": "your connection with the sacred and divine"
    },
    pt: {
      "self-knowledge": "sua busca por autoconhecimento",
      "love": "sua jornada em direção ao amor verdadeiro",
      "prosperity": "seu caminho para abundância e prosperidade",
      "spirituality": "sua conexão com o sagrado e divino"
    }
  };

  const langGoalTexts = goalTexts[language] || goalTexts['en'];
  const goalText = langGoalTexts[input.userGoal] || langGoalTexts["self-knowledge"];

  // Get template
  const templates = {
    en: {
      dream: {
        positive: "This dream reveals positive messages from your subconscious. {insight} Your dreams are aligned with {goal}.",
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
        positive: "What a beautiful spiritual revelation! {insight} This understanding is a gift from the universe for {goal}.",
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
    },
    pt: {
      dream: {
        positive: "Este sonho revela mensagens positivas do seu subconsciente. {insight} Seus sonhos estão alinhados com {goal}.",
        transformative: "Seu sonho indica um período de transformação espiritual. {insight} O universo está preparando mudanças importantes em sua jornada.",
        challenging: "Este sonho pode refletir aspectos que precisam de atenção em sua vida. {insight} Veja isso como uma oportunidade de cura e crescimento.",
        spiritual: "Seu sonho está carregado de simbolismo espiritual. {insight} Continue cultivando sua conexão com o sagrado."
      },
      feeling: {
        positive: "Seus sentimentos revelam um estado harmonioso de energia. {insight} Esta vibração positiva atrai experiências alinhadas com {goal}.",
        transformative: "Os sentimentos que você está experimentando indicam crescimento interior. {insight} Permita-se viver esta transformação plenamente.",
        challenging: "Reconhecer esses sentimentos é o primeiro passo para a cura. {insight} Toda emoção tem uma mensagem importante para sua evolução.",
        spiritual: "Você está sintonizado com energias elevadas. {insight} Mantenha-se aberto às mensagens que vêm através dos sentimentos."
      },
      insight: {
        positive: "Que bela revelação espiritual! {insight} Este entendimento é um presente do universo para {goal}.",
        transformative: "Este insight marca um ponto de virada em sua evolução. {insight} Integre esta sabedoria em sua vida diária.",
        challenging: "Mesmo insights desafiadores são presentes de crescimento. {insight} A verdade sempre liberta e fortalece.",
        spiritual: "Você recebeu uma mensagem divina importante. {insight} Confie na sabedoria que está emergindo em você."
      },
      experience: {
        positive: "Que experiência enriquecedora! {insight} O universo está validando seu caminho em direção a {goal}.",
        transformative: "Esta experiência é um marco em sua jornada espiritual. {insight} Cada experiência nos aproxima de nossa essência.",
        challenging: "Experiências desafiadoras são oportunidades disfarçadas. {insight} Confie que tudo tem um propósito maior.",
        spiritual: "Você vivenciou algo sagrado e significativo. {insight} Estas experiências são pontes para dimensões superiores de consciência."
      }
    }
  };

  const langTemplates = templates[language] || templates['en'];
  const typeTemplates = langTemplates[input.type] || langTemplates['experience'];
  const template = typeTemplates[sentiment] || typeTemplates['positive'];

  // Replace placeholders manually
  return template
    .replace(/\{insight\}/g, insight)
    .replace(/\{goal\}/g, goalText);
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
