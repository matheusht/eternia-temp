import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Star, Crown, Sparkles, Users, Zap } from "lucide-react";
import { getZodiacSign } from "@/utils/horoscope";

interface MarriageCompatibilityProps {
  userBirthDate?: string;
  className?: string;
}

export const MarriageCompatibility = ({ userBirthDate, className = "" }: MarriageCompatibilityProps) => {
  const [userSign, setUserSign] = useState<string>("");
  const [partnerSign, setPartnerSign] = useState<string>("");
  const [compatibilityData, setCompatibilityData] = useState<any>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  // Compatibility database between zodiac signs
  const compatibilityDatabase = {
    "Aries": {
      "Aries": { score: 75, chemistry: "Explosive", challenges: "Excessive competition", strengths: "Intense passion" },
      "Taurus": { score: 60, chemistry: "Balanced", challenges: "Different rhythms", strengths: "Mutual stability" },
      "Gemini": { score: 85, chemistry: "Dynamic", challenges: "Inconsistency", strengths: "Shared adventure" },
      "Cancer": { score: 55, chemistry: "Complementary", challenges: "Opposing sensitivities", strengths: "Mutual protection" },
      "Leo": { score: 90, chemistry: "Magnetic", challenges: "Strong egos", strengths: "Passion and drama" },
      "Virgo": { score: 45, chemistry: "Challenging", challenges: "Perfectionism vs Impulsiveness", strengths: "Mutual growth" },
      "Libra": { score: 80, chemistry: "Harmonious", challenges: "Quick decisions vs Indecision", strengths: "Social balance" },
      "Scorpio": { score: 70, chemistry: "Intense", challenges: "Jealousy and possessiveness", strengths: "Emotional depth" },
      "Sagittarius": { score: 95, chemistry: "Adventurous", challenges: "Commitment vs Freedom", strengths: "Shared free spirit" },
      "Capricorn": { score: 50, chemistry: "Constructive", challenges: "Impulsiveness vs Caution", strengths: "Complementary ambitions" },
      "Aquarius": { score: 85, chemistry: "Innovative", challenges: "Excessive independence", strengths: "Freedom and originality" },
      "Pisces": { score: 65, chemistry: "Inspiring", challenges: "Reality vs Fantasy", strengths: "Shared creativity" }
    },
    "Taurus": {
      "Aries": { score: 60, chemistry: "Balanced", challenges: "Different rhythms", strengths: "Passion and stability" },
      "Taurus": { score: 80, chemistry: "Solid", challenges: "Doubled stubbornness", strengths: "Shared values" },
      "Gemini": { score: 55, chemistry: "Contrasting", challenges: "Stability vs Change", strengths: "Mutual learning" },
      "Cancer": { score: 95, chemistry: "Nurturing", challenges: "Possessiveness", strengths: "Home and family" },
      "Leo": { score: 70, chemistry: "Luxurious", challenges: "Spending vs Economy", strengths: "Comfortable life" },
      "Virgo": { score: 90, chemistry: "Practical", challenges: "Excessive criticism", strengths: "Organization and care" },
      "Libra": { score: 85, chemistry: "Aesthetic", challenges: "Indecision vs Determination", strengths: "Beauty and harmony" },
      "Scorpio": { score: 75, chemistry: "Magnetic", challenges: "Jealousy and possessiveness", strengths: "Deep loyalty" },
      "Sagittarius": { score: 45, chemistry: "Adventurous", challenges: "Stability vs Adventure", strengths: "Personal growth" },
      "Capricorn": { score: 95, chemistry: "Constructive", challenges: "Excessive work", strengths: "Shared goals" },
      "Aquarius": { score: 40, chemistry: "Challenging", challenges: "Tradition vs Innovation", strengths: "Different perspectives" },
      "Pisces": { score: 80, chemistry: "Dreamy", challenges: "Practicality vs Fantasy", strengths: "Romance and care" }
    },
    "Gemini": {
      "Aries": { score: 85, chemistry: "Dynamic", challenges: "Inconsistency", strengths: "Energy and adventure" },
      "Taurus": { score: 55, chemistry: "Contrasting", challenges: "Change vs Stability", strengths: "Balance" },
      "Gemini": { score: 75, chemistry: "Mental", challenges: "Superficiality", strengths: "Fluid communication" },
      "Cancer": { score: 60, chemistry: "Curious", challenges: "Logic vs Emotion", strengths: "Intellectual care" },
      "Leo": { score: 80, chemistry: "Brilliant", challenges: "Divided attention", strengths: "Social creativity" },
      "Virgo": { score: 65, chemistry: "Analytical", challenges: "Criticism vs Lightness", strengths: "Practical intelligence" },
      "Libra": { score: 90, chemistry: "Social", challenges: "Decisions vs Indecision", strengths: "Intellectual harmony" },
      "Scorpio": { score: 50, chemistry: "Mysterious", challenges: "Superficiality vs Depth", strengths: "Mutual discoveries" },
      "Sagittarius": { score: 95, chemistry: "Adventurous", challenges: "Inconsistent commitment", strengths: "Freedom and exploration" },
      "Capricorn": { score: 45, chemistry: "Structured", challenges: "Lightness vs Seriousness", strengths: "Disciplined growth" },
      "Aquarius": { score: 90, chemistry: "Innovative", challenges: "Constant changes", strengths: "Revolutionary ideas" },
      "Pisces": { score: 70, chemistry: "Imaginative", challenges: "Logic vs Intuition", strengths: "Shared creativity" }
    },
    "Cancer": {
      "Aries": { score: 55, chemistry: "Complementary", challenges: "Aggression vs Sensitivity", strengths: "Mutual protection" },
      "Taurus": { score: 95, chemistry: "Nurturing", challenges: "Excessive possessiveness", strengths: "Safe and loving home" },
      "Gemini": { score: 60, chemistry: "Curious", challenges: "Emotion vs Reason", strengths: "Care and communication" },
      "Cancer": { score: 85, chemistry: "Emotional", challenges: "Double mood swings", strengths: "Deep understanding" },
      "Leo": { score: 70, chemistry: "Warm", challenges: "Drama vs Sensitivity", strengths: "Family and loyalty" },
      "Virgo": { score: 80, chemistry: "Careful", challenges: "Criticism vs Sensitivity", strengths: "Care and organization" },
      "Libra": { score: 65, chemistry: "Harmonious", challenges: "Emotion vs Diplomacy", strengths: "Peace and home beauty" },
      "Scorpio": { score: 95, chemistry: "Deep", challenges: "Emotional intensity", strengths: "Spiritual connection" },
      "Sagittarius": { score: 50, chemistry: "Adventurous", challenges: "Security vs Freedom", strengths: "Emotional growth" },
      "Capricorn": { score: 85, chemistry: "Stable", challenges: "Emotion vs Practicality", strengths: "Family and tradition" },
      "Aquarius": { score: 45, chemistry: "Challenging", challenges: "Emotion vs Logic", strengths: "Unique perspectives" },
      "Pisces": { score: 90, chemistry: "Intuitive", challenges: "Extreme sensitivities", strengths: "Unconditional love" }
    },
    "Leo": {
      "Aries": { score: 90, chemistry: "Explosive", challenges: "Competitive egos", strengths: "Passion and leadership" },
      "Taurus": { score: 70, chemistry: "Luxurious", challenges: "Spending vs Economy", strengths: "Comfortable and beautiful life" },
      "Gemini": { score: 80, chemistry: "Brilliant", challenges: "Attention vs Versatility", strengths: "Creativity and social" },
      "Cancer": { score: 70, chemistry: "Warm", challenges: "Drama vs Sensitivity", strengths: "Family and protection" },
      "Leo": { score: 75, chemistry: "Royal", challenges: "Two kings in same kingdom", strengths: "Shared grandeur" },
      "Virgo": { score: 55, chemistry: "Educational", challenges: "Ego vs Humility", strengths: "Personal growth" },
      "Libra": { score: 85, chemistry: "Elegant", challenges: "Drama vs Harmony", strengths: "Beauty and sophistication" },
      "Scorpio": { score: 65, chemistry: "Intense", challenges: "Control vs Domination", strengths: "Deep passion" },
      "Sagittarius": { score: 95, chemistry: "Adventurous", challenges: "Ego vs Freedom", strengths: "Grandeur and adventure" },
      "Capricorn": { score: 60, chemistry: "Ambitious", challenges: "Ego vs Humility", strengths: "Shared success" },
      "Aquarius": { score: 75, chemistry: "Unique", challenges: "Attention vs Independence", strengths: "Creative originality" },
      "Pisces": { score: 70, chemistry: "Inspiring", challenges: "Ego vs Humility", strengths: "Artistic creativity" }
    },
    "Virgo": {
      "Aries": { score: 45, chemistry: "Challenging", challenges: "Perfectionism vs Impulsiveness", strengths: "Mutual growth" },
      "Taurus": { score: 90, chemistry: "Practical", challenges: "Excessive criticism", strengths: "Perfect organization" },
      "Gemini": { score: 65, chemistry: "Analytical", challenges: "Criticism vs Lightness", strengths: "Applied intelligence" },
      "Cancer": { score: 80, chemistry: "Careful", challenges: "Criticism vs Sensitivity", strengths: "Organized care" },
      "Leo": { score: 55, chemistry: "Educational", challenges: "Humility vs Ego", strengths: "Mutual improvement" },
      "Virgo": { score: 70, chemistry: "Perfect", challenges: "Doubled criticism", strengths: "Shared excellence" },
      "Libra": { score: 75, chemistry: "Refined", challenges: "Criticism vs Harmony", strengths: "Organized beauty" },
      "Scorpio": { score: 85, chemistry: "Investigative", challenges: "Analysis vs Intensity", strengths: "Structured transformation" },
      "Sagittarius": { score: 50, chemistry: "Educational", challenges: "Details vs Big picture", strengths: "Practical wisdom" },
      "Capricorn": { score: 95, chemistry: "Efficient", challenges: "Excessive perfectionism", strengths: "Methodological success" },
      "Aquarius": { score: 60, chemistry: "Innovative", challenges: "Tradition vs Innovation", strengths: "Systematic improvements" },
      "Pisces": { score: 75, chemistry: "Careful", challenges: "Criticism vs Sensitivity", strengths: "Compassionate care" }
    },
    "Libra": {
      "Aries": { score: 80, chemistry: "Balanced", challenges: "Impulsiveness vs Indecision", strengths: "Passion and harmony" },
      "Taurus": { score: 85, chemistry: "Aesthetic", challenges: "Indecision vs Determination", strengths: "Beauty and comfort" },
      "Gemini": { score: 90, chemistry: "Social", challenges: "Doubled indecision", strengths: "Intellectual harmony" },
      "Cancer": { score: 65, chemistry: "Harmonious", challenges: "Diplomacy vs Emotion", strengths: "Peace in relationship" },
      "Leo": { score: 85, chemistry: "Elegant", challenges: "Harmony vs Drama", strengths: "Shared sophistication" },
      "Virgo": { score: 75, chemistry: "Refined", challenges: "Harmony vs Criticism", strengths: "Aesthetic perfection" },
      "Libra": { score: 80, chemistry: "Harmonious", challenges: "Double indecisions", strengths: "Perfect peace and beauty" },
      "Scorpio": { score: 60, chemistry: "Magnetic", challenges: "Harmony vs Intensity", strengths: "Balanced transformation" },
      "Sagittarius": { score: 85, chemistry: "Adventurous", challenges: "Indecision vs Action", strengths: "Refined adventures" },
      "Capricorn": { score: 70, chemistry: "Structured", challenges: "Beauty vs Practicality", strengths: "Elegant success" },
      "Aquarius": { score: 95, chemistry: "Ideal", challenges: "Harmony vs Rebellion", strengths: "Justice and innovation" },
      "Pisces": { score: 80, chemistry: "Romantic", challenges: "Decision vs Intuition", strengths: "Artistic love" }
    },
    "Scorpio": {
      "Aries": { score: 70, chemistry: "Intense", challenges: "Competition of intensities", strengths: "Transforming passion" },
      "Taurus": { score: 75, chemistry: "Magnetic", challenges: "Possessiveness vs Stubbornness", strengths: "Deep loyalty" },
      "Gemini": { score: 50, chemistry: "Mysterious", challenges: "Depth vs Superficiality", strengths: "Fascinating discoveries" },
      "Cancer": { score: 95, chemistry: "Deep", challenges: "Emotional intensities", strengths: "Total spiritual connection" },
      "Leo": { score: 65, chemistry: "Dramatic", challenges: "Control vs Domination", strengths: "Magnetic passion" },
      "Virgo": { score: 85, chemistry: "Investigative", challenges: "Intensity vs Analysis", strengths: "Detailed transformation" },
      "Libra": { score: 60, chemistry: "Balanced", challenges: "Intensity vs Harmony", strengths: "Transforming beauty" },
      "Scorpio": { score: 85, chemistry: "Explosive", challenges: "Doubled jealousy and possessiveness", strengths: "Total soul union" },
      "Sagittarius": { score: 55, chemistry: "Transforming", challenges: "Depth vs Freedom", strengths: "Spiritual growth" },
      "Capricorn": { score: 90, chemistry: "Powerful", challenges: "Control vs Ambition", strengths: "Power and transformation" },
      "Aquarius": { score: 65, chemistry: "Mysterious", challenges: "Intensity vs Detachment", strengths: "Revolutionary transformation" },
      "Pisces": { score: 95, chemistry: "Mystical", challenges: "Spiritual intensities", strengths: "Transcendental union" }
    },
    "Sagittarius": {
      "Aries": { score: 95, chemistry: "Adventurous", challenges: "Competition of freedoms", strengths: "Unlimited adventure" },
      "Taurus": { score: 45, chemistry: "Contrasting", challenges: "Adventure vs Stability", strengths: "Growth through differences" },
      "Gemini": { score: 95, chemistry: "Exploratory", challenges: "Inconsistent commitments", strengths: "Intellectual freedom" },
      "Cancer": { score: 50, chemistry: "Educational", challenges: "Freedom vs Security", strengths: "Emotional growth" },
      "Leo": { score: 95, chemistry: "Grandiose", challenges: "Ego vs Freedom", strengths: "Adventurous grandeur" },
      "Virgo": { score: 50, chemistry: "Educational", challenges: "Big picture vs Details", strengths: "Expanded practical wisdom" },
      "Libra": { score: 85, chemistry: "Harmonious", challenges: "Action vs Indecision", strengths: "Refined adventures" },
      "Scorpio": { score: 55, chemistry: "Transforming", challenges: "Freedom vs Depth", strengths: "Transformation through experience" },
      "Sagittarius": { score: 80, chemistry: "Free", challenges: "Commitment vs Doubled freedom", strengths: "Shared epic adventures" },
      "Capricorn": { score: 60, chemistry: "Ambitious", challenges: "Freedom vs Responsibility", strengths: "Success through adventure" },
      "Aquarius": { score: 90, chemistry: "Revolutionary", challenges: "Freedom vs Ideals", strengths: "Innovation through experience" },
      "Pisces": { score: 70, chemistry: "Spiritual", challenges: "Adventure vs Spirituality", strengths: "Shared spiritual journey" }
    },
    "Capricorn": {
      "Aries": { score: 50, chemistry: "Ambitious", challenges: "Impulsiveness vs Caution", strengths: "Strength and determination" },
      "Taurus": { score: 95, chemistry: "Solid", challenges: "Excessive work", strengths: "Stability and success" },
      "Gemini": { score: 45, chemistry: "Structured", challenges: "Seriousness vs Lightness", strengths: "Disciplined growth" },
      "Cancer": { score: 85, chemistry: "Traditional", challenges: "Work vs Family", strengths: "Tradition and security" },
      "Leo": { score: 60, chemistry: "Ambitious", challenges: "Humility vs Ego", strengths: "Shared success" },
      "Virgo": { score: 95, chemistry: "Perfect", challenges: "Excessive perfectionism", strengths: "Systematic excellence" },
      "Libra": { score: 70, chemistry: "Elegant", challenges: "Practicality vs Beauty", strengths: "Refined success" },
      "Scorpio": { score: 90, chemistry: "Powerful", challenges: "Ambition vs Control", strengths: "Structured power and transformation" },
      "Sagittarius": { score: 60, chemistry: "Expansive", challenges: "Responsibility vs Freedom", strengths: "Disciplined growth" },
      "Capricorn": { score: 75, chemistry: "Ambitious", challenges: "Work vs Relationship", strengths: "Shared empire" },
      "Aquarius": { score: 65, chemistry: "Innovative", challenges: "Tradition vs Innovation", strengths: "Structured progress" },
      "Pisces": { score: 80, chemistry: "Compassionate", challenges: "Practicality vs Spirituality", strengths: "Success with purpose" }
    },
    "Aquarius": {
      "Aries": { score: 85, chemistry: "Innovative", challenges: "Independence vs Impulsiveness", strengths: "Revolutionary originality" },
      "Taurus": { score: 40, chemistry: "Challenging", challenges: "Innovation vs Tradition", strengths: "Growth through difference" },
      "Gemini": { score: 90, chemistry: "Mental", challenges: "Constant changes", strengths: "Intellectual innovation" },
      "Cancer": { score: 45, chemistry: "Contrasting", challenges: "Logic vs Emotion", strengths: "Balanced perspectives" },
      "Leo": { score: 75, chemistry: "Creative", challenges: "Independence vs Attention", strengths: "Unique creativity" },
      "Virgo": { score: 60, chemistry: "Improving", challenges: "Innovation vs Tradition", strengths: "Systematic improvements" },
      "Libra": { score: 95, chemistry: "Ideal", challenges: "Rebellion vs Harmony", strengths: "Perfect justice and innovation" },
      "Scorpio": { score: 65, chemistry: "Transforming", challenges: "Detachment vs Intensity", strengths: "Revolutionary transformation" },
      "Sagittarius": { score: 90, chemistry: "Free", challenges: "Ideals vs Adventure", strengths: "Freedom and innovation" },
      "Capricorn": { score: 65, chemistry: "Progressive", challenges: "Innovation vs Structure", strengths: "Organized progress" },
      "Aquarius": { score: 80, chemistry: "Revolutionary", challenges: "Doubled independence", strengths: "Shared revolution" },
      "Pisces": { score: 70, chemistry: "Visionary", challenges: "Logic vs Intuition", strengths: "Humanitarian visions" }
    },
    "Pisces": {
      "Aries": { score: 65, chemistry: "Inspiring", challenges: "Aggression vs Sensitivity", strengths: "Creative passion" },
      "Taurus": { score: 80, chemistry: "Romantic", challenges: "Fantasy vs Practicality", strengths: "Stable romance" },
      "Gemini": { score: 70, chemistry: "Imaginative", challenges: "Intuition vs Logic", strengths: "Communicative creativity" },
      "Cancer": { score: 90, chemistry: "Intuitive", challenges: "Extreme sensitivities", strengths: "Deep and unconditional love" },
      "Leo": { score: 70, chemistry: "Artistic", challenges: "Humility vs Ego", strengths: "Magnetic creativity" },
      "Virgo": { score: 75, chemistry: "Careful", challenges: "Intuition vs Analysis", strengths: "Detailed and compassionate care" },
      "Libra": { score: 80, chemistry: "Romantic", challenges: "Intuition vs Decision", strengths: "Harmonious and artistic love" },
      "Scorpio": { score: 95, chemistry: "Mystical", challenges: "Spiritual intensities", strengths: "Transcendental soul union" },
      "Sagittarius": { score: 70, chemistry: "Spiritual", challenges: "Spirituality vs Adventure", strengths: "Expanded spiritual journey" },
      "Capricorn": { score: 80, chemistry: "Compassionate", challenges: "Spirituality vs Practicality", strengths: "Purposeful and stable success" },
      "Aquarius": { score: 70, chemistry: "Visionary", challenges: "Intuition vs Logic", strengths: "Humanitarian and innovative visions" },
      "Pisces": { score: 85, chemistry: "Oceanic", challenges: "Doubled sensitivities", strengths: "Infinite and transcendental love" }
    }
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
        const compatibility = compatibilityDatabase[userSign]?.[partnerSign];
        setCompatibilityData(compatibility);
        setIsRevealing(false);
      }, 1000);
    }
  };

  const getCompatibilityLevel = (score: number) => {
    if (score >= 90) return { level: "Soul Mates", icon: Crown, color: "text-primary" };
    if (score >= 80) return { level: "Excellent", icon: Star, color: "text-primary" };
    if (score >= 70) return { level: "Great", icon: Heart, color: "text-secondary" };
    if (score >= 60) return { level: "Good", icon: Users, color: "text-secondary" };
    if (score >= 50) return { level: "Moderate", icon: Zap, color: "text-primary" };
    return { level: "Challenging", icon: Sparkles, color: "text-muted-foreground" };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-cinzel font-bold bg-gradient-primary bg-clip-text text-transparent">
          Marriage Compatibility
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover the cosmic harmony between you and your partner. The stars reveal the deepest secrets of love and compatibility.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* User Sign Card */}
        <Card className="p-6 luxury-card">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-cinzel font-semibold">Your Sign</h3>
            {userSign ? (
              <div className="space-y-2">
                <Badge variant="outline" className="text-lg px-4 py-2 mystic-border">
                  {userSign}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Based on your birth date
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Birth date not provided
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
            <h3 className="text-xl font-cinzel font-semibold">Partner's Sign</h3>
            <div className="space-y-2">
              <Select value={partnerSign} onValueChange={setPartnerSign}>
                <SelectTrigger className="max-w-[200px] mx-auto mystic-border">
                  <SelectValue placeholder="Select sign" />
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
            {isRevealing ? "Consulting the stars..." : "Reveal Cosmic Compatibility"}
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
                {compatibilityData.score}% Compatible
              </div>
            </div>

            {/* Compatibility Details */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <Sparkles className="w-10 h-10 mx-auto text-primary" />
                <h4 className="font-semibold text-xl font-cinzel">Chemistry</h4>
                <p className="text-muted-foreground">{compatibilityData.chemistry}</p>
              </div>
              
              <div className="text-center space-y-3">
                <Zap className="w-10 h-10 mx-auto text-destructive" />
                <h4 className="font-semibold text-xl font-cinzel">Challenges</h4>
                <p className="text-muted-foreground">{compatibilityData.challenges}</p>
              </div>
              
              <div className="text-center space-y-3">
                <Star className="w-10 h-10 mx-auto text-secondary" />
                <h4 className="font-semibold text-xl font-cinzel">Strengths</h4>
                <p className="text-muted-foreground">{compatibilityData.strengths}</p>
              </div>
            </div>

            {/* Cosmic Advice */}
            <div className="luxury-card p-8 text-center mystic-border">
              <h4 className="text-2xl font-cinzel font-bold mb-4 ethereal-text">
                COSMIC ADVICE
              </h4>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {compatibilityData.score >= 80 ? 
                  "The stars shine favorably upon your union. This relationship has the potential for deep happiness and mutual growth. Nurture the unique gifts you bring to each other." :
                  compatibilityData.score >= 60 ?
                  "Your connection has solid foundations with room for growth. Focus on understanding and appreciating your differences as they can be your greatest strengths." :
                  "Every relationship requires work and understanding. Use your challenges as opportunities to grow together and create a unique bond that transcends the stars."
                }
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};