import { User, UserCheck } from "lucide-react";

interface GenderSelectionProps {
  selectedGender: string;
  onGenderSelect: (gender: string) => void;
}

export const GenderSelection = ({ selectedGender, onGenderSelect }: GenderSelectionProps) => {
  const genderOptions = [
    {
      id: "female",
      label: "Female",
      icon: User,
      gradient: "from-pink-500/20 to-purple-500/20",
      color: "text-pink-400"
    },
    {
      id: "male", 
      label: "Male",
      icon: UserCheck,
      gradient: "from-blue-500/20 to-cyan-500/20",
      color: "text-blue-400"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-playfair ethereal-text">What is your gender?</h2>
        <p className="text-muted-foreground">
          This helps us better personalize your astrological predictions
        </p>
      </div>

      <div className="grid gap-4">
        {genderOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <div
              key={option.id}
              className={`p-6 rounded-lg cursor-pointer transition-all duration-300 border ${
                selectedGender === option.id
                  ? 'border-primary bg-primary/10 shadow-mystic scale-105'
                  : 'border-border hover:border-primary/50 mystic-border hover:shadow-md'
              }`}
              onClick={() => onGenderSelect(option.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${option.gradient} flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 ${option.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-medium ${
                    selectedGender === option.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {option.label}
                  </h3>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedGender === option.id
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                }`}>
                  {selectedGender === option.id && (
                    <div className="w-3 h-3 bg-primary-foreground rounded-full" />
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