import { DollarSign, Briefcase, Users, Heart, Home, TrendingUp } from "lucide-react";

interface InterestsSelectionProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
}

export const InterestsSelection = ({ selectedInterests, onInterestsChange }: InterestsSelectionProps) => {
  const interestOptions = [
    {
      id: "money",
      label: "Money",
      description: "Personal finances and prosperity",
      icon: DollarSign,
      color: "text-green-400",
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      id: "business",
      label: "Business",
      description: "Entrepreneurship and opportunities",
      icon: TrendingUp,
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      id: "friends",
      label: "Friends",
      description: "Friendship relationships",
      icon: Users,
      color: "text-yellow-400",
      gradient: "from-yellow-500/20 to-orange-500/20"
    },
    {
      id: "love",
      label: "Love",
      description: "Love life and relationships",
      icon: Heart,
      color: "text-pink-400",
      gradient: "from-pink-500/20 to-red-500/20"
    },
    {
      id: "family",
      label: "Family",
      description: "Family relationships",
      icon: Home,
      color: "text-purple-400",
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    {
      id: "career",
      label: "Career",
      description: "Professional life and growth",
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
        <h2 className="text-2xl font-playfair ethereal-text">What are your main interests?</h2>
        <p className="text-muted-foreground">
          Choose the topics that spark your curiosity the most (multiple choices)
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
            <span className="text-primary font-medium">{selectedInterests.length}</span> interest(s) selected
          </p>
        </div>
      )}
    </div>
  );
};