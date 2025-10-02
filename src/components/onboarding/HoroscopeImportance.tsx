import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Star, Moon, Sun } from "lucide-react";

export const HoroscopeImportance = () => {
  const benefits = [
    {
      icon: Sun,
      title: "Deep Self-Knowledge",
      description: "Discover your unique characteristics, potentials and challenges through personalized astrological analysis."
    },
    {
      icon: Moon,
      title: "Daily Guidance",
      description: "Receive personalized insights about the best time to make important decisions."
    },
    {
      icon: Star,
      title: "Relationships",
      description: "Better understand your compatibility and how to relate in a more harmonious way."
    },
    {
      icon: Sparkles,
      title: "Future Planning",
      description: "Use astrological energies in your favor to plan projects and life goals."
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-cosmic p-4 shadow-mystic">
          <Sparkles className="w-full h-full text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-playfair ethereal-text">
          Why is Horoscope Important?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          For millennia, humanity has sought to understand the influence of the stars on our lives. 
          Discover how astrology can guide your personal journey.
        </p>
      </div>

      <div className="grid gap-4">
        {benefits.map((benefit, index) => {
          const IconComponent = benefit.icon;
          return (
            <Card 
              key={index} 
              className="mystic-border bg-card/50 backdrop-blur-sm hover:shadow-mystic transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="flex items-start space-x-4 p-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border mystic-border">
        <p className="text-sm text-center text-muted-foreground">
          <span className="text-primary font-medium">Tip:</span> The more accurate your birth information, 
          the more precise your personalized astrological insights will be.
        </p>
      </div>
    </div>
  );
};