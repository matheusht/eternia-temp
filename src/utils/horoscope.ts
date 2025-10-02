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
  goal: string
): HoroscopeData => {
  // Parse date manually to avoid timezone issues
  const parts = birthDate.split('-');
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  
  // Determine zodiac sign
  const sign = getZodiacSignInternal(month, day);
  
  // Generate personalized message based on sign and goal
  const personalizedMessage = generatePersonalizedMessage(sign, goal);
  
  // Get daily elements based on sign and current cosmic energy
  const luckyElement = getLuckyElement(sign);
  const energyColor = getEnergyColor(sign, goal);
  const spiritualFocus = getSpiritualFocus(sign, goal);
  
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

const generatePersonalizedMessage = (sign: string, goal: string): string => {
  const today = new Date();
  const messages: Record<string, Record<string, string[]>> = {
    "Aries": {
      "self-knowledge": [
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
      "self-knowledge": [
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
      "self-knowledge": [
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
      "self-knowledge": [
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
      "self-knowledge": [
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
      "self-knowledge": [
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
    },
    "Libra": {
      "self-knowledge": [
        "Your search for Libra balance reveals the wisdom of honoring all parts of yourself.",
        "The harmony you seek in the outer world reflects your need for inner peace.",
        "Your ability to see multiple perspectives is a gift that brings deep understanding."
      ],
      "love": [
        "Venus blesses your relationships with beauty, harmony, and mutual understanding today.",
        "Your diplomatic nature creates bridges of love where others see only differences.",
        "Libra love flourishes in balanced partnership and respect for the other's individuality."
      ],
      "prosperity": [
        "Partnerships and collaborations can bring unexpected financial opportunities today.",
        "Your ability to negotiate and find balanced solutions is a valuable advantage.",
        "Investments in art, beauty, or relationships can have surprising returns."
      ],
      "spirituality": [
        "Your spirituality manifests through the pursuit of justice and universal harmony.",
        "The divine reveals itself in the beauty you find and create in the world around you.",
        "Practice meditations that balance your energies and connect you with inner peace."
      ]
    },
    "Scorpio": {
      "self-knowledge": [
        "Your Scorpio intensity invites deep dives into unexplored territories of your soul.",
        "Transformation is your specialty. Today, allow yourself to die to what no longer serves.",
        "Your powerful instincts reveal truths that others prefer to ignore. Trust your perception."
      ],
      "love": [
        "Your Scorpio passion has the power to transform and regenerate relationships deeply.",
        "True love requires courage to face the shadows. You have that courage.",
        "Pluto favors intense and transformative connections that change life forever."
      ],
      "prosperity": [
        "Your ability to investigate and discover hidden opportunities can bring unexpected gains.",
        "Deep transformations in your career or business may be approaching.",
        "Investments in natural resources, therapies, or investigation may be especially favorable."
      ],
      "spirituality": [
        "Your spiritual journey passes through inner alchemy and transmutation of shadows into light.",
        "Scorpio spirituality embraces deep mysteries and hidden truths of existence.",
        "Practice purification and rebirth rituals that honor your transformative nature."
      ]
    },
    "Sagittarius": {
      "self-knowledge": [
        "Your Sagittarius soul yearns for infinite horizons of knowledge and experience.",
        "The truth you seek in the outer world is a reflection of the wisdom growing within you.",
        "Your adventurous nature reveals courageous and optimistic aspects of your personality."
      ],
      "love": [
        "Your Sagittarius heart loves with freedom and adventure. Relationships that expand your horizons are favored.",
        "Jupiter blesses connections based on mutual growth and joint exploration of life.",
        "Your honesty and optimism inspire and elevate those lucky enough to love you."
      ],
      "prosperity": [
        "International or educational expansion opportunities can bring unexpected prosperity.",
        "Your broad vision and natural optimism attract reliable investors and partners.",
        "Business adventures or investments in education can yield long-term results."
      ],
      "spirituality": [
        "Your spiritual quest expands through diverse philosophies and universal traditions.",
        "Sagittarius spirituality finds the divine in the wisdom of all cultures and beliefs.",
        "Practice meditations that expand your consciousness and connect you with universal truth."
      ]
    },
    "Capricorn": {
      "self-knowledge": [
        "Your Capricorn determination builds mountains of wisdom through patient experience.",
        "The maturity of your soul reveals itself in the ability to transform challenges into achievements.",
        "Your responsibility and discipline are reflections of your inner strength and elevated purpose."
      ],
      "love": [
        "Your Capricorn love is solid as a mountain and reliable as the seasons.",
        "Saturn favors relationships based on genuine commitment and mutual growth.",
        "Your loyalty and dedication create secure foundations where true love can flourish."
      ],
      "prosperity": [
        "Your strategic planning and persistence are building a prosperous and stable future.",
        "The natural authority and competence you demonstrate attract important opportunities.",
        "Long-term investments and wealth building are especially favored today."
      ],
      "spirituality": [
        "Your spiritual journey develops through discipline, structure, and constant dedication.",
        "Capricorn spirituality honors ancestral traditions and the wisdom of masters.",
        "Practice rituals that connect you with your spiritual lineage and life purpose."
      ]
    },
    "Aquarius": {
      "self-knowledge": [
        "Your Aquarius originality reveals unique and innovative aspects of your personality.",
        "The freedom you seek in the outer world reflects your need for inner authenticity.",
        "Your futuristic vision connects you with potentials not yet manifested by humanity."
      ],
      "love": [
        "Your Aquarius heart loves with independence and respect for the other's individuality.",
        "Uranus favors unconventional relationships based on genuine friendship and mutual freedom.",
        "Your ability to love all humanity is expressed through unique and special connections."
      ],
      "prosperity": [
        "Technological innovations and revolutionary ideas can bring unique financial opportunities.",
        "Your ability to see the future before others is a valuable competitive advantage.",
        "Investments in technology, social causes, or humanitarian movements are favored."
      ],
      "spirituality": [
        "Your Aquarius spirituality connects you with collective consciousness and humanity's good.",
        "The divine manifests through your ability to dream of a better and more just world.",
        "Practice meditations that expand your planetary and cosmic consciousness."
      ]
    },
    "Pisces": {
      "self-knowledge": [
        "Your Pisces sensitivity navigates the deep oceans of the human soul with intuitive wisdom.",
        "The compassion you feel for the world reflects the sacred connection between all beings.",
        "Your fertile imagination is a bridge between the material world and spiritual dimensions."
      ],
      "love": [
        "Your Pisces love flows like pure water, healing and nurturing everything it touches.",
        "Neptune favors relationships that transcend the physical and connect through the soul.",
        "Your capacity for unconditional love creates miracles in the hearts of those around you."
      ],
      "prosperity": [
        "Your Pisces intuition can guide you to investments that flow like water toward abundance.",
        "Creative and compassionate projects can bring unexpected financial returns.",
        "Trust your dreams and visions; they contain keys to material prosperity."
      ],
      "spirituality": [
        "Your Pisces spirituality dissolves the barriers between you and universal consciousness.",
        "You are a channel for divine love and healing. Use this gift to serve others.",
        "Practice rituals that connect you with water energy and lunar cycles."
      ]
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
  const signMessages = messages[sign] || messages["Aries"];
  const goalMessages = signMessages[englishGoal] || signMessages["self-knowledge"];
  
  const randomIndex = Math.floor(Math.random() * goalMessages.length);
  return goalMessages[randomIndex];
};

const getLuckyElement = (sign: string): string => {
  const elements: Record<string, string> = {
    "Aries": "Sacred Fire",
    "Leo": "Solar Fire", 
    "Sagittarius": "Expansive Fire",
    "Taurus": "Sacred Earth",
    "Virgo": "Pure Earth",
    "Capricorn": "Ancestral Earth",
    "Gemini": "Divine Air",
    "Libra": "Harmonious Air",
    "Aquarius": "Futuristic Air",
    "Cancer": "Celestial Water",
    "Scorpio": "Transformative Water",
    "Pisces": "Mystical Water"
  };
  
  return elements[sign] || "Sacred Fire";
};

const getEnergyColor = (sign: string, goal: string): string => {
  const baseColors: Record<string, string> = {
    "Aries": "Celestial Red",
    "Taurus": "Emerald Green", 
    "Gemini": "Golden Yellow",
    "Cancer": "Lunar Silver",
    "Leo": "Imperial Gold",
    "Virgo": "Sapphire Blue",
    "Libra": "Rose Quartz",
    "Scorpio": "Mystic Purple",
    "Sagittarius": "Celestial Turquoise",
    "Capricorn": "Cosmic Black",
    "Aquarius": "Electric Blue",
    "Pisces": "Ethereal Violet"
  };
  
  return baseColors[sign] || "Celestial Red";
};

const getSpiritualFocus = (sign: string, goal: string): string => {
  const focuses: Record<string, Record<string, string>> = {
    "Aries": {
      "self-knowledge": "Courage and self-discovery",
      "love": "Passionate authenticity",  
      "prosperity": "Leadership and initiative",
      "spirituality": "Action meditation"
    },
    "Taurus": {
      "self-knowledge": "Inner stability and values",
      "love": "Lasting commitment", 
      "prosperity": "Patient building",
      "spirituality": "Earth connection"
    },
    "Gemini": {
      "self-knowledge": "Mental versatility",
      "love": "Communication and understanding",
      "prosperity": "Diverse opportunities", 
      "spirituality": "Learning and teaching"
    },
    "Cancer": {
      "self-knowledge": "Emotional wisdom",
      "love": "Nurturing and protection",
      "prosperity": "Family security",
      "spirituality": "Ancestral connection"
    },
    "Leo": {
      "self-knowledge": "Creative self-expression", 
      "love": "Generous love",
      "prosperity": "Leadership recognition",
      "spirituality": "Solar radiance"
    },
    "Virgo": {
      "self-knowledge": "Analytical perfection",
      "love": "Service and care",
      "prosperity": "Methodical planning",
      "spirituality": "Purification rituals"
    },
    "Libra": {
      "self-knowledge": "Balance and harmony",
      "love": "Partnership equality", 
      "prosperity": "Collaborative success",
      "spirituality": "Justice and beauty"
    },
    "Scorpio": {
      "self-knowledge": "Deep transformation",
      "love": "Intense connection",
      "prosperity": "Hidden resources",
      "spirituality": "Shadow work"
    },
    "Sagittarius": {
      "self-knowledge": "Philosophical expansion",
      "love": "Freedom in unity",
      "prosperity": "International opportunities", 
      "spirituality": "Universal wisdom"
    },
    "Capricorn": {
      "self-knowledge": "Disciplined mastery",
      "love": "Committed partnership",
      "prosperity": "Long-term building",
      "spirituality": "Traditional practices"
    },
    "Aquarius": {
      "self-knowledge": "Innovative individuality",
      "love": "Friendship and freedom",
      "prosperity": "Futuristic ventures",
      "spirituality": "Collective consciousness"
    },
    "Pisces": {
      "self-knowledge": "Intuitive understanding",
      "love": "Unconditional compassion",
      "prosperity": "Flow and trust",
      "spirituality": "Mystical union"
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
  return focuses[sign]?.[englishGoal] || "Spiritual growth";
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