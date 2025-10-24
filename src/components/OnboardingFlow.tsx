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
import { useTranslation } from "@/hooks/useTranslation";


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
  const { t } = useTranslation();
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
    { id: "selfKnowledge", label: t('onboarding.goals.selfKnowledge'), icon: Brain, description: t('onboarding.goals.selfKnowledgeDesc') },
    { id: "love", label: t('onboarding.goals.love'), icon: HeartHandshake, description: t('onboarding.goals.loveDesc') },
    { id: "prosperity", label: t('onboarding.goals.prosperity'), icon: Sparkles, description: t('onboarding.goals.prosperityDesc') },
    { id: "spirituality", label: t('onboarding.goals.spirituality'), icon: Target, description: t('onboarding.goals.spiritualityDesc') },
    { id: "healing", label: t('onboarding.goals.healing'), icon: Heart, description: t('onboarding.goals.healingDesc') },
    { id: "guidance", label: t('onboarding.goals.guidance'), icon: Star, description: t('onboarding.goals.guidanceDesc') },
    { id: "protection", label: t('onboarding.goals.protection'), icon: Search, description: t('onboarding.goals.protectionDesc') },
    { id: "intuition", label: t('onboarding.goals.intuition'), icon: DollarSign, description: t('onboarding.goals.intuitionDesc') }
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
                <span>{t('onboarding.progress')}: {Math.round(getProgressPercentage())}</span>
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
              <CardTitle className="text-xl font-playfair ethereal-text">{t('onboarding.goalsTitle')}</CardTitle>
              <p className="text-sm text-muted-foreground">{t('onboarding.goalsDescription')}</p>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <div className="max-h-80 overflow-y-auto space-y-2">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-300 border ${data.goals.includes(goal.id)
                      ? 'border-primary bg-primary/10 shadow-mystic'
                      : 'border-border hover:border-primary/50 mystic-border'
                      }`}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${data.goals.includes(goal.id)
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
                {t('onboarding.next')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Birth Date with Zodiac Animation */}
        {step === 2 && (
          <Card className="mystic-border cosmic-glow">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-playfair ethereal-text">{t('onboarding.birthDateTitle')}</CardTitle>
              <p className="text-muted-foreground">{t('onboarding.birthDateDescription')}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {t('onboarding.birthDateLabel')}
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
                {t('onboarding.next')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Birth Time with Astrological Chart */}
        {step === 3 && (
          <Card className="mystic-border cosmic-glow">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-playfair ethereal-text">{t('onboarding.birthTimeTitle')}</CardTitle>
              <p className="text-muted-foreground">{t('onboarding.birthTimeDescription')}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="birthTime" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {t('onboarding.birthTimeLabel')}
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
                {t('onboarding.continue')}
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
                {t('onboarding.understand')}
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
                {t('onboarding.continue')}
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
                {t('onboarding.continue')}
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
                {t('onboarding.continue')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 8: Final Details and Summary */}
        {step === 8 && (
          <Card className="mystic-border cosmic-glow">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-playfair ethereal-text">{t('onboarding.finalTitle')}</CardTitle>
              <p className="text-muted-foreground">{t('onboarding.finalDescription')}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  {t('onboarding.displayNameLabel')}
                </Label>
                <Input
                  id="displayName"
                  placeholder={t('onboarding.displayNamePlaceholder')}
                  value={data.displayName}
                  onChange={(e) => setData({ ...data, displayName: e.target.value })}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthLocation" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {t('onboarding.birthLocationLabel')}
                </Label>
                <Input
                  id="birthLocation"
                  placeholder={t('onboarding.birthLocationPlaceholder')}
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
                {t('onboarding.continue')}
              </Button>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};