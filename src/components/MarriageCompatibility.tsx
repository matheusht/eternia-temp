import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Star, Crown, Sparkles, Users, Zap } from "lucide-react";
import { getZodiacSign } from "@/utils/horoscope";
import { useLocation } from "react-router-dom";

interface MarriageCompatibilityProps {
  userBirthDate?: string;
  className?: string;
}

export const MarriageCompatibility = ({ userBirthDate, className = "" }: MarriageCompatibilityProps) => {
  const location = useLocation();
  const isPortuguese = location.pathname.startsWith("/pt");
  const [userSign, setUserSign] = useState<string>("");
  const [partnerSign, setPartnerSign] = useState<string>("");
  const [compatibilityData, setCompatibilityData] = useState<any>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  // Direct translations
  const texts = {
    en: {
      title: "Love Compatibility",
      description: "Discover the cosmic harmony between you and your partner. The stars reveal the deepest secrets of love and compatibility.",
      yourSign: "Your Sign",
      partnerSign: "Partner's Sign",
      selectSign: "Select sign",
      basedOnBirthDate: "Based on your birth date",
      noBirthDate: "Birth date not provided",
      consulting: "Consulting the stars...",
      revealCompatibility: "Reveal Cosmic Compatibility",
      chemistry: "Chemistry",
      challenges: "Challenges",
      strengths: "Strengths",
      cosmicAdvice: "COSMIC ADVICE",
      compatible: "Compatible",
      levels: {
        soulmates: "Soul Mates",
        excellent: "Excellent",
        great: "Great",
        good: "Good",
        moderate: "Moderate",
        challenging: "Challenging"
      },
      advice: {
        high: "The stars shine favorably upon your union. This relationship has potential for deep happiness and mutual growth. Nurture the unique gifts you bring to each other.",
        medium: "Your connection has solid foundations with room for growth. Focus on understanding and appreciating your differences, as they can be your greatest strengths.",
        low: "Every relationship requires work and understanding. Use your challenges as opportunities to grow together and create a unique bond that transcends the stars."
      }
    },
    pt: {
      title: "Compatibilidade Amorosa",
      description: "Descubra a harmonia cósmica entre você e seu parceiro. As estrelas revelam os segredos mais profundos do amor e da compatibilidade.",
      yourSign: "Seu Signo",
      partnerSign: "Signo do Parceiro",
      selectSign: "Selecione o signo",
      basedOnBirthDate: "Baseado na sua data de nascimento",
      noBirthDate: "Data de nascimento não fornecida",
      consulting: "Consultando as estrelas...",
      revealCompatibility: "Revelar Compatibilidade Cósmica",
      chemistry: "Química",
      challenges: "Desafios",
      strengths: "Pontos Fortes",
      cosmicAdvice: "CONSELHO CÓSMICO",
      compatible: "Compatível",
      levels: {
        soulmates: "Almas Gêmeas",
        excellent: "Excelente",
        great: "Ótima",
        good: "Boa",
        moderate: "Moderada",
        challenging: "Desafiadora"
      },
      advice: {
        high: "As estrelas brilham favoravelmente sobre sua união. Este relacionamento tem potencial para felicidade profunda e crescimento mútuo. Nutram os dons únicos que trazem um ao outro.",
        medium: "Sua conexão tem bases sólidas com espaço para crescimento. Foquem em compreender e apreciar suas diferenças, pois elas podem ser suas maiores forças.",
        low: "Todo relacionamento requer trabalho e compreensão. Usem seus desafios como oportunidades para crescerem juntos e criarem um vínculo único que transcende as estrelas."
      }
    }
  };

  const t = (key: string): string => {
    const lang = isPortuguese ? 'pt' : 'en';
    const keys = key.split('.');
    let value: any = texts[lang];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  // Get compatibility data with translations
  const getCompatibilityData = (sign1: string, sign2: string) => {
    const compatibilityScores: Record<string, Record<string, number>> = {
      "Aries": { "Aries": 75, "Taurus": 60, "Gemini": 85, "Cancer": 55, "Leo": 90, "Virgo": 45, "Libra": 80, "Scorpio": 70, "Sagittarius": 95, "Capricorn": 50, "Aquarius": 85, "Pisces": 65 },
      "Taurus": { "Aries": 60, "Taurus": 80, "Gemini": 55, "Cancer": 95, "Leo": 70, "Virgo": 90, "Libra": 85, "Scorpio": 75, "Sagittarius": 45, "Capricorn": 95, "Aquarius": 40, "Pisces": 80 },
      "Gemini": { "Aries": 85, "Taurus": 55, "Gemini": 75, "Cancer": 60, "Leo": 80, "Virgo": 65, "Libra": 90, "Scorpio": 50, "Sagittarius": 95, "Capricorn": 45, "Aquarius": 90, "Pisces": 70 },
      "Cancer": { "Aries": 55, "Taurus": 95, "Gemini": 60, "Cancer": 85, "Leo": 70, "Virgo": 80, "Libra": 65, "Scorpio": 95, "Sagittarius": 50, "Capricorn": 85, "Aquarius": 45, "Pisces": 90 },
      "Leo": { "Aries": 90, "Taurus": 70, "Gemini": 80, "Cancer": 70, "Leo": 75, "Virgo": 55, "Libra": 85, "Scorpio": 65, "Sagittarius": 95, "Capricorn": 60, "Aquarius": 75, "Pisces": 70 },
      "Virgo": { "Aries": 45, "Taurus": 90, "Gemini": 65, "Cancer": 80, "Leo": 55, "Virgo": 70, "Libra": 75, "Scorpio": 85, "Sagittarius": 50, "Capricorn": 95, "Aquarius": 60, "Pisces": 75 },
      "Libra": { "Aries": 80, "Taurus": 85, "Gemini": 90, "Cancer": 65, "Leo": 85, "Virgo": 75, "Libra": 80, "Scorpio": 60, "Sagittarius": 85, "Capricorn": 70, "Aquarius": 95, "Pisces": 80 },
      "Scorpio": { "Aries": 70, "Taurus": 75, "Gemini": 50, "Cancer": 95, "Leo": 65, "Virgo": 85, "Libra": 60, "Scorpio": 85, "Sagittarius": 55, "Capricorn": 90, "Aquarius": 65, "Pisces": 95 },
      "Sagittarius": { "Aries": 95, "Taurus": 45, "Gemini": 95, "Cancer": 50, "Leo": 95, "Virgo": 50, "Libra": 85, "Scorpio": 55, "Sagittarius": 80, "Capricorn": 60, "Aquarius": 90, "Pisces": 70 },
      "Capricorn": { "Aries": 50, "Taurus": 95, "Gemini": 45, "Cancer": 85, "Leo": 60, "Virgo": 95, "Libra": 70, "Scorpio": 90, "Sagittarius": 60, "Capricorn": 75, "Aquarius": 65, "Pisces": 80 },
      "Aquarius": { "Aries": 85, "Taurus": 40, "Gemini": 90, "Cancer": 45, "Leo": 75, "Virgo": 60, "Libra": 95, "Scorpio": 65, "Sagittarius": 90, "Capricorn": 65, "Aquarius": 80, "Pisces": 70 },
      "Pisces": { "Aries": 65, "Taurus": 80, "Gemini": 70, "Cancer": 90, "Leo": 70, "Virgo": 75, "Libra": 80, "Scorpio": 95, "Sagittarius": 70, "Capricorn": 80, "Aquarius": 70, "Pisces": 85 }
    };

    const compatibilityDetails = {
      en: {
        chemistry: {
          90: "Explosive", 85: "Dynamic", 80: "Harmonious", 75: "Magnetic", 70: "Intense", 65: "Inspiring", 60: "Balanced", 55: "Complementary", 50: "Constructive", 45: "Challenging", 40: "Contrasting"
        },
        challenges: {
          90: "Competitive egos", 85: "Inconsistency", 80: "Quick decisions vs Indecision", 75: "Excessive competition", 70: "Jealousy and possessiveness", 65: "Reality vs Fantasy", 60: "Different rhythms", 55: "Opposing sensitivities", 50: "Impulsiveness vs Caution", 45: "Perfectionism vs Impulsiveness", 40: "Tradition vs Innovation"
        },
        strengths: {
          90: "Passion and leadership", 85: "Shared adventure", 80: "Social balance", 75: "Intense passion", 70: "Emotional depth", 65: "Shared creativity", 60: "Mutual stability", 55: "Mutual protection", 50: "Complementary ambitions", 45: "Mutual growth", 40: "Different perspectives"
        }
      },
      pt: {
        chemistry: {
          90: "Explosiva", 85: "Dinâmica", 80: "Harmoniosa", 75: "Magnética", 70: "Intensa", 65: "Inspiradora", 60: "Equilibrada", 55: "Complementar", 50: "Construtiva", 45: "Desafiadora", 40: "Contrastante"
        },
        challenges: {
          90: "Egos competitivos", 85: "Inconsistência", 80: "Decisões rápidas vs Indecisão", 75: "Competição excessiva", 70: "Ciúme e possessividade", 65: "Realidade vs Fantasia", 60: "Ritmos diferentes", 55: "Sensibilidades opostas", 50: "Impulsividade vs Cautela", 45: "Perfeccionismo vs Impulsividade", 40: "Tradição vs Inovação"
        },
        strengths: {
          90: "Paixão e liderança", 85: "Aventura compartilhada", 80: "Equilíbrio social", 75: "Paixão intensa", 70: "Profundidade emocional", 65: "Criatividade compartilhada", 60: "Estabilidade mútua", 55: "Proteção mútua", 50: "Ambições complementares", 45: "Crescimento mútuo", 40: "Perspectivas diferentes"
        }
      }
    };

    const score = compatibilityScores[sign1]?.[sign2] || 50;
    const lang = isPortuguese ? 'pt' : 'en';
    const details = compatibilityDetails[lang];

    // Find closest score for details
    const scoreKey = Object.keys(details.chemistry)
      .map(Number)
      .sort((a, b) => Math.abs(score - a) - Math.abs(score - b))[0];

    return {
      score,
      chemistry: details.chemistry[scoreKey],
      challenges: details.challenges[scoreKey],
      strengths: details.strengths[scoreKey]
    };
  };



  useEffect(() => {
    if (userBirthDate) {
      const sign = getZodiacSign(userBirthDate);
      setUserSign(sign);
    }
  }, [userBirthDate]);

  const calculateCompatibility = () => {
    if (userSign && partnerSign) {
      setIsRevealing(true);
      setTimeout(() => {
        const compatibility = getCompatibilityData(userSign, partnerSign);
        setCompatibilityData(compatibility);
        setIsRevealing(false);
      }, 1000);
    }
  };

  const getCompatibilityLevel = (score: number) => {
    if (score >= 90) return { level: t('levels.soulmates'), icon: Crown, color: "text-primary" };
    if (score >= 80) return { level: t('levels.excellent'), icon: Star, color: "text-primary" };
    if (score >= 70) return { level: t('levels.great'), icon: Heart, color: "text-secondary" };
    if (score >= 60) return { level: t('levels.good'), icon: Users, color: "text-secondary" };
    if (score >= 50) return { level: t('levels.moderate'), icon: Zap, color: "text-primary" };
    return { level: t('levels.challenging'), icon: Sparkles, color: "text-muted-foreground" };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-cinzel font-bold bg-gradient-primary bg-clip-text text-transparent">
          {t('title')}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('description')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* User Sign Card */}
        <Card className="p-6 luxury-card">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-cinzel font-semibold">{t('yourSign')}</h3>
            {userSign ? (
              <div className="space-y-2">
                <Badge variant="outline" className="text-lg px-4 py-2 mystic-border">
                  {userSign}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {t('basedOnBirthDate')}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {t('noBirthDate')}
              </p>
            )}
          </div>
        </Card>

        {/* Partner Sign Card */}
        <Card className="p-6 luxury-card">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-secondary flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-cinzel font-semibold">{t('partnerSign')}</h3>
            <div className="space-y-2">
              <Select value={partnerSign} onValueChange={setPartnerSign}>
                <SelectTrigger className="max-w-[200px] mx-auto mystic-border">
                  <SelectValue placeholder={t('selectSign')} />
                </SelectTrigger>
                <SelectContent>
                  {zodiacSigns.map((sign) => (
                    <SelectItem key={sign} value={sign}>
                      {sign}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Compatibility Button */}
      {userSign && partnerSign && !compatibilityData && (
        <div className="text-center">
          <Button
            onClick={calculateCompatibility}
            disabled={isRevealing}
            className="bg-gradient-primary hover:opacity-90 text-white px-8 py-3 text-lg font-semibold cosmic-glow"
          >
            {isRevealing ? t('consulting') : t('revealCompatibility')}
          </Button>
        </div>
      )}

      {/* Compatibility Results */}
      {compatibilityData && (
        <Card className="p-8 luxury-card bg-gradient-mystic">
          <div className="space-y-8">
            {/* Compatibility Score */}
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-3">
                {(() => {
                  const { level, icon: IconComponent, color } = getCompatibilityLevel(compatibilityData.score);
                  return (
                    <>
                      <IconComponent className={`w-12 h-12 ${color}`} />
                      <h3 className="text-3xl font-cinzel font-bold ethereal-text">{level}</h3>
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center justify-center space-x-4">
                <Badge variant="outline" className="text-lg px-6 py-3 mystic-border">
                  {userSign}
                </Badge>
                <Heart className="w-8 h-8 text-accent-pink" />
                <Badge variant="outline" className="text-lg px-6 py-3 mystic-border">
                  {partnerSign}
                </Badge>
              </div>
              <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {compatibilityData.score}% {t('compatible')}
              </div>
            </div>

            {/* Compatibility Details */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <Sparkles className="w-10 h-10 mx-auto text-primary" />
                <h4 className="font-semibold text-xl font-cinzel">{t('chemistry')}</h4>
                <p className="text-muted-foreground">{compatibilityData.chemistry}</p>
              </div>

              <div className="text-center space-y-3">
                <Zap className="w-10 h-10 mx-auto text-destructive" />
                <h4 className="font-semibold text-xl font-cinzel">{t('challenges')}</h4>
                <p className="text-muted-foreground">{compatibilityData.challenges}</p>
              </div>

              <div className="text-center space-y-3">
                <Star className="w-10 h-10 mx-auto text-secondary" />
                <h4 className="font-semibold text-xl font-cinzel">{t('strengths')}</h4>
                <p className="text-muted-foreground">{compatibilityData.strengths}</p>
              </div>
            </div>

            {/* Cosmic Advice */}
            <div className="luxury-card p-8 text-center mystic-border">
              <h4 className="text-2xl font-cinzel font-bold mb-4 ethereal-text">
                {t('cosmicAdvice')}
              </h4>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {compatibilityData.score >= 80 ?
                  t('advice.high') :
                  compatibilityData.score >= 60 ?
                    t('advice.medium') :
                    t('advice.low')
                }
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};