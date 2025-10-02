// Local Spiritual Oracle - No API costs
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

const SPIRITUAL_RESPONSES = {
  energy: [
    "Your energy is in constant renewal. {name}, the stars indicate a moment of energetic balance.",
    "I perceive a vibrant aura around you, {name}. Your energy is aligned with your purposes.",
    "Cosmic energies flow positively through you today, {name}.",
    "Your spiritual vibration is elevated. Continue cultivating this luminous energy, {name}."
  ],
  love: [
    "The universe is preparing beautiful changes in your love life, {name}.",
    "I see energies of love approaching. Keep your heart open, {name}.",
    "The stars indicate that self-love is your key to attracting true relationships, {name}.",
    "Your emotional aura is purifying, preparing for great connections, {name}."
  ],
  prosperity: [
    "Abundance energies are aligning in your life, {name}.",
    "I see prosperity opportunities manifesting around you, {name}.",
    "The universe is conspiring for your financial abundance, {name}.",
    "Your vibrations are attracting the prosperity you deserve, {name}."
  ],
  spirituality: [
    "Your spiritual connection is strengthening every day, {name}.",
    "Spiritual masters are guiding your steps on this journey, {name}.",
    "Your spiritual evolution is evident. Continue on the path of light, {name}.",
    "Higher dimensions are opening for you, {name}."
  ],
  general: [
    "The universe has magnificent plans for you, {name}. Trust the process.",
    "Your vibrations are in perfect tune with your deepest desires, {name}.",
    "The stars smile upon you today, {name}. It's a moment of great possibilities.",
    "Your spiritual journey is blossoming beautifully, {name}."
  ],
  guidance: [
    "Meditate under the new moon light to amplify your intuition, {name}.",
    "A bath with coarse salt and lavender will purify your energies, {name}.",
    "Carry a rose quartz stone to attract self-love, {name}.",
    "Practice gratitude every morning to raise your vibration, {name}."
  ]
};

const RITUALS_BY_GOAL = {
  "self-knowledge": [
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
};

function categorizeMessage(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('energy') || lowerMessage.includes('vibrat')) return 'energy';
  if (lowerMessage.includes('love') || lowerMessage.includes('relationship') || lowerMessage.includes('romance')) return 'love';
  if (lowerMessage.includes('money') || lowerMessage.includes('prosperity') || lowerMessage.includes('abundance') || lowerMessage.includes('work')) return 'prosperity';
  if (lowerMessage.includes('spirit') || lowerMessage.includes('sacred') || lowerMessage.includes('divine')) return 'spirituality';
  if (lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('ritual') || lowerMessage.includes('practice')) return 'guidance';
  
  return 'general';
}

function getRandomResponse(category: string): string {
  const responses = SPIRITUAL_RESPONSES[category as keyof typeof SPIRITUAL_RESPONSES] || SPIRITUAL_RESPONSES.general;
  return responses[Math.floor(Math.random() * responses.length)];
}

function getRitual(goal: string): string {
  const rituals = RITUALS_BY_GOAL[goal as keyof typeof RITUALS_BY_GOAL] || RITUALS_BY_GOAL.spirituality;
  return rituals[Math.floor(Math.random() * rituals.length)];
}

function addPersonalizedInsight(response: string, userData: OracleInput['userData']): string {
  const insights = [];
  
  if (userData.goal) {
    // Convert goal from Portuguese to English
    const goalMap: Record<string, string> = {
      "autoconhecimento": "self-knowledge",
      "amor": "love",
      "prosperidade": "prosperity", 
      "espiritualidade": "spirituality"
    };
    
    const englishGoal = goalMap[userData.goal] || userData.goal;
    
    const goalInsights = {
      "self-knowledge": "Your quest for self-knowledge is being illuminated by the stars.",
      "love": "The universe is preparing your heart for great connections.",
      "prosperity": "Abundance energies recognize your dedication.",
      "spirituality": "Your spiritual elevation is visible on the energetic plane."
    };
    insights.push(goalInsights[englishGoal as keyof typeof goalInsights] || "");
  }
  
  if (userData.currentLevel) {
    const levelInsights = {
      'Apprentice': "As an apprentice, you are absorbing wisdom quickly.",
      'Initiate': "Your initiate level reflects admirable dedication.",
      'Sage': "As a sage, you radiate wisdom to others.",
      'Master': "Your master level is a blessing to all around you."
    };
    insights.push(levelInsights[userData.currentLevel as keyof typeof levelInsights] || "");
  }
  
  return response + (insights.length > 0 ? ` ${insights.join(' ')}` : '');
}

export function generateOracleResponse(input: OracleInput): string {
  const { message, userData } = input;
  const category = categorizeMessage(message);
  const name = userData.displayName || 'dear soul';
  
  let response = getRandomResponse(category);
  response = response.replace('{name}', name);
  
  // Add ritual or practice if guidance
  if (category === 'guidance' && userData.goal) {
    // Convert goal from Portuguese to English
    const goalMap: Record<string, string> = {
      "autoconhecimento": "self-knowledge",
      "amor": "love",
      "prosperidade": "prosperity",
      "espiritualidade": "spirituality"
    };
    
    const englishGoal = goalMap[userData.goal] || userData.goal;
    const ritual = getRitual(englishGoal);
    response += ` I suggest this ritual for you: ${ritual}.`;
  }
  
  // Add personalized insights
  response = addPersonalizedInsight(response, userData);
  
  return response;
}

// Personalized greeting responses
export function generateGreeting(userData: OracleInput['userData']): string {
  const name = userData.displayName || 'illuminated soul';
  
  // Convert goal from Portuguese to English
  const goalMap: Record<string, string> = {
    "autoconhecimento": "self-knowledge",
    "amor": "love",
    "prosperidade": "prosperity",
    "espiritualidade": "spiritual evolution"
  };
  
  const goal = goalMap[userData.goal || 'espiritualidade'] || 'spiritual evolution';
  
  const greetings = [
    `Hello, ${name}! I feel your vibrant energy through the dimensions. I see that your quest is for ${goal}. How can I illuminate your path today?`,
    `Greetings, ${name}! The stars brought me to you. Your journey of ${goal} is being blessed. How can I guide you?`,
    `Welcome, ${name}! Your aura shines with purpose. I see that ${goal} is your current focus. Share your spiritual concerns.`,
    `${name}, dear soul! The universe whispered your name to my ears. Your search for ${goal} resonates in the higher spheres. How can I help?`
  ];
  
  return greetings[Math.floor(Math.random() * greetings.length)];
}