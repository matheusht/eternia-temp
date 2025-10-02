import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Clock, Sparkles, Heart, DollarSign, Activity, User, Target, Star, Brain, Search, HeartHandshake, CheckCircle } from "lucide-react";
import spiritualIcon from "/assets/eternia-onboarding-logo-light.png";
import { ZodiacWheel } from "./onboarding/ZodiacWheel";
import { AstrologicalChart } from "./onboarding/AstrologicalChart";
import { HoroscopeImportance } from "./onboarding/HoroscopeImportance";
import { GenderSelection } from "./onboarding/GenderSelection";
import { MaritalStatus } from "./onboarding/MaritalStatus";
import { InterestsSelection } from "./onboarding/InterestsSelection";
import { PersonalizationSummary } from "./onboarding/PersonalizationSummary";
import { EterniaLanding } from "./EterniaLanding";


interface OnboardingData {
  displayName: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  goals: string[];
  gender: string;
  maritalStatus: string;
  interests: string[];
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    displayName: "",
    birthDate: "",
    birthTime: "",
    birthLocation: "",
    goals: [],
    gender: "",
    maritalStatus: "",
    interests: []
  });

  const goals = [
    { id: "self_knowledge", label: "Better understand myself and others", icon: Brain, description: "Discover unique personality and characteristics" },
    { id: "love", label: "Improve relationship with partner", icon: HeartHandshake, description: "Strengthen existing loving bonds" },
    { id: "insights", label: "Receive daily insights and tips", icon: Sparkles, description: "Personalized guidance for daily life" },
    { id: "future", label: "Prepare for the future", icon: Target, description: "Planning and preparation for challenges" },
    { id: "soulmate", label: "Find my soulmate", icon: Heart, description: "Discover true love of life" },
    { id: "compatibility", label: "Check compatibility", icon: Star, description: "Analyze affinity with other people" },
    { id: "guidance", label: "Get guidance and advice", icon: Search, description: "Spiritual guidance for important decisions" },
    { id: "prosperity", label: "Something else (custom)", icon: DollarSign, description: "Unique specific goals" }
  ];

  const handleNext = () => {
    if (step < 8) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 0:
        return true; // EterniaLanding step - always valid
      case 1:
        return data.goals.length > 0;
      case 2:
        return data.birthDate !== "";
      case 3:
        return data.birthTime !== "";
      case 4:
        return true; // Information step
      case 5:
        return data.gender !== "";
      case 6:
        return data.maritalStatus !== "";
      case 7:
        return data.interests.length > 0;
      case 8:
        return data.displayName !== "" && data.birthLocation !== "";
      default:
        return true;
    }
  };

  const toggleGoal = (goalId: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId) 
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const getProgressPercentage = () => {
    if (step === 0) return 0;
    return ((step - 1) / 8) * 100;
  };

  // Render landing screen outside the narrow container
  if (step === 0) {
    return <EterniaLanding onExplore={handleNext} showHoroscope={true} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-mystic">
      <div className="w-full max-w-sm">
        {step > 0 && (
          <>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress: {Math.round(getProgressPercentage())}</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="w-full bg-background/20 rounded-full h-2">
                <div 
                  className="bg-gradient-cosmic h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          </>
        )}

        {/* Step 1: Goals */}
        {step === 1 && (
          <Card className="mystic-border cosmic-glow">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 mx-auto mb-3">
                <img src={spiritualIcon} alt="Eternia Logo" className="w-12 h-12 object-contain" />
              </div>
              <CardTitle className="text-xl font-playfair ethereal-text">What are your goals?</CardTitle>
              <p className="text-sm text-muted-foreground">Choose what you want to achieve</p>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <div className="max-h-80 overflow-y-auto space-y-2">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-300 border ${
                      data.goals.includes(goal.id) 
                        ? 'border-primary bg-primary/10 shadow-mystic' 
                        : 'border-border hover:border-primary/50 mystic-border'
                    }`}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        data.goals.includes(goal.id) 
                          ? 'border-primary bg-primary' 
                          : 'border-muted-foreground'
                      }`}>
                        {data.goals.includes(goal.id) && (
                          <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />
                        )}
                      </div>
                      <goal.icon className={`w-4 h-4 ${data.goals.includes(goal.id) ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${data.goals.includes(goal.id) ? 'text-primary' : 'text-foreground'}`}>
                          {goal.label}
                        </h3>
                        <p className="text-xs text-muted-foreground">{goal.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleNext} 
                disabled={!isStepValid()}
                variant="cosmic" 
                className="w-full mt-4"
              >
                Next
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Birth Date with Zodiac Animation */}
        {step === 2 && (
          <Card className="mystic-border cosmic-glow">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-playfair ethereal-text">When were you born?</CardTitle>
              <p className="text-muted-foreground">Your birth date determines your zodiac sign</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Birth Date
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={data.birthDate}
                  onChange={(e) => setData({ ...data, birthDate: e.target.value })}
                  className="bg-background/50"
                  lang="en"
                />
              </div>

              {/* Zodiac Wheel Animation - Increased height to accommodate info */}
              <div className="flex justify-center py-8 min-h-[320px]">
                <ZodiacWheel selectedDate={data.birthDate} />
              </div>

              <Button 
                onClick={handleNext} 
                disabled={!isStepValid()}
                variant="cosmic" 
                className="w-full"
              >
                Next
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Birth Time with Astrological Chart */}
        {step === 3 && (
          <Card className="mystic-border cosmic-glow">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-playfair ethereal-text">What time were you born?</CardTitle>
              <p className="text-muted-foreground">The time defines your ascendant and astrological houses</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="birthTime" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Birth Time
                </Label>
                <Input
                  id="birthTime"
                  type="time"
                  value={data.birthTime}
                  onChange={(e) => setData({ ...data, birthTime: e.target.value })}
                  className="bg-background/50"
                />
              </div>

              {/* Astrological Chart Animation - Increased height to accommodate info */}
              <div className="flex justify-center py-8 min-h-[340px]">
                <AstrologicalChart selectedTime={data.birthTime} />
              </div>

              <Button 
                onClick={handleNext} 
                disabled={!isStepValid()}
                variant="cosmic" 
                className="w-full"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Horoscope Importance */}
        {step === 4 && (
          <Card className="mystic-border cosmic-glow">
            <CardContent className="p-6">
              <HoroscopeImportance />
              <Button 
                onClick={handleNext} 
                variant="cosmic" 
                className="w-full mt-6"
              >
                I understand, continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Gender Selection */}
        {step === 5 && (
          <Card className="mystic-border cosmic-glow">
            <CardContent className="p-6">
              <GenderSelection 
                selectedGender={data.gender}
                onGenderSelect={(gender) => setData({ ...data, gender })}
              />
              <Button 
                onClick={handleNext} 
                disabled={!isStepValid()}
                variant="cosmic" 
                className="w-full mt-6"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Marital Status */}
        {step === 6 && (
          <Card className="mystic-border cosmic-glow">
            <CardContent className="p-6">
              <MaritalStatus 
                selectedStatus={data.maritalStatus}
                onStatusSelect={(status) => setData({ ...data, maritalStatus: status })}
              />
              <Button 
                onClick={handleNext} 
                disabled={!isStepValid()}
                variant="cosmic" 
                className="w-full mt-6"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 7: Interests Selection */}
        {step === 7 && (
          <Card className="mystic-border cosmic-glow">
            <CardContent className="p-6">
              <InterestsSelection 
                selectedInterests={data.interests}
                onInterestsChange={(interests) => setData({ ...data, interests })}
              />
              <Button 
                onClick={handleNext} 
                disabled={!isStepValid()}
                variant="cosmic" 
                className="w-full mt-6"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 8: Final Details and Summary */}
        {step === 8 && (
          <Card className="mystic-border cosmic-glow">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-playfair ethereal-text">Final details</CardTitle>
              <p className="text-muted-foreground">What would you like to be called and where were you born?</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  What would you like to be called?
                </Label>
                <Input
                  id="displayName"
                  placeholder="Your name or nickname"
                  value={data.displayName}
                  onChange={(e) => setData({ ...data, displayName: e.target.value })}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthLocation" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Birth Location
                </Label>
                <Input
                  id="birthLocation"
                  placeholder="City, State/Country"
                  value={data.birthLocation}
                  onChange={(e) => setData({ ...data, birthLocation: e.target.value })}
                  className="bg-background/50"
                />
              </div>

              {data.displayName && data.birthLocation && (
                <PersonalizationSummary userData={data} />
              )}

              <Button 
                onClick={handleNext} 
                disabled={!isStepValid()}
                variant="cosmic" 
                className="w-full mt-6"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};