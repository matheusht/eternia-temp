import { getUtilTranslation, type Language } from '@/i18n/translations';

interface SpiritualPractice {
  type: string;
  title: string;
  description: string;
  duration: string;
  level: string[];
}

export const spiritualPractices: SpiritualPractice[] = [
  // Meditations
  {
    type: "meditation",
    title: "Conscious Breathing Meditation",
    description: "Sit comfortably, close your eyes and focus only on your breathing. Inhale through your nose counting to 4, hold for 4 beats and exhale through your mouth counting to 6. Repeat for 10-15 minutes, observing each movement of air in your body.",
    duration: "15 minutes",
    level: ["Apprentice", "Initiate", "Sage", "Master"]
  },
  {
    type: "meditation",
    title: "Chakra Meditation",
    description: "Visualize a golden light entering through the top of your head and descending through each chakra: crown (violet), third eye (indigo), throat (blue), heart (green), solar plexus (yellow), sacral (orange) and root (red). Stay 2 minutes on each chakra.",
    duration: "20 minutes",
    level: ["Initiate", "Sage", "Master"]
  },
  {
    type: "meditation",
    title: "Gratitude Meditation",
    description: "Sit in silence and bring to mind 5 things you are grateful for today. Genuinely feel the emotion of gratitude in your heart. Expand this feeling throughout your body and send this energy to the universe.",
    duration: "10 minutes",
    level: ["Apprentice", "Initiate", "Sage", "Master"]
  },

  // Energy Baths
  {
    type: "bath",
    title: "Coarse Salt Bath for Cleansing",
    description: "Take your normal bath first. Then dissolve 3 handfuls of coarse salt in warm water and pour from neck down, visualizing all negative energy being removed. Finish with clean water and wear light-colored clothes.",
    duration: "20 minutes",
    level: ["Apprentice", "Initiate", "Sage", "Master"]
  },
  {
    type: "bath",
    title: "Rose Bath for Self-Love",
    description: "Boil red or pink rose petals in water for 10 minutes. Strain and mix with warm water. Pour from neck down while affirming: 'I love and accept myself completely'. Allow love to flow through your entire being.",
    duration: "25 minutes",
    level: ["Initiate", "Sage", "Master"]
  },
  {
    type: "bath",
    title: "Basil Bath for Prosperity",
    description: "Boil fresh basil leaves in water. After cooling, pour from neck down visualizing abundance coming into your life. Visualize your financial goals being achieved with gratitude.",
    duration: "20 minutes",
    level: ["Initiate", "Sage", "Master"]
  },

  // Energy Exercises
  {
    type: "exercise",
    title: "Aura Cleansing with Crystals",
    description: "Hold a clear quartz crystal and slowly pass it around your body, about 4 inches away. Visualize white light coming from the crystal and cleansing your aura. Start from the head and go down to the feet.",
    duration: "15 minutes",
    level: ["Initiate", "Sage", "Master"]
  },
  {
    type: "exercise",
    title: "Protective Shield Visualization",
    description: "Close your eyes and visualize a golden light bubble around you. This bubble is impenetrable to negative energies, but allows positive energies to flow freely. Maintain this visualization for a few minutes and activate it whenever needed.",
    duration: "10 minutes",
    level: ["Apprentice", "Initiate", "Sage", "Master"]
  },
  {
    type: "exercise",
    title: "Connection with the Elements",
    description: "Go outside or near a window. Feel the air on your skin (air element), touch the earth or a plant (earth), look at the sun or a candle (fire), and drink water consciously (water). Thank each element.",
    duration: "20 minutes",
    level: ["Apprentice", "Initiate", "Sage", "Master"]
  },

  // Advanced Practices
  {
    type: "ritual",
    title: "New Moon Ritual for New Beginnings",
    description: "Light a white candle, write your intentions for the next lunar cycle on paper. Read aloud, fold the paper and keep it under the candle until it burns out. Keep the paper ashes in a special place.",
    duration: "30 minutes",
    level: ["Sage", "Master"]
  },
  {
    type: "ritual",
    title: "Ancestor Gratitude Ceremony",
    description: "Set up a small altar with photos or objects representing your ancestors. Light incense and a candle, offering water and flowers. Speak to your ancestors, thank them for their protection and ask for guidance on your journey.",
    duration: "45 minutes",
    level: ["Sage", "Master"]
  }
];

export const getDailyPractice = (userLevel: string, goal: string, date: Date, language: Language = 'en'): SpiritualPractice => {
  // Default to "Apprentice" if level is undefined or not recognized
  const safeLevel = userLevel || "Apprentice";
  
  // Filter practices by user level
  const availablePractices = spiritualPractices.filter(practice => 
    practice.level.includes(safeLevel)
  );

  // If no practices found for level, return all practices
  const finalPractices = availablePractices.length > 0 ? availablePractices : spiritualPractices;

  // Use date as seed for consistent daily practice
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const practiceIndex = dayOfYear % finalPractices.length;
  
  return finalPractices[practiceIndex];
};