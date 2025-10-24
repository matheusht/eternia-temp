import { Heart, Users, Home, Sparkles, HeartHandshake, UserX, HeartCrack, Clock, HelpCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface MaritalStatusProps {
  selectedStatus: string;
  onStatusSelect: (status: string) => void;
}

export const MaritalStatus = ({ selectedStatus, onStatusSelect }: MaritalStatusProps) => {
  const { t } = useTranslation();
  
  const statusOptions = [
    { id: "single", label: t('onboarding.maritalStatus.single'), icon: Heart, color: "text-blue-400" },
    { id: "relationship", label: t('onboarding.maritalStatus.relationship'), icon: HeartHandshake, color: "text-pink-400" },
    { id: "living_together", label: t('onboarding.maritalStatus.relationship'), icon: Home, color: "text-green-400" },
    { id: "engaged", label: t('onboarding.maritalStatus.engaged'), icon: Sparkles, color: "text-yellow-400" },
    { id: "married", label: t('onboarding.maritalStatus.married'), icon: Users, color: "text-purple-400" },
    { id: "separated", label: t('onboarding.maritalStatus.separated'), icon: UserX, color: "text-orange-400" },
    { id: "divorced", label: t('onboarding.maritalStatus.divorced'), icon: HeartCrack, color: "text-red-400" },
    { id: "widowed", label: t('onboarding.maritalStatus.widowed'), icon: Clock, color: "text-gray-400" },
    { id: "complicated", label: t('onboarding.maritalStatus.complicated'), icon: HelpCircle, color: "text-indigo-400" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-playfair ethereal-text">{t('onboarding.maritalTitle')}</h2>
        <p className="text-muted-foreground">
          {t('onboarding.maritalDescription')}
        </p>
      </div>

      <div className="grid gap-3 max-h-80 overflow-y-auto">
        {statusOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <div
              key={option.id}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border ${
                selectedStatus === option.id
                  ? 'border-primary bg-primary/10 shadow-mystic'
                  : 'border-border hover:border-primary/50 mystic-border hover:shadow-md'
              }`}
              onClick={() => onStatusSelect(option.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center">
                  <IconComponent className={`w-5 h-5 ${option.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    selectedStatus === option.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {option.label}
                  </h3>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedStatus === option.id
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                }`}>
                  {selectedStatus === option.id && (
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};