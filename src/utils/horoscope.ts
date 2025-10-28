import { getUtilTranslation, type Language } from '@/i18n/translations';

interface HoroscopeData {
  sign: string;
  personalizedMessage: string;
  luckyElement: string;
  energyColor: string;
  spiritualFocus: string;
}

export const getPersonalizedHoroscope = (
  birthDate: string,
  birthTime: string,
  birthLocation: string,
  goal: string,
  language: Language = 'en'
): HoroscopeData => {
  // Parse date manually to avoid timezone issues
  const parts = birthDate.split('-');
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  // Determine zodiac sign
  const sign = getZodiacSignInternal(month, day);

  // Generate personalized message based on sign and goal
  const personalizedMessage = generatePersonalizedMessage(sign, goal, language);

  // Get daily elements based on sign and current cosmic energy
  const luckyElement = getLuckyElement(sign, language);
  const energyColor = getEnergyColor(sign, goal, language);
  const spiritualFocus = getSpiritualFocus(sign, goal, language);

  return {
    sign,
    personalizedMessage,
    luckyElement,
    energyColor,
    spiritualFocus
  };
};

// Public function to get zodiac sign from date string
export const getZodiacSign = (birthDate: string): string => {
  // Parse date manually to avoid timezone issues
  const parts = birthDate.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  return getZodiacSignInternal(month, day);
};

const getZodiacSignInternal = (month: number, day: number): string => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
};

const generatePersonalizedMessage = (sign: string, goal: string, language: Language = 'en'): string => {
  const messages: Record<string, Record<string, Record<string, string[]>>> = {
    en: {
      "Aries": {
        "selfKnowledge": [
          "Your Aries energy propels you to discover new aspects of yourself. Today is a day to look inward with courage.",
          "The fire that burns within you reveals deep truths. Allow yourself to know your warrior essence.",
          "Your natural initiative today guides you to an important discovery about your hidden talents."
        ],
        "love": [
          "Your ardent heart is ready for new beginnings in love. Open yourself to authentic connections.",
          "Mars' energy favors relationships based on true passion. Be yourself.",
          "Today is the day to express your feelings with the honesty typical of Aries."
        ],
        "prosperity": [
          "Your Aries determination can open doors to new financial opportunities. Act with confidence.",
          "The universe conspires in favor of your ambitious projects. It's time to take the first step.",
          "Your natural leadership attracts abundance. Trust in your ability to manifest prosperity."
        ],
        "spirituality": [
          "Your spiritual journey gains momentum through conscious action. Practice meditation in movement.",
          "The fire element connects you with transformative energies. Seek practices that elevate your vibration.",
          "Your pioneering spirituality opens unique paths of connection with the divine."
        ]
      },
      "Taurus": {
        "selfKnowledge": [
          "Your Taurus nature invites deep reflection on your essential values. Connect with your inner truth.",
          "The stability you seek begins within you. Explore your emotional roots with patience.",
          "Today is a day to honor your sensitivity and discover the strength that resides in your gentleness."
        ],
        "love": [
          "Venus blesses your relationships with harmony and beauty. Cultivate lasting and true connections.",
          "Your capacity to love deeply is a rare gift. Allow yourself to be vulnerable today.",
          "Love flourishes when you allow yourself to be authentic. Express your feelings with sincerity."
        ],
        "prosperity": [
          "Your Taurus persistence is about to bear fruit. Continue building your dreams with dedication.",
          "Abundance comes through consistent work and patience. Trust the process.",
          "Today is favorable for financial decisions based on solid planning and intuition."
        ],
        "spirituality": [
          "Your connection with Earth offers ancestral wisdom. Practice rituals that honor nature.",
          "Taurus spirituality flourishes in simplicity and gratitude for small things.",
          "Seek the sacred in everyday beauty. Every moment can be a prayer."
        ]
      },
      "Gemini": {
        "selfKnowledge": [
          "Your Gemini versatility reveals multiple facets of your personality. Explore them all without judgment.",
          "Curiosity is your superpower. Today, allow yourself to learn something new about yourself.",
          "Your brilliant mind can discover unexpected connections between different aspects of your life."
        ],
        "love": [
          "Communication is the key to your relationships today. Express yourself clearly and listen with your heart.",
          "Your social nature attracts interesting people. Be open to conversations that can change your life.",
          "Gemini love flourishes in the exchange of ideas and mutual discovery. Share your thoughts."
        ],
        "prosperity": [
          "Your communication skills can open unexpected doors today. Use your words wisely.",
          "Diversification is favorable. Consider multiple income sources or varied investments.",
          "Your adaptability is a competitive advantage. Take advantage of the changes that arise."
        ],
        "spirituality": [
          "Your spiritual journey is enriched through dialogue and exchange of experiences with others.",
          "Gemini spirituality finds the divine in diversity and connection between all things.",
          "Practice meditations that integrate mind and spirit. Your intellect is a sacred tool."
        ]
      },
      "Cancer": {
        "selfKnowledge": [
          "Your emotions are your best counselors today. Trust in the wisdom of your Cancer heart.",
          "Introspection reveals treasures hidden in your memories and past experiences.",
          "Your sensitivity is a strength, not a weakness. Honor your empathetic nature."
        ],
        "love": [
          "Your capacity to nurture and care is a gift for those you love. Express your affection today.",
          "The Moon favors relationships based on emotional security and mutual trust.",
          "Your protective and loving instinct creates deep bonds. Allow yourself to be loved in the same way."
        ],
        "prosperity": [
          "Your Cancer intuition can guide you to sound financial decisions. Trust your hunches.",
          "Investments in family, home, or lasting goods are favored today.",
          "Your ability to save and preserve resources is a valuable skill. Use it wisely."
        ],
        "spirituality": [
          "Cancer spirituality connects with family traditions and ancestral wisdom.",
          "Practice rituals that honor your ancestors and strengthen your spiritual roots.",
          "Your home is your temple. Create a sacred space where you can connect with the divine."
        ]
      },
      "Leo": {
        "selfKnowledge": [
          "Your Leo brilliance is unique in the universe. Today is a day to recognize and celebrate your special talents.",
          "The generosity of your heart reveals the nobility of your soul. Allow yourself to shine authentically.",
          "Your creativity is a divine expression. Use it to know yourself more deeply."
        ],
        "love": [
          "Your Leo heart loves with passion and grandeur. Today is a day to express your feelings with courage.",
          "The Sun favors relationships where you can be completely yourself, without masks.",
          "Your loyalty and generosity in love inspire and transform those around you."
        ],
        "prosperity": [
          "Your natural leadership attracts growth opportunities. Take command of your projects.",
          "Leo confidence can open doors that seemed impossible. Believe in your potential.",
          "Investments in your image, education, or talents can yield unexpected returns."
        ],
        "spirituality": [
          "Your spirituality shines through creative expression and celebration of life.",
          "The divine manifests in you through your ability to inspire and illuminate others.",
          "Practice solar rituals that connect you with your inner strength and life purpose."
        ]
      },
      "Virgo": {
        "selfKnowledge": [
          "Your Virgo precision reveals important details about your true nature. Observe carefully.",
          "The perfection you seek in the outer world begins with loving acceptance of yourself.",
          "Your analytical ability can discover hidden patterns in your behavior and emotions."
        ],
        "love": [
          "Your love is expressed through care and attention to detail. Small gestures have great power today.",
          "The purity of your feelings deeply touches those who can see beyond your modesty.",
          "Relationships based on mutual respect and joint growth are favored."
        ],
        "prosperity": [
          "Your organization and meticulous planning are about to yield concrete results.",
          "Virgo prosperity comes through dedicated work and continuous improvement.",
          "Today is favorable for reviewing finances and making precise adjustments to your investments."
        ],
        "spirituality": [
          "Your spiritual journey develops through dedicated service and pursuit of inner purity.",
          "Virgo spirituality finds the sacred in simplicity and daily devotion.",
          "Practice meditations that purify your mind and align your thoughts with elevated purposes."
        ]
      }
    },
    pt: {
      "Aries": {
        "selfKnowledge": [
          "Sua energia ariana o impulsiona a descobrir novos aspectos de si mesmo. Hoje é um dia para olhar para dentro com coragem.",
          "O fogo que queima dentro de você revela verdades profundas. Permita-se conhecer sua essência guerreira.",
          "Sua iniciativa natural hoje o guia a uma descoberta importante sobre seus talentos ocultos."
        ],
        "love": [
          "Seu coração ardente está pronto para novos começos no amor. Abra-se para conexões autênticas.",
          "A energia de Marte favorece relacionamentos baseados na paixão verdadeira. Seja você mesmo.",
          "Hoje é o dia de expressar seus sentimentos com a honestidade típica de Áries."
        ],
        "prosperity": [
          "Sua determinação ariana pode abrir portas para novas oportunidades financeiras. Aja com confiança.",
          "O universo conspira a favor de seus projetos ambiciosos. É hora de dar o primeiro passo.",
          "Sua liderança natural atrai abundância. Confie em sua capacidade de manifestar prosperidade."
        ],
        "spirituality": [
          "Sua jornada espiritual ganha impulso através da ação consciente. Pratique meditação em movimento.",
          "O elemento fogo o conecta com energias transformadoras. Busque práticas que elevem sua vibração.",
          "Sua espiritualidade pioneira abre caminhos únicos de conexão com o divino."
        ]
      },
      "Taurus": {
        "selfKnowledge": [
          "Sua natureza taurina convida à reflexão profunda sobre seus valores essenciais. Conecte-se com sua verdade interior.",
          "A estabilidade que você busca começa dentro de você. Explore suas raízes emocionais com paciência.",
          "Hoje é um dia para honrar sua sensibilidade e descobrir a força que reside em sua gentileza."
        ],
        "love": [
          "Vênus abençoa seus relacionamentos com harmonia e beleza. Cultive conexões duradouras e verdadeiras.",
          "Sua capacidade de amar profundamente é um dom raro. Permita-se ser vulnerável hoje.",
          "O amor floresce quando você se permite ser autêntico. Expresse seus sentimentos com sinceridade."
        ],
        "prosperity": [
          "Sua persistência taurina está prestes a dar frutos. Continue construindo seus sonhos com dedicação.",
          "A abundância vem através do trabalho consistente e paciência. Confie no processo.",
          "Hoje é favorável para decisões financeiras baseadas em planejamento sólido e intuição."
        ],
        "spirituality": [
          "Sua conexão com a Terra oferece sabedoria ancestral. Pratique rituais que honrem a natureza.",
          "A espiritualidade taurina floresce na simplicidade e gratidão pelas pequenas coisas.",
          "Busque o sagrado na beleza cotidiana. Cada momento pode ser uma oração."
        ]
      },
      "Gemini": {
        "selfKnowledge": [
          "Sua versatilidade geminiana revela múltiplas facetas de sua personalidade. Explore todas sem julgamento.",
          "A curiosidade é seu superpoder. Hoje, permita-se aprender algo novo sobre si mesmo.",
          "Sua mente brilhante pode descobrir conexões inesperadas entre diferentes aspectos de sua vida."
        ],
        "love": [
          "A comunicação é a chave para seus relacionamentos hoje. Expresse-se claramente e escute com o coração.",
          "Sua natureza social atrai pessoas interessantes. Esteja aberto a conversas que podem mudar sua vida.",
          "O amor geminiano floresce na troca de ideias e descoberta mútua. Compartilhe seus pensamentos."
        ],
        "prosperity": [
          "Suas habilidades de comunicação podem abrir portas inesperadas hoje. Use suas palavras sabiamente.",
          "A diversificação é favorável. Considere múltiplas fontes de renda ou investimentos variados.",
          "Sua adaptabilidade é uma vantagem competitiva. Aproveite as mudanças que surgem."
        ],
        "spirituality": [
          "Sua jornada espiritual se enriquece através do diálogo e troca de experiências com outros.",
          "A espiritualidade geminiana encontra o divino na diversidade e conexão entre todas as coisas.",
          "Pratique meditações que integrem mente e espírito. Seu intelecto é uma ferramenta sagrada."
        ]
      },
      "Cancer": {
        "selfKnowledge": [
          "Suas emoções são suas melhores conselheiras hoje. Confie na sabedoria do seu coração canceriano.",
          "A introspecção revela tesouros escondidos em suas memórias e experiências passadas.",
          "Sua sensibilidade é uma força, não uma fraqueza. Honre sua natureza empática."
        ],
        "love": [
          "Sua capacidade de nutrir e cuidar é um presente para aqueles que você ama. Expresse seu carinho hoje.",
          "A Lua favorece relacionamentos baseados em segurança emocional e confiança mútua.",
          "Seu instinto protetor e amoroso cria vínculos profundos. Permita-se ser amado da mesma forma."
        ],
        "prosperity": [
          "Sua intuição canceriana pode guiá-lo a decisões financeiras acertadas. Confie em seus palpites.",
          "Investimentos em família, lar ou bens duradouros são favorecidos hoje.",
          "Sua habilidade de economizar e preservar recursos é uma habilidade valiosa. Use-a sabiamente."
        ],
        "spirituality": [
          "A espiritualidade canceriana se conecta com tradições familiares e sabedoria ancestral.",
          "Pratique rituais que honrem seus ancestrais e fortaleçam suas raízes espirituais.",
          "Seu lar é seu templo. Crie um espaço sagrado onde possa se conectar com o divino."
        ]
      },
      "Leo": {
        "selfKnowledge": [
          "Seu brilho leonino é único no universo. Hoje é um dia para reconhecer e celebrar seus talentos especiais.",
          "A generosidade do seu coração revela a nobreza de sua alma. Permita-se brilhar autenticamente.",
          "Sua criatividade é uma expressão divina. Use-a para se conhecer mais profundamente."
        ],
        "love": [
          "Seu coração leonino ama com paixão e grandeza. Hoje é um dia para expressar seus sentimentos com coragem.",
          "O Sol favorece relacionamentos onde você pode ser completamente você mesmo, sem máscaras.",
          "Sua lealdade e generosidade no amor inspiram e transformam aqueles ao seu redor."
        ],
        "prosperity": [
          "Sua liderança natural atrai oportunidades de crescimento. Assuma o comando de seus projetos.",
          "A confiança leonina pode abrir portas que pareciam impossíveis. Acredite em seu potencial.",
          "Investimentos em sua imagem, educação ou talentos podem render retornos inesperados."
        ],
        "spirituality": [
          "Sua espiritualidade brilha através da expressão criativa e celebração da vida.",
          "O divino se manifesta em você através de sua capacidade de inspirar e iluminar outros.",
          "Pratique rituais solares que o conectem com sua força interior e propósito de vida."
        ]
      },
      "Virgo": {
        "selfKnowledge": [
          "Sua precisão virginiana revela detalhes importantes sobre sua verdadeira natureza. Observe cuidadosamente.",
          "A perfeição que você busca no mundo exterior começa com a aceitação amorosa de si mesmo.",
          "Sua capacidade analítica pode descobrir padrões ocultos em seu comportamento e emoções."
        ],
        "love": [
          "Seu amor se expressa através do cuidado e atenção aos detalhes. Pequenos gestos têm grande poder hoje.",
          "A pureza de seus sentimentos toca profundamente aqueles que conseguem ver além de sua modéstia.",
          "Relacionamentos baseados em respeito mútuo e crescimento conjunto são favorecidos."
        ],
        "prosperity": [
          "Sua organização e planejamento meticuloso estão prestes a render resultados concretos.",
          "A prosperidade virginiana vem através do trabalho dedicado e melhoria contínua.",
          "Hoje é favorável para revisar finanças e fazer ajustes precisos em seus investimentos."
        ],
        "spirituality": [
          "Sua jornada espiritual se desenvolve através do serviço dedicado e busca pela pureza interior.",
          "A espiritualidade virginiana encontra o sagrado na simplicidade e devoção diária.",
          "Pratique meditações que purifiquem sua mente e alinhem seus pensamentos com propósitos elevados."
        ]
      }
    }
  };

  // Convert goal from Portuguese to English for key mapping
  const goalMap: Record<string, string> = {
    "autoconhecimento": "selfKnowledge",
    "amor": "love",
    "prosperidade": "prosperity",
    "espiritualidade": "spirituality"
  };

  const englishGoal = goalMap[goal] || "selfKnowledge";
  const langMessages = messages[language] || messages['en'];
  const signMessages = langMessages[sign] || langMessages["Aries"];
  const goalMessages = signMessages[englishGoal] || signMessages["selfKnowledge"];

  const randomIndex = Math.floor(Math.random() * goalMessages.length);
  return goalMessages[randomIndex];
};

const getLuckyElement = (sign: string, language: Language): string => {
  const elements: Record<string, string> = {
    "Aries": "sacredFire",
    "Leo": "solarFire",
    "Sagittarius": "expansiveFire",
    "Taurus": "sacredEarth",
    "Virgo": "pureEarth",
    "Capricorn": "ancestralEarth",
    "Gemini": "divineAir",
    "Libra": "harmoniousAir",
    "Aquarius": "futuristicAir",
    "Cancer": "celestialWater",
    "Scorpio": "transformativeWater",
    "Pisces": "mysticalWater"
  };

  const elementKey = elements[sign] || "sacredFire";
  return getUtilTranslation(language, 'horoscope.elements', elementKey);
};

const getEnergyColor = (sign: string, goal: string, language: Language): string => {
  const baseColors: Record<string, string> = {
    "Aries": "celestialRed",
    "Taurus": "emeraldGreen",
    "Gemini": "goldenYellow",
    "Cancer": "lunarSilver",
    "Leo": "imperialGold",
    "Virgo": "sapphireBlue",
    "Libra": "roseQuartz",
    "Scorpio": "mysticPurple",
    "Sagittarius": "celestialTurquoise",
    "Capricorn": "cosmicBlack",
    "Aquarius": "electricBlue",
    "Pisces": "etherealViolet"
  };

  const colorKey = baseColors[sign] || "celestialRed";
  return getUtilTranslation(language, 'horoscope.colors', colorKey);
};

const getSpiritualFocus = (sign: string, goal: string, language: Language): string => {
  const focuses: Record<string, Record<string, string>> = {
    "Aries": {
      "self-knowledge": "ariesSelfKnowledge",
      "love": "ariesLove",
      "prosperity": "ariesProsperity",
      "spirituality": "ariesSpirituality"
    },
    "Taurus": {
      "self-knowledge": "taurusSelfKnowledge",
      "love": "taurusLove",
      "prosperity": "taurusProsperity",
      "spirituality": "taurusSpirituality"
    },
    "Gemini": {
      "self-knowledge": "geminiSelfKnowledge",
      "love": "geminiLove",
      "prosperity": "geminiProsperity",
      "spirituality": "geminiSpirituality"
    },
    "Cancer": {
      "self-knowledge": "cancerSelfKnowledge",
      "love": "cancerLove",
      "prosperity": "cancerProsperity",
      "spirituality": "cancerSpirituality"
    },
    "Leo": {
      "self-knowledge": "leoSelfKnowledge",
      "love": "leoLove",
      "prosperity": "leoProsperity",
      "spirituality": "leoSpirituality"
    },
    "Virgo": {
      "self-knowledge": "virgoSelfKnowledge",
      "love": "virgoLove",
      "prosperity": "virgoProsperity",
      "spirituality": "virgoSpirituality"
    },
    "Libra": {
      "self-knowledge": "libraSelfKnowledge",
      "love": "libraLove",
      "prosperity": "libraProsperity",
      "spirituality": "libraSpirituality"
    },
    "Scorpio": {
      "self-knowledge": "scorpioSelfKnowledge",
      "love": "scorpioLove",
      "prosperity": "scorpioProsperity",
      "spirituality": "scorpioSpirituality"
    },
    "Sagittarius": {
      "self-knowledge": "sagittariusSelfKnowledge",
      "love": "sagittariusLove",
      "prosperity": "sagittariusProsperity",
      "spirituality": "sagittariusSpirituality"
    },
    "Capricorn": {
      "self-knowledge": "capricornSelfKnowledge",
      "love": "capricornLove",
      "prosperity": "capricornProsperity",
      "spirituality": "capricornSpirituality"
    },
    "Aquarius": {
      "self-knowledge": "aquariusSelfKnowledge",
      "love": "aquariusLove",
      "prosperity": "aquariusProsperity",
      "spirituality": "aquariusSpirituality"
    },
    "Pisces": {
      "self-knowledge": "piscesSelfKnowledge",
      "love": "piscesLove",
      "prosperity": "piscesProsperity",
      "spirituality": "piscesSpirituality"
    }
  };

  // Convert goal from Portuguese to English
  const goalMap: Record<string, string> = {
    "autoconhecimento": "self-knowledge",
    "amor": "love",
    "prosperidade": "prosperity",
    "espiritualidade": "spirituality"
  };

  const englishGoal = goalMap[goal] || "self-knowledge";
  const focusKey = focuses[sign]?.[englishGoal] || "ariesSelfKnowledge";
  return getUtilTranslation(language, 'horoscope.spiritualFocus', focusKey);
};

// Generate today's numbers based on zodiac and date
export const getTodaysNumbers = (sign: string, date: Date = new Date()): number[] => {
  const signNumbers: Record<string, number[]> = {
    "Aries": [1, 8, 15, 22, 29],
    "Taurus": [2, 9, 16, 23, 30],
    "Gemini": [3, 10, 17, 24, 31],
    "Cancer": [4, 11, 18, 25, 32],
    "Leo": [5, 12, 19, 26, 33],
    "Virgo": [6, 13, 20, 27, 34],
    "Libra": [7, 14, 21, 28, 35],
    "Scorpio": [8, 15, 22, 29, 36],
    "Sagittarius": [9, 16, 23, 30, 37],
    "Capricorn": [10, 17, 24, 31, 38],
    "Aquarius": [11, 18, 25, 32, 39],
    "Pisces": [12, 19, 26, 33, 40]
  };

  const baseNumbers = signNumbers[sign] || signNumbers["Aries"];
  const dateModifier = date.getDate() % 5;

  return baseNumbers.map(num => (num + dateModifier) % 50 + 1).slice(0, 3);
};

// Simple horoscope for daily predictions
export const getDailyPrediction = (sign: string): string => {
  const predictions: Record<string, string[]> = {
    "Aries": [
      "Your pioneering spirit leads you to new discoveries today.",
      "Mars energizes your personal projects with determination.",
      "Bold decisions bring unexpected rewards."
    ],
    "Taurus": [
      "Stability and persistence guide your path to success.",
      "Venus brings beauty and harmony to your relationships.",
      "Trust your instincts in financial matters."
    ],
    "Gemini": [
      "Communication opens doors to new opportunities.",
      "Your curiosity leads to valuable insights.",
      "Networking brings beneficial connections."
    ],
    "Cancer": [
      "Emotional intelligence guides your important decisions.",
      "Family and home bring comfort and joy.",
      "Your intuition is especially strong today."
    ],
    "Leo": [
      "Your natural charisma attracts positive attention.",
      "Creative projects receive recognition and support.",
      "Leadership opportunities present themselves."
    ],
    "Virgo": [
      "Attention to detail leads to significant improvements.",
      "Your analytical skills solve complex problems.",
      "Health and wellness routines benefit you greatly."
    ],
    "Libra": [
      "Balance and harmony characterize all your interactions.",
      "Partnerships and collaborations flourish beautifully.",
      "Aesthetic and artistic pursuits bring satisfaction."
    ],
    "Scorpio": [
      "Deep insights reveal hidden truths and opportunities.",
      "Transformation and renewal energize your spirit.",
      "Intense focus leads to breakthrough moments."
    ],
    "Sagittarius": [
      "Adventure and learning expand your horizons.",
      "Optimism attracts fortunate circumstances.",
      "Travel or education opens new possibilities."
    ],
    "Capricorn": [
      "Discipline and hard work pay off significantly.",
      "Authority figures recognize your capabilities.",
      "Long-term planning shows positive results."
    ],
    "Aquarius": [
      "Innovation and originality set you apart favorably.",
      "Friendship and community support your goals.",
      "Humanitarian efforts bring unexpected rewards."
    ],
    "Pisces": [
      "Intuition and creativity guide your decisions.",
      "Compassion and empathy strengthen your relationships.",
      "Spiritual practices bring inner peace and clarity."
    ]
  };

  const signPredictions = predictions[sign] || predictions["Aries"];
  const today = new Date();
  const index = today.getDate() % signPredictions.length;

  return signPredictions[index];
};