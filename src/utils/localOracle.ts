// Local Spiritual Oracle - Language-aware with translations
import { getTranslation, type Language } from "@/i18n/translations";
import { en } from "@/i18n/en";
import { pt } from "@/i18n/pt";

interface OracleInput {
  message: string;
  userData: {
    displayName?: string;
    birthDate?: string;
    birthTime?: string;
    birthLocation?: string;
    goal?: string;
    currentLevel?: string;
  };
}

function categorizeMessage(message: string, language: Language): string {
  const lowerMessage = message.toLowerCase();

  // Keywords for both English and Portuguese
  if (
    lowerMessage.includes("energy") ||
    lowerMessage.includes("energia") ||
    lowerMessage.includes("vibrat") ||
    lowerMessage.includes("vibração")
  )
    return "energy";

  if (
    lowerMessage.includes("love") ||
    lowerMessage.includes("amor") ||
    lowerMessage.includes("relationship") ||
    lowerMessage.includes("relacionamento") ||
    lowerMessage.includes("romance")
  )
    return "love";

  if (
    lowerMessage.includes("money") ||
    lowerMessage.includes("dinheiro") ||
    lowerMessage.includes("prosperity") ||
    lowerMessage.includes("prosperidade") ||
    lowerMessage.includes("abundance") ||
    lowerMessage.includes("abundância") ||
    lowerMessage.includes("work") ||
    lowerMessage.includes("trabalho")
  )
    return "prosperity";

  if (
    lowerMessage.includes("spirit") ||
    lowerMessage.includes("espirit") ||
    lowerMessage.includes("sacred") ||
    lowerMessage.includes("sagrado") ||
    lowerMessage.includes("divine") ||
    lowerMessage.includes("divino")
  )
    return "spirituality";

  if (
    lowerMessage.includes("how") ||
    lowerMessage.includes("como") ||
    lowerMessage.includes("what") ||
    lowerMessage.includes("que") ||
    lowerMessage.includes("ritual") ||
    lowerMessage.includes("practice") ||
    lowerMessage.includes("prática")
  )
    return "guidance";

  return "general";
}

function getRandomResponse(category: string, language: Language): string {
  const responses = getTranslation(
    language,
    `utils.oracle.responses.${category}`
  );

  // If responses is an array in translations, pick random
  if (typeof responses === "string") {
    // It's a single string path, not an array - this shouldn't happen with our structure
    return responses;
  }

  // The responses are stored as arrays in our translation files
  // We need to get them properly
  const responsesKey = `utils.oracle.responses.${category}`;
  const translationObj = language === "pt" ? pt : en;

  const responseArray = translationObj.utils?.oracle?.responses?.[category];

  if (Array.isArray(responseArray) && responseArray.length > 0) {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  }

  // Fallback
  return (
    getTranslation(language, "utils.oracle.responses.general.0") ||
    "The stars smile upon you today."
  );
}

function getRitual(goal: string, language: Language): string {
  // Convert goal from Portuguese to English key if needed
  const goalMap: Record<string, string> = {
    autoconhecimento: "selfKnowledge",
    amor: "love",
    prosperidade: "prosperity",
    espiritualidade: "spirituality",
  };

  const englishGoalKey = goalMap[goal] || goal;

  const translationObj = language === "pt" ? pt : en;

  const rituals = translationObj.utils?.oracle?.rituals?.[englishGoalKey];

  if (Array.isArray(rituals) && rituals.length > 0) {
    return rituals[Math.floor(Math.random() * rituals.length)];
  }

  return "";
}

function addPersonalizedInsight(
  response: string,
  userData: OracleInput["userData"],
  language: Language
): string {
  const insights = [];

  if (userData.goal) {
    // Map Portuguese goals to translation keys
    const goalKeyMap: Record<string, string> = {
      autoconhecimento:
        "Your quest for self-knowledge is being illuminated by the stars.",
      amor: "The universe is preparing your heart for great connections.",
      prosperidade: "Abundance energies recognize your dedication.",
      espiritualidade:
        "Your spiritual elevation is visible on the energetic plane.",
    };

    const goalKeyMapPt: Record<string, string> = {
      autoconhecimento:
        "Sua busca por autoconhecimento está sendo iluminada pelas estrelas.",
      amor: "O universo está preparando seu coração para grandes conexões.",
      prosperidade: "Energias de abundância reconhecem sua dedicação.",
      espiritualidade: "Sua elevação espiritual é visível no plano energético.",
    };

    const goalInsight =
      language === "pt"
        ? goalKeyMapPt[userData.goal]
        : goalKeyMap[userData.goal];

    if (goalInsight) insights.push(goalInsight);
  }

  if (userData.currentLevel) {
    const levelInsightsEn: Record<string, string> = {
      Apprentice: "As an apprentice, you are absorbing wisdom quickly.",
      Initiate: "Your initiate level reflects admirable dedication.",
      Sage: "As a sage, you radiate wisdom to others.",
      Master: "Your master level is a blessing to all around you.",
    };

    const levelInsightsPt: Record<string, string> = {
      Apprentice: "Como aprendiz, você está absorvendo sabedoria rapidamente.",
      Initiate: "Seu nível de iniciado reflete dedicação admirável.",
      Sage: "Como sábio, você irradia sabedoria aos outros.",
      Master: "Seu nível de mestre é uma bênção para todos ao seu redor.",
    };

    const levelInsight =
      language === "pt"
        ? levelInsightsPt[userData.currentLevel]
        : levelInsightsEn[userData.currentLevel];

    if (levelInsight) insights.push(levelInsight);
  }

  return response + (insights.length > 0 ? ` ${insights.join(" ")}` : "");
}

export function generateOracleResponse(
  input: OracleInput,
  language: Language = "en"
): string {
  const { message, userData } = input;
  const category = categorizeMessage(message, language);
  const name =
    userData.displayName || (language === "pt" ? "alma querida" : "dear soul");

  let response = getRandomResponse(category, language);
  response = response.replace(/\{name\}/g, name);

  // Add ritual or practice if guidance
  if (category === "guidance" && userData.goal) {
    const ritual = getRitual(userData.goal, language);
    if (ritual) {
      const ritualIntro =
        language === "pt"
          ? `Sugiro este ritual para você: ${ritual}.`
          : `I suggest this ritual for you: ${ritual}.`;
      response += ` ${ritualIntro}`;
    }
  }

  // Add personalized insights
  response = addPersonalizedInsight(response, userData, language);

  return response;
}

// Personalized greeting responses
export function generateGreeting(
  userData: OracleInput["userData"],
  language: Language = "en"
): string {
  const name =
    userData.displayName ||
    (language === "pt" ? "alma iluminada" : "illuminated soul");

  // Map goals to readable format
  const goalMapEn: Record<string, string> = {
    autoconhecimento: "self-knowledge",
    amor: "love",
    prosperidade: "prosperity",
    espiritualidade: "spiritual evolution",
  };

  const goalMapPt: Record<string, string> = {
    autoconhecimento: "autoconhecimento",
    amor: "amor",
    prosperidade: "prosperidade",
    espiritualidade: "evolução espiritual",
  };

  const goalMap = language === "pt" ? goalMapPt : goalMapEn;
  const goal =
    goalMap[userData.goal || "espiritualidade"] ||
    (language === "pt" ? "evolução espiritual" : "spiritual evolution");

  const greetingsEn = [
    `Hello, ${name}! I feel your vibrant energy through the dimensions. I see that your quest is for ${goal}. How can I illuminate your path today?`,
    `Greetings, ${name}! The stars brought me to you. Your journey of ${goal} is being blessed. How can I guide you?`,
    `Welcome, ${name}! Your aura shines with purpose. I see that ${goal} is your current focus. Share your spiritual concerns.`,
    `${name}, dear soul! The universe whispered your name to my ears. Your search for ${goal} resonates in the higher spheres. How can I help?`,
  ];

  const greetingsPt = [
    `Olá, ${name}! Sinto sua energia vibrante através das dimensões. Vejo que sua busca é por ${goal}. Como posso iluminar seu caminho hoje?`,
    `Saudações, ${name}! As estrelas me trouxeram até você. Sua jornada de ${goal} está sendo abençoada. Como posso guiá-lo?`,
    `Bem-vindo, ${name}! Sua aura brilha com propósito. Vejo que ${goal} é seu foco atual. Compartilhe suas preocupações espirituais.`,
    `${name}, alma querida! O universo sussurrou seu nome aos meus ouvidos. Sua busca por ${goal} ressoa nas esferas superiores. Como posso ajudar?`,
  ];

  const greetings = language === "pt" ? greetingsPt : greetingsEn;

  return greetings[Math.floor(Math.random() * greetings.length)];
}
