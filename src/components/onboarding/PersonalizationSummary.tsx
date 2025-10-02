import { CheckCircle, Sparkles, User, Calendar, Clock, MapPin, Target, Heart, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ZodiacIcon } from "@/components/ZodiacIcon";
import { getZodiacSign } from "@/utils/horoscope";

// Helper function to format date safely without timezone issues
const formatDateSafely = (dateString: string): string => {
  const parts = dateString.split('-');
  const day = parts[2];
  const month = parts[1];
  const year = parts[0];
  return `${day}/${month}/${year}`;
};

interface PersonalizationSummaryProps {
  userData: {
    displayName: string;
    birthDate: string;
    birthTime: string;
    birthLocation: string;
    goals: string[];
    gender: string;
    maritalStatus: string;
    interests: string[];
  };
}

export const PersonalizationSummary = ({ userData }: PersonalizationSummaryProps) => {
  const zodiacSign = userData.birthDate ? getZodiacSign(userData.birthDate) : "";

  const formatGoals = (goals: string[]) => {
    const goalLabels: Record<string, string> = {
      self_knowledge: "Self-knowledge",
      love: "Love & Relationships",
      prosperity: "Prosperity & Growth", 
      spirituality: "Spirituality",
      insights: "Daily Insights",
      future: "Future Guidance",
      soulmate: "Find Soulmate",
      compatibility: "Check Compatibility",
      guidance: "Spiritual Guidance"
    };
    return goals.map(goal => goalLabels[goal] || goal).join(", ");
  };

  const formatStatus = (status: string) => {
    const statusLabels: Record<string, string> = {
      single: "Single",
      relationship: "In a relationship",
      living_together: "Living together",
      engaged: "Engaged",
      married: "Married",
      separated: "Separated",
      divorced: "Divorced",
      widowed: "Widowed",
      complicated: "It's complicated"
    };
    return statusLabels[status] || status;
  };

  const formatInterests = (interests: string[]) => {
    const interestLabels: Record<string, string> = {
      money: "Money",
      business: "Business",
      friends: "Friends", 
      love: "Love",
      family: "Family",
      career: "Career"
    };
    return interests.map(interest => interestLabels[interest] || interest).join(", ");
  };

  const personalizedFeatures = [
    {
      icon: Sparkles,
      title: "Personalized Horoscope",
      description: `Receive specific predictions for ${zodiacSign} based on your life goals`
    },
    {
      icon: Target,
      title: "Focused Guidance",
      description: "Insights directed to your areas of interest and personal goals"
    },
    {
      icon: Calendar,
      title: "Astrological Planning", 
      description: "Ideal timing suggestions for your important decisions"
    },
    {
      icon: Heart,
      title: "Personalized Compatibility",
      description: "Relationship analysis based on your complete astrological profile"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-cosmic p-3 shadow-mystic">
          <CheckCircle className="w-full h-full text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-playfair ethereal-text">
          Your Astrological Profile is Ready!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Based on your information, we've personalized the entire experience for you, {userData.displayName}.
        </p>
      </div>

      {/* User Summary Card */}
      <Card className="mystic-border cosmic-glow">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-cosmic flex items-center justify-center">
              {zodiacSign ? <ZodiacIcon sign={zodiacSign} size="md" /> : <div className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-playfair text-primary">{userData.displayName}</h3>
              <p className="text-sm text-muted-foreground">
                {zodiacSign} • {userData.gender === 'female' ? 'Female' : 'Male'}
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-sm">
            <div className="flex items-start space-x-3">
              <Calendar className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <span className="text-muted-foreground">Birth:</span>
                <span className="ml-2">{formatDateSafely(userData.birthDate)} at {userData.birthTime}</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <span className="text-muted-foreground">Location:</span>
                <span className="ml-2">{userData.birthLocation}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <span className="text-muted-foreground">Marital Status:</span>
                <span className="ml-2">{formatStatus(userData.maritalStatus)}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Target className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <span className="text-muted-foreground">Goals:</span>
                <span className="ml-2">{formatGoals(userData.goals)}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Users className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <span className="text-muted-foreground">Interests:</span>
                <span className="ml-2">{formatInterests(userData.interests)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-playfair text-center text-primary">
          What you will receive:
        </h3>
        <div className="grid gap-3">
          {personalizedFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={`feature-${index}-${feature.title}`}
                className="flex items-start space-x-3 p-3 rounded-lg bg-card/30 border mystic-border"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <IconComponent className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border mystic-border text-center">
        <p className="text-sm text-muted-foreground">
          ✨ <span className="text-primary font-medium">All set!</span> Your personalized spiritual journey is starting now.
        </p>
      </div>
    </div>
  );
};