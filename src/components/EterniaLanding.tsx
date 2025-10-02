import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Star, Moon, Sun, Crown, Eye } from "lucide-react";
import { DailyHoroscope } from "./DailyHoroscope";

interface EterniaLandingProps {
  onExplore: () => void;
  showHoroscope?: boolean;
}

export const EterniaLanding = ({ onExplore, showHoroscope = true }: EterniaLandingProps) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const mysticalFeatures = [
    {
      icon: Star,
      title: "Premium Astral Map",
      description: "Unveil the cosmic secrets of your personality",
      accent: "text-secondary"
    },
    {
      icon: Eye,
      title: "Celestial Oracle",
      description: "Consult the divine oracle powered by ancestral wisdom",
      accent: "text-primary"
    },
    {
      icon: Moon,
      title: "Lunar Rituals",
      description: "Synchronize with lunar cycles for manifestation",
      accent: "text-secondary"
    },
    {
      icon: Sparkles,
      title: "Mystical Tarot",
      description: "Sacred cards reveal your soul's path",
      accent: "text-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-mystic relative overflow-hidden">
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-16 w-1 h-1 bg-secondary rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-primary/50 rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-secondary rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-32 right-32 w-2 h-2 bg-primary/30 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Crown className="w-8 h-8 text-primary mr-3" />
            <h1 className="brand-title text-6xl md:text-7xl font-bold ethereal-text">
              Eternia
            </h1>
            <Crown className="w-8 h-8 text-primary ml-3" />
          </div>
          <p className="text-foreground/80 text-xl font-inter max-w-2xl mx-auto leading-relaxed">
            Mystical Portal where Cosmos and Luxury meet in perfect celestial harmony
          </p>
        </header>

        {/* Main CTA */}
        <div className="text-center mb-20">
          <Button
            onClick={onExplore}
            size="lg"
            className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-12 py-6 text-lg rounded-xl gold-glow hover:shadow-ethereal transition-all duration-500 transform hover:scale-105"
          >
            <span className="relative z-10 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Explore Now
              <Sun className="w-5 h-5 ml-2 group-hover:rotate-180 transition-transform duration-700" />
            </span>
            <div className="absolute inset-0 bg-gradient-aura opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 max-w-7xl mx-auto w-full">
          {mysticalFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <Card
                key={index}
                className={`luxury-card w-full h-full p-6 lg:p-8 text-center cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                  isHovered ? 'cosmic-glow' : ''
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="mb-4 lg:mb-6 flex justify-center">
                  <div className={`p-3 lg:p-4 rounded-full bg-card/50 ${isHovered ? 'animate-pulse' : ''}`}>
                    <IconComponent className={`w-6 h-6 lg:w-8 lg:h-8 ${feature.accent} transition-colors duration-300`} />
                  </div>
                </div>
                <h3 className="font-cinzel text-lg lg:text-xl font-semibold text-foreground mb-3 lg:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm lg:text-base text-foreground/70 font-inter leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Celestial Horoscope Section */}
        {showHoroscope && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="font-cinzel text-3xl font-bold ethereal-text mb-4 flex items-center justify-center">
                <Sun className="w-6 h-6 text-primary mr-3" />
                Celestial Horoscope
                <Moon className="w-6 h-6 text-secondary ml-3" />
              </h2>
              <p className="text-foreground/80 text-lg font-inter max-w-3xl mx-auto leading-relaxed">
                Unlock the mysteries of the cosmos through personalized astrological insights. 
                Your birth chart holds the keys to understanding your destiny, relationships, and spiritual path.
              </p>
            </div>
            <DailyHoroscope />
          </div>
        )}

        {/* Mystical Quote */}
        <div className="text-center">
          <blockquote className="luxury-card p-8 max-w-4xl mx-auto">
            <p className="font-cinzel text-2xl text-foreground/90 italic leading-relaxed mb-4">
              "The stars whisper ancestral secrets to those who know how to listen..."
            </p>
            <div className="flex items-center justify-center">
              <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-24"></div>
              <Star className="w-4 h-4 text-primary mx-4" />
              <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-24"></div>
            </div>
          </blockquote>
        </div>
      </div>

      {/* Bottom Cosmic Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/10 to-transparent"></div>
    </div>
  );
};