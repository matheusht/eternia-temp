import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Sun, Moon, Sparkles, Crown, Zap } from "lucide-react";
import { getZodiacSign } from "@/utils/horoscope";

interface DailyHoroscopeProps {
  birthDate?: string;
  className?: string;
}

export const DailyHoroscope = ({ birthDate, className = "" }: DailyHoroscopeProps) => {
  const [currentSign, setCurrentSign] = useState<string>("Aries");
  const [horoscopeData, setHoroscopeData] = useState({
    prediction: "",
    luckyNumber: 0,
    luckyColor: "",
    cosmicEnergy: "",
    loveReading: "",
    careerReading: "",
    recommendation: ""
  });
  const [isRevealing, setIsRevealing] = useState(false);
  const [detailsRevealed, setDetailsRevealed] = useState(false);

  // Static horoscope data by sign
  const horoscopeDatabase = {
    "Aries": {
      prediction: "Cosmic energies favor your natural leadership today. Mars awakens your inner strength.",
      luckyNumber: 7,
      luckyColor: "Celestial Red",
      cosmicEnergy: "Sacred Fire",
      loveReading: "Passionate connections await. Venus blesses special encounters.",
      careerReading: "New projects bring recognition. Your determination will be rewarded.",
      recommendation: "Meditate with red quartz crystals at sunrise."
    },
    "Taurus": {
      prediction: "The moon favors stability and prosperity. Your investments flourish.",
      luckyNumber: 3,
      luckyColor: "Emerald Green",
      cosmicEnergy: "Sacred Earth",
      loveReading: "Lasting relationships strengthen. Show your affection.",
      careerReading: "Patience leads to financial success. Persistence is your virtue.",
      recommendation: "Connect with nature during the waxing moon."
    },
    "Gemini": {
      prediction: "Mercury expands your communication. New ideas emerge like shooting stars.",
      luckyNumber: 5,
      luckyColor: "Golden Yellow",
      cosmicEnergy: "Divine Air",
      loveReading: "Deep conversations create special bonds. Your intelligence attracts.",
      careerReading: "Networking opens golden doors. Your versatility shines.",
      recommendation: "Write your dreams under starlight."
    },
    "Cancer": {
      prediction: "The full moon illuminates your deepest feelings. Intuition is heightened.",
      luckyNumber: 2,
      luckyColor: "Lunar Silver",
      cosmicEnergy: "Celestial Water",
      loveReading: "Family and home bring joy. Care for those you love.",
      careerReading: "Your sensitivity is a professional gift. Trust your intuition.",
      recommendation: "Full moon bath with white rose petals."
    },
    "Leo": {
      prediction: "The sun awakens your inner royalty. Your natural light attracts admiration.",
      luckyNumber: 1,
      luckyColor: "Imperial Gold",
      cosmicEnergy: "Solar Fire",
      loveReading: "Epic romance is on the horizon. Your passion is magnetic.",
      careerReading: "Natural leadership brings opportunities. Shine with confidence.",
      recommendation: "Gratitude ritual at sunrise with sandalwood incense."
    },
    "Virgo": {
      prediction: "Mercury refines your precision. Important details are revealed.",
      luckyNumber: 6,
      luckyColor: "Sapphire Blue",
      cosmicEnergy: "Pure Earth",
      loveReading: "Acts of service express true love. Be helpful.",
      careerReading: "Your perfectionism is valued. Quality over quantity.",
      recommendation: "Organize your sacred space with lavender and crystals."
    },
    "Libra": {
      prediction: "Venus harmonizes your relationships. Beauty and balance dominate the day.",
      luckyNumber: 4,
      luckyColor: "Rose Quartz Pink",
      cosmicEnergy: "Harmonious Air",
      loveReading: "Partnerships balance perfectly. Diplomacy attracts love.",
      careerReading: "Collaborations bring success. Your justice is recognized.",
      recommendation: "Meditation with rose crystals during sunset."
    },
    "Scorpio": {
      prediction: "Pluto reveals hidden mysteries. Deep transformation begins.",
      luckyNumber: 8,
      luckyColor: "Mystic Purple",
      cosmicEnergy: "Transformative Water",
      loveReading: "Emotional intensity creates deep connections. Be authentic.",
      careerReading: "Personal power manifests. Lead with wisdom.",
      recommendation: "Renewal ritual with obsidian and purple candles."
    },
    "Sagittarius": {
      prediction: "Jupiter expands your horizons. Cosmic adventures await.",
      luckyNumber: 9,
      luckyColor: "Celestial Turquoise",
      cosmicEnergy: "Expansive Fire",
      loveReading: "International or long-distance love flourishes. Keep an open mind.",
      careerReading: "Education and travel bring growth. Explore new paths.",
      recommendation: "Visualization under starry sky with amethyst."
    },
    "Capricorn": {
      prediction: "Saturn rewards your discipline. Long-term goals materialize.",
      luckyNumber: 10,
      luckyColor: "Cosmic Black",
      cosmicEnergy: "Ancestral Earth",
      loveReading: "Mature relationships deepen. Commitment brings happiness.",
      careerReading: "Authority and respect grow. Your determination impresses.",
      recommendation: "Gratitude ceremony with hematite and cedar incense."
    },
    "Aquarius": {
      prediction: "Uranus awakens your genius. Revolutionary innovations emerge.",
      luckyNumber: 11,
      luckyColor: "Electric Blue",
      cosmicEnergy: "Futuristic Air",
      loveReading: "Friendships evolve into love. Your originality enchants.",
      careerReading: "Technology and humanitarianism unite. Be visionary.",
      recommendation: "Group meditation with blue quartz crystals."
    },
    "Pisces": {
      prediction: "Neptune amplifies your intuition. Prophetic dreams manifest.",
      luckyNumber: 12,
      luckyColor: "Ethereal Violet",
      cosmicEnergy: "Mystical Water",
      loveReading: "Spiritual love transcends the physical. Connect through the soul.",
      careerReading: "Creativity and compassion open doors. Inspire others.",
      recommendation: "Ritual bath with sea salt and violet petals."
    }
  };

  useEffect(() => {
    if (birthDate) {
      const sign = getZodiacSign(birthDate);
      setCurrentSign(sign);
      const data = horoscopeDatabase[sign as keyof typeof horoscopeDatabase] || horoscopeDatabase["Aries"];
      setHoroscopeData(data);
    }
  }, [birthDate]);

  const handleRevealHoroscope = () => {
    setIsRevealing(true);
    setTimeout(() => {
      setDetailsRevealed(true);
      setIsRevealing(false);
    }, 600);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Sun className="w-6 h-6 text-primary mr-2 animate-pulse" />
          <h2 className="font-cinzel text-3xl text-foreground">Celestial Horoscope</h2>
          <Moon className="w-6 h-6 text-secondary ml-2 animate-pulse" />
        </div>
        <p className="text-foreground/70 font-inter">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Signo Atual */}
      <Card className="luxury-card p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <Crown className="w-5 h-5 text-primary mr-2" />
          <Badge variant="secondary" className="font-cinzel text-lg px-4 py-2">
            {currentSign}
          </Badge>
          <Crown className="w-5 h-5 text-primary ml-2" />
        </div>
      </Card>

      {/* Previsão Principal */}
      <Card className={`luxury-card p-8 transition-all duration-500 ${isRevealing ? 'cosmic-glow scale-105' : ''}`}>
        <div className="text-center mb-6">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4 animate-pulse" />
          <h3 className="font-cinzel text-2xl text-foreground mb-4">Cosmic Message</h3>
          <p className="text-foreground/90 font-inter text-lg leading-relaxed italic">
            "{horoscopeData.prediction}"
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <Star className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-foreground/70 text-sm font-inter">Lucky Number</p>
            <p className="text-primary font-cinzel text-2xl font-bold">{horoscopeData.luckyNumber}</p>
          </div>
          <div className="text-center">
            <Zap className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-foreground/70 text-sm font-inter">Energy Color</p>
            <p className="text-secondary font-cinzel text-lg">{horoscopeData.luckyColor}</p>
          </div>
          <div className="text-center">
            <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-foreground/70 text-sm font-inter">Cosmic Energy</p>
            <p className="text-primary font-cinzel text-lg">{horoscopeData.cosmicEnergy}</p>
          </div>
        </div>

        <Button 
          onClick={handleRevealHoroscope}
          disabled={detailsRevealed}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-cinzel text-lg py-3 gold-glow transition-all duration-300 disabled:opacity-60"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {detailsRevealed ? "Energies Revealed ✨" : "Reveal Detailed Energies"}
        </Button>
      </Card>

      {/* Leituras Detalhadas */}
      {detailsRevealed && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="luxury-card p-6 animate-scale-in">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-secondary mr-2" />
                <h4 className="font-cinzel text-xl text-foreground">Love & Relationships</h4>
              </div>
              <p className="text-foreground/80 font-inter leading-relaxed">
                {horoscopeData.loveReading}
              </p>
            </Card>

            <Card className="luxury-card p-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center mb-4">
                <Crown className="w-5 h-5 text-primary mr-2" />
                <h4 className="font-cinzel text-xl text-foreground">Career & Purpose</h4>
              </div>
              <p className="text-foreground/80 font-inter leading-relaxed">
                {horoscopeData.careerReading}
              </p>
            </Card>
          </div>

          {/* Recomendação Espiritual */}
          <Card className="luxury-card p-6 border-2 border-primary/30 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center mb-4">
              <Moon className="w-5 h-5 text-secondary mr-2" />
              <h4 className="font-cinzel text-xl text-foreground">Recommended Ritual</h4>
            </div>
            <p className="text-foreground/90 font-inter leading-relaxed italic">
              {horoscopeData.recommendation}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};