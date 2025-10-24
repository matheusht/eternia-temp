import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Sun, Moon, Sparkles, Crown, Zap } from "lucide-react";
import { getZodiacSign } from "@/utils/horoscope";
import { useTranslation } from "@/hooks/useTranslation";

interface DailyHoroscopeProps {
  birthDate?: string;
  className?: string;
}

export const DailyHoroscope = ({ birthDate, className = "" }: DailyHoroscopeProps) => {
  const { t } = useTranslation();
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

  // Lucky numbers by sign
  const luckyNumbers = {
    "Aries": 7, "Taurus": 3, "Gemini": 5, "Cancer": 2, "Leo": 1, "Virgo": 6,
    "Libra": 4, "Scorpio": 8, "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12
  };

  const getHoroscopeData = (sign: string) => {
    const signKey = sign.toLowerCase();
    return {
      prediction: t(`horoscope.predictions.${signKey}`),
      luckyNumber: luckyNumbers[sign as keyof typeof luckyNumbers] || 1,
      luckyColor: t(`horoscope.colors.${signKey}`),
      cosmicEnergy: t(`horoscope.energies.${signKey}`),
      loveReading: t(`horoscope.love.${signKey}`),
      careerReading: t(`horoscope.career.${signKey}`),
      recommendation: t(`horoscope.rituals.${signKey}`)
    };
  };

  useEffect(() => {
    if (birthDate) {
      const sign = getZodiacSign(birthDate);
      setCurrentSign(sign);
      const data = getHoroscopeData(sign);
      setHoroscopeData(data);
    }
  }, [birthDate, t]);

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
          <h2 className="font-cinzel text-3xl text-foreground">{t('horoscope.title')}</h2>
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
          <h3 className="font-cinzel text-2xl text-foreground mb-4">{t('horoscope.cosmicMessage')}</h3>
          <p className="text-foreground/90 font-inter text-lg leading-relaxed italic">
            "{horoscopeData.prediction}"
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <Star className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-foreground/70 text-sm font-inter">{t('horoscope.luckyNumber')}</p>
            <p className="text-primary font-cinzel text-2xl font-bold">{horoscopeData.luckyNumber}</p>
          </div>
          <div className="text-center">
            <Zap className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-foreground/70 text-sm font-inter">{t('horoscope.energyColor')}</p>
            <p className="text-secondary font-cinzel text-lg">{horoscopeData.luckyColor}</p>
          </div>
          <div className="text-center">
            <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-foreground/70 text-sm font-inter">{t('horoscope.cosmicEnergy')}</p>
            <p className="text-primary font-cinzel text-lg">{horoscopeData.cosmicEnergy}</p>
          </div>
        </div>

        <Button 
          onClick={handleRevealHoroscope}
          disabled={detailsRevealed}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-cinzel text-lg py-3 gold-glow transition-all duration-300 disabled:opacity-60"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {detailsRevealed ? t('horoscope.energiesRevealed') : t('horoscope.revealEnergies')}
        </Button>
      </Card>

      {/* Leituras Detalhadas */}
      {detailsRevealed && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="luxury-card p-6 animate-scale-in">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-secondary mr-2" />
                <h4 className="font-cinzel text-xl text-foreground">{t('horoscope.loveRelationships')}</h4>
              </div>
              <p className="text-foreground/80 font-inter leading-relaxed">
                {horoscopeData.loveReading}
              </p>
            </Card>

            <Card className="luxury-card p-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center mb-4">
                <Crown className="w-5 h-5 text-primary mr-2" />
                <h4 className="font-cinzel text-xl text-foreground">{t('horoscope.careerPurpose')}</h4>
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
              <h4 className="font-cinzel text-xl text-foreground">{t('horoscope.recommendedRitual')}</h4>
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