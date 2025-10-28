// Local Spiritual Oracle - Language-aware with translations
import { type Language } from "@/i18n/translations";

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
  const responses = {
    en: {
      energy: [
        "Your energy is in constant renewal. The stars indicate a moment of energetic balance.",
        "I perceive a vibrant aura around you. Your energy is aligned with your purposes.",
        "Cosmic energies flow positively through you today.",
        "Your spiritual vibration is elevated. Continue cultivating this luminous energy."
      ],
      love: [
        "The universe is preparing beautiful changes in your love life.",
        "I see energies of love approaching. Keep your heart open.",
        "The stars indicate that self-love is your key to attracting true relationships.",
        "Your emotional aura is purifying, preparing for great connections."
      ],
      prosperity: [
        "Abundance energies are aligning in your life.",
        "I see prosperity opportunities manifesting around you.",
        "The universe is conspiring for your financial abundance.",
        "Your vibrations are attracting the prosperity you deserve."
      ],
      spirituality: [
        "Your spiritual connection is strengthening every day.",
        "Spiritual masters are guiding your steps on this journey.",
        "Your spiritual evolution is evident. Continue on the path of light.",
        "Higher dimensions are opening for you."
      ],
      general: [
        "The universe has magnificent plans for you. Trust the process.",
        "Your vibrations are in perfect tune with your deepest desires.",
        "The stars smile upon you today. It's a moment of great possibilities.",
        "Your spiritual journey is blossoming beautifully."
      ]
    },
    pt: {
      energy: [
        "Sua energia está em constante renovação. As estrelas indicam um momento de equilíbrio energético.",
        "Percebo uma aura vibrante ao seu redor. Sua energia está alinhada com seus propósitos.",
        "Energias cósmicas fluem positivamente através de você hoje.",
        "Sua vibração espiritual está elevada. Continue cultivando essa energia luminosa."
      ],
      love: [
        "O universo está preparando belas mudanças em sua vida amorosa.",
        "Vejo energias de amor se aproximando. Mantenha seu coração aberto.",
        "As estrelas indicam que o amor próprio é sua chave para atrair relacionamentos verdadeiros.",
        "Sua aura emocional está se purificando, preparando-se para grandes conexões."
      ],
      prosperity: [
        "Energias de abundância estão se alinhando em sua vida.",
        "Vejo oportunidades de prosperidade se manifestando ao seu redor.",
        "O universo está conspirando para sua abundância financeira.",
        "Suas vibrações estão atraindo a prosperidade que você merece."
      ],
      spirituality: [
        "Sua conexão espiritual está se fortalecendo a cada dia.",
        "Mestres espirituais estão guiando seus passos nesta jornada.",
        "Sua evolução espiritual é evidente. Continue no caminho da luz.",
        "Dimensões superiores estão se abrindo para você."
      ],
      general: [
        "O universo tem planos magníficos para você. Confie no processo.",
        "Suas vibrações estão em perfeita sintonia com seus desejos mais profundos.",
        "As estrelas sorriem para você hoje. É um momento de grandes possibilidades.",
        "Sua jornada espiritual está florescendo lindamente."
      ]
    }
  };

  const langResponses = responses[language] || responses['en'];
  const categoryResponses = langResponses[category] || langResponses['general'];
  
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
}

function getRitual(goal: string, language: Language): string {
  const rituals = {
    en: {
      selfKnowledge: [
        "Keep a self-knowledge journal every morning",
        "Meditate looking in the mirror for 5 minutes",
        "Write 3 qualities about yourself that you recognize today",
        "Practice conscious breathing at sunrise"
      ],
      love: [
        "Light a pink candle and visualize love entering your life",
        "Write a love letter to yourself",
        "Meditate with your hand on your heart sending love to the world",
        "Wear pink or red clothes to attract loving energy"
      ],
      prosperity: [
        "Visualize golden coins raining down on you",
        "Place a coin under the full moon to energize it",
        "Affirm: 'I deserve and receive abundance' 21 times",
        "Keep a basil plant at home for prosperity"
      ],
      spirituality: [
        "Say a gratitude prayer upon waking and before sleeping",
        "Light sandalwood incense to raise your vibration",
        "Connect with nature for at least 10 minutes",
        "Practice contemplative silence for 15 minutes"
      ]
    },
    pt: {
      selfKnowledge: [
        "Mantenha um diário de autoconhecimento todas as manhãs",
        "Medite olhando no espelho por 5 minutos",
        "Escreva 3 qualidades sobre si mesmo que reconhece hoje",
        "Pratique respiração consciente ao nascer do sol"
      ],
      love: [
        "Acenda uma vela rosa e visualize o amor entrando em sua vida",
        "Escreva uma carta de amor para si mesmo",
        "Medite com a mão no coração enviando amor ao mundo",
        "Use roupas rosa ou vermelhas para atrair energia amorosa"
      ],
      prosperity: [
        "Visualize moedas douradas chovendo sobre você",
        "Coloque uma moeda sob a lua cheia para energizá-la",
        "Afirme: 'Eu mereço e recebo abundância' 21 vezes",
        "Mantenha uma planta de manjericão em casa para prosperidade"
      ],
      spirituality: [
        "Faça uma oração de gratidão ao acordar e antes de dormir",
        "Acenda incenso de sândalo para elevar sua vibração",
        "Conecte-se com a natureza por pelo menos 10 minutos",
        "Pratique silêncio contemplativo por 15 minutos"
      ]
    }
  };

  // Convert goal from Portuguese to English key if needed
  const goalMap: Record<string, string> = {
    autoconhecimento: "selfKnowledge",
    amor: "love",
    prosperidade: "prosperity",
    espiritualidade: "spirituality",
  };

  const englishGoalKey = goalMap[goal] || goal;
  const langRituals = rituals[language] || rituals['en'];
  const goalRituals = langRituals[englishGoalKey] || langRituals['spirituality'];

  return goalRituals[Math.floor(Math.random() * goalRituals.length)];
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
