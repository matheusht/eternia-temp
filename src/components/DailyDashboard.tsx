import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles, Heart, BookOpen, Star, Zap, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useUserData } from "@/hooks/useUserData";
import { getPersonalizedHoroscope } from "@/utils/horoscope";
import { getDailyPractice } from "@/utils/spiritualPractices";
import { ZodiacIcon } from "@/components/ZodiacIcon";
import { getMoonPhase, getDailyPlanet, getLuckyNumbers, getCompatibleSigns } from "@/utils/astrologyElements";


import cosmicHeader from "@/assets/cosmic-header.jpg";

interface DailyDashboardProps {
  profile: {
    id: string;
    user_id: string;
    display_name: string | null;
    birth_date: string;
    birth_time: string;
    birth_location: string;
    goal?: string | null; // Legacy single goal support
    goals?: string[] | null; // New multiple goals support
    gender?: string | null;
    marital_status?: string | null;
    interests?: string[] | null;
    total_points: number;
    current_level: string;
    created_at: string;
    updated_at: string;
  };
}

export const DailyDashboard = ({ profile }: DailyDashboardProps) => {
  const { addActivity } = useUserData();
  const [spiritualAlert, setSpiritualAlert] = useState("");
  const [isPracticeCompleted, setIsPracticeCompleted] = useState(false);
  
  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const horoscopeData = getPersonalizedHoroscope(
    profile.birth_date,
    profile.birth_time,
    profile.birth_location,
    profile.goals?.[0] || profile.goal || 'autoconhecimento'
  );

  const moonPhase = getMoonPhase();
  const dailyPlanet = getDailyPlanet();
  const luckyNumbers = getLuckyNumbers(profile.birth_date);
  const compatibleSigns = getCompatibleSigns(horoscopeData.sign);

  // Format birth date safely without timezone issues
  const birthDate = (() => {
    const parts = profile.birth_date.split('-');
    const day = parts[2];
    const month = parts[1];
    const year = parts[0];
    return `${day}/${month}/${year}`;
  })();

  // Generate spiritual alert only once per day and check practice status
  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('spiritualAlertDate');
    const storedAlert = localStorage.getItem('spiritualAlert');
    const practiceCompleted = localStorage.getItem(`practiceCompleted_${today}`);

    if (storedDate !== today || !storedAlert) {
      const alerts = [
        "🌟 Today is a good day to forgive and release old energies",
        "✨ Practice gratitude: list 3 things you are grateful for",
        "🔮 Your intuition is amplified - trust your hunches",
        "💜 It's time to connect with your inner child"
      ];
      const newAlert = alerts[Math.floor(Math.random() * alerts.length)];
      setSpiritualAlert(newAlert);
      localStorage.setItem('spiritualAlert', newAlert);
      localStorage.setItem('spiritualAlertDate', today);
    } else {
      setSpiritualAlert(storedAlert);
    }

    setIsPracticeCompleted(practiceCompleted === 'true');
  }, []);

  const dailyPractice = getDailyPractice(profile.current_level, profile.goals?.[0] || profile.goal || 'autoconhecimento', new Date());

  const handlePracticeComplete = async () => {
    if (isPracticeCompleted) return;
    
    setIsPracticeCompleted(true);
    const today = new Date().toDateString();
    localStorage.setItem(`practiceCompleted_${today}`, 'true');
    await addActivity('ritual_completado');
  };

  return (
    <div className="min-h-screen bg-gradient-mystic">
      <div className="p-6 space-y-6 pb-20">

      
        {/* User Level & Energy */}
        <Card className="mystic-border cosmic-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-cosmic flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">{profile.current_level} Level</h3>
                  <p className="text-sm text-muted-foreground">{profile.total_points} points</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                <Zap className="w-3 h-3 mr-1" />
                Active Today
              </Badge>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-cosmic transition-all duration-500"
                  style={{ 
                    width: `${Math.min(
                      100, 
                      ((profile.total_points % getPointsForNextLevel(profile.current_level)) / getPointsForNextLevel(profile.current_level)) * 100
                    )}%` 
                  }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {getPointsForNextLevel(profile.current_level) - (profile.total_points % getPointsForNextLevel(profile.current_level))} points to next level
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Horoscope - Redesigned */}
        <Card className="mystic-border cosmic-glow relative overflow-hidden">
          {/* Mystical background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-gradient-cosmic"></div>
          </div>
          
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ZodiacIcon sign={horoscopeData.sign} size="lg" />
                <div>
                  <CardTitle className="text-xl ethereal-text">{horoscopeData.sign}</CardTitle>
                  <p className="text-sm text-muted-foreground">Born on {birthDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Today</p>
                <p className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            {/* Cosmic influences */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{moonPhase.emoji}</span>
                  <p className="text-xs text-muted-foreground">{moonPhase.phase}</p>
                </div>
                <p className="text-xs text-primary font-medium">{moonPhase.description}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{dailyPlanet.emoji}</span>
                  <p className="text-xs text-muted-foreground">{dailyPlanet.planet}</p>
                </div>
                <p className="text-xs text-accent font-medium">{dailyPlanet.influence}</p>
              </div>
            </div>

            {/* Main horoscope message */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-card via-muted/50 to-card border border-primary/10">
              <h4 className="text-sm font-medium text-primary mb-2">Daily Forecast</h4>
              <p className="text-foreground leading-relaxed text-sm">{horoscopeData.personalizedMessage}</p>
            </div>

            {/* Traditional horoscope elements */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Lucky Element</p>
                <p className="font-medium text-primary text-sm">{horoscopeData.luckyElement}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
                <p className="text-xs text-muted-foreground mb-1">Energy Color</p>
                <p className="font-medium text-accent text-sm">{horoscopeData.energyColor}</p>
              </div>
            </div>

            {/* Lucky numbers and compatibility */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-secondary/20 to-transparent border border-secondary/20">
                <div>
                  <p className="text-xs text-muted-foreground">Lucky Numbers</p>
                  <div className="flex gap-2 mt-1">
                    {luckyNumbers.map((num, index) => (
                      <span key={index} className="w-6 h-6 bg-primary/20 text-primary text-xs font-bold rounded-full flex items-center justify-center">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Compatibility</p>
                  <div className="flex gap-1 mt-1">
                    {compatibleSigns.slice(0, 2).map((sign, index) => (
                      <ZodiacIcon key={index} sign={sign} size="sm" className="opacity-70" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Spiritual focus */}
            <div className="text-center p-4 rounded-xl bg-gradient-cosmic/10 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Spiritual Focus</p>
              <p className="font-medium text-primary ethereal-text">{horoscopeData.spiritualFocus}</p>
            </div>
          </CardContent>
        </Card>

        {/* Spiritual Alert */}
        <Card className="mystic-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-accent" />
              Spiritual Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-accent font-medium">{spiritualAlert}</p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Ritual */}
        <Card className="mystic-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-primary" />
              {dailyPractice.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">{dailyPractice.type}</Badge>
              <span>{dailyPractice.duration}</span>
            </div>
            <p className="text-foreground leading-relaxed">{dailyPractice.description}</p>
            <Button 
              variant={isPracticeCompleted ? "cosmic" : "ethereal"} 
              size="sm" 
              onClick={handlePracticeComplete}
              disabled={isPracticeCompleted}
              className={`w-full transition-all duration-500 ${
                isPracticeCompleted 
                  ? 'gold-glow animate-pulse bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-ethereal border-none' 
                  : 'hover:scale-105'
              }`}
            >
              {isPracticeCompleted ? (
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4 animate-pulse" />
                  Practice Completed
                  <Star className="w-4 h-4 animate-pulse" />
                </span>
              ) : (
                "Mark as Completed"
              )}
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

const getPointsForNextLevel = (currentLevel: string): number => {
  switch (currentLevel) {
    case 'Apprentice': return 11;
    case 'Initiate': return 41;
    case 'Sage': return 101;
    case 'Master': return 1000;
    default: return 11;
  }
};