import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { getPersonalizedHoroscope } from "@/utils/horoscope";
import { AppLayout } from "@/components/AppLayout";

const AstralMap = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserData();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  if (!profile) {
    return (
      <div className="min-h-screen cosmic-bg p-4 pb-20">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="text-primary font-medium">Loading astral map...</div>
        </div>
      </div>
    );
  }

  // Goals mapping to display labels
  const goalLabels: Record<string, string> = {
    "autoconhecimento": "Self-knowledge",
    "amor": "Love & Relationships",
    "insights": "Daily Insights",
    "futuro": "Future Guidance",
    "alma_gemea": "Soulmate Connection",
    "compatibilidade": "Compatibility",
    "orientacao": "Spiritual Guidance",
    "prosperidade": "Prosperity & Growth"
  };

  const horoscopeData = getPersonalizedHoroscope(
    profile.birth_date,
    profile.birth_time,
    profile.birth_location,
    profile.goal || (profile.goals && profile.goals.length > 0 ? profile.goals[0] : "autoconhecimento")
  );

  const astralData = {
    sun: horoscopeData.sign,
    moon: "Pisces",
    ascendant: "Scorpio", 
    venus: "Virgo",
    mars: "Aries",
    mercury: "Cancer"
  };

  return (
    <AppLayout>
      <div className="min-h-screen cosmic-bg p-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-3xl font-playfair ethereal-text">Your Astral Map</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Dados Pessoais */}
            <Card className="mystic-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Your Astrological Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Birth Date</p>
                  <p className="font-medium">{profile.birth_date.split('-').reverse().join('/')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{profile.birth_time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{profile.birth_location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Spiritual Goals</p>
                  <div className="space-y-1">
                    {profile.goals && profile.goals.length > 0 ? (
                      profile.goals.map((goalId: string, index: number) => (
                        <p key={goalId} className="text-sm font-medium">
                          • {goalLabels[goalId] || goalId}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm font-medium capitalize">{profile.goal || "Self-knowledge"}</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lucky Element</p>
                  <p className="font-medium">{horoscopeData.luckyElement}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Energy Color</p>
                  <p className="font-medium">{horoscopeData.energyColor}</p>
                </div>
              </CardContent>
            </Card>

            {/* Mapa Astral Visual */}
            <Card className="mystic-border cosmic-glow">
              <CardHeader>
                <CardTitle className="text-center">Astral Mandala</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-64 h-64 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30"></div>
                  <div className="absolute inset-4 rounded-full border border-primary/20"></div>
                  <div className="absolute inset-8 rounded-full border border-primary/10"></div>
                  
                  {/* Sun */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
                    <Sun className="w-6 h-6 text-yellow-400 mx-auto" />
                    <p className="text-xs mt-1">Sun</p>
                  </div>
                  
                  {/* Moon */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                    <Moon className="w-6 h-6 text-blue-300 mx-auto" />
                    <p className="text-xs mt-1">Moon</p>
                  </div>
                  
                  {/* Other planets */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-center">
                    <Star className="w-5 h-5 text-red-400 mx-auto" />
                    <p className="text-xs mt-1">Mars</p>
                  </div>
                  
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-center">
                    <Star className="w-5 h-5 text-green-400 mx-auto" />
                    <p className="text-xs mt-1">Venus</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Signos Principais */}
            <Card className="mystic-border">
              <CardHeader>
                <CardTitle>Your Main Signs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                  <span className="font-medium">Sun</span>
                  <span className="text-primary">{astralData.sun}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                  <span className="font-medium">Moon</span>
                  <span className="text-primary">{astralData.moon}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                  <span className="font-medium">Ascendant</span>
                  <span className="text-primary">{astralData.ascendant}</span>
                </div>
              </CardContent>
            </Card>

            {/* Planetas */}
            <Card className="mystic-border">
              <CardHeader>
                <CardTitle>Planetary Positions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Venus (Love)</span>
                  <span className="text-sm text-primary">{astralData.venus}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mars (Energy)</span>
                  <span className="text-sm text-primary">{astralData.mars}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mercury (Communication)</span>
                  <span className="text-sm text-primary">{astralData.mercury}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interpretação */}
          <Card className="mystic-border mt-6">
            <CardHeader>
              <CardTitle>Your Map Interpretation</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                {horoscopeData.personalizedMessage}
              </p>
              <p className="text-muted-foreground mt-4">
                <strong>Spiritual Focus:</strong> {horoscopeData.spiritualFocus}
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Lucky Element:</strong> {horoscopeData.luckyElement} can enhance 
                your energy during rituals and meditations.
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Energy Color:</strong> Use {horoscopeData.energyColor} to harmonize 
                your spiritual practices and strengthen your connection with the universe.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AstralMap;