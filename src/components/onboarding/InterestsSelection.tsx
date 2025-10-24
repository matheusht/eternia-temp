import { DollarSign, Briefcase, Users, Heart, Home, TrendingUp } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface InterestsSelectionProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
}

export const InterestsSelection = ({ selectedInterests, onInterestsChange }: InterestsSelectionProps) => {
  const { t } = useTranslation();
  
  const interestOptions = [
    {
      id: "prosperity",
      label: t('onboarding.goals.prosperity'),
      description: t('onboarding.goals.prosperityDesc'),
      icon: DollarSign,
      color: "text-green-400",
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      id: "guidance",
      label: t('onboarding.goals.guidance'),
      description: t('onboarding.goals.guidanceDesc'),
      icon: TrendingUp,
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      id: "spirituality",
      label: t('onboarding.goals.spirituality'),
      description: t('onboarding.goals.spiritualityDesc'),
      icon: Users,
      color: "text-yellow-400",
      gradient: "from-yellow-500/20 to-orange-500/20"
    },
    {
      id: "love",
      label: t('onboarding.goals.love'),
      description: t('onboarding.goals.loveDesc'),
      icon: Heart,
      color: "text-pink-400",
      gradient: "from-pink-500/20 to-red-500/20"
    },
    {
      id: "healing",
      label: t('onboarding.goals.healing'),
      description: t('onboarding.goals.healingDesc'),
      icon: Home,
      color: "text-purple-400",
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    {
      id: "selfKnowledge",
      label: t('onboarding.goals.selfKnowledge'),
      description: t('onboarding.goals.selfKnowledgeDesc'),
      icon: Briefcase,
      color: "text-indigo-400",
      gradient: "from-indigo-500/20 to-purple-500/20"
    }
  ];

  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      onInterestsChange(selectedInterests.filter(id => id !== interestId));
    } else {
      onInterestsChange([...selectedInterests, interestId]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-playfair ethereal-text">{t('onboarding.goalsTitle')}</h2>
        <p className="text-muted-foreground">
          {t('onboarding.goalsDescription')}
        </p>
      </div>

      <div className="grid gap-4">
        {interestOptions.map((option) => {
          const IconComponent = option.icon;
          const isSelected = selectedInterests.includes(option.id);
          
          return (
            <div
              key={option.id}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-mystic'
                  : 'border-border hover:border-primary/50 mystic-border hover:shadow-md'
              }`}
              onClick={() => toggleInterest(option.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${option.gradient} flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 ${option.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {option.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  isSelected
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                }`}>
                  {isSelected && (
                    <div className="w-3 h-3 bg-primary-foreground rounded-sm" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedInterests.length > 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3 border mystic-border">
          <p className="text-sm text-center text-muted-foreground">
            <span className="text-primary font-medium">{selectedInterests.length}</span> {t('onboarding.interestsSelected')}
          </p>
        </div>
      )}
    </div>
  );
};