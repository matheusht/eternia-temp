import { useEffect, useState } from "react";
import { ZodiacIcon } from "@/components/ZodiacIcon";
import { getZodiacSign } from "@/utils/horoscope";

interface ZodiacWheelProps {
  selectedDate: string;
  className?: string;
}

const zodiacSigns = [
  { name: "Aquarius", startDate: "01-20", endDate: "02-18", angle: 0 },
  { name: "Pisces", startDate: "02-19", endDate: "03-20", angle: 30 },
  { name: "Aries", startDate: "03-21", endDate: "04-19", angle: 60 },
  { name: "Taurus", startDate: "04-20", endDate: "05-20", angle: 90 },
  { name: "Gemini", startDate: "05-21", endDate: "06-20", angle: 120 },
  { name: "Cancer", startDate: "06-21", endDate: "07-22", angle: 150 },
  { name: "Leo", startDate: "07-23", endDate: "08-22", angle: 180 },
  { name: "Virgo", startDate: "08-23", endDate: "09-22", angle: 210 },
  { name: "Libra", startDate: "09-23", endDate: "10-22", angle: 240 },
  { name: "Scorpio", startDate: "10-23", endDate: "11-21", angle: 270 },
  { name: "Sagittarius", startDate: "11-22", endDate: "12-21", angle: 300 },
  { name: "Capricorn", startDate: "12-22", endDate: "01-19", angle: 330 }
];

export const ZodiacWheel = ({ selectedDate, className = "" }: ZodiacWheelProps) => {
  const [activeSign, setActiveSign] = useState<string>("");
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (selectedDate) {
      const sign = getZodiacSign(selectedDate);
      setActiveSign(sign);
      
      const signData = zodiacSigns.find(s => s.name === sign);
      if (signData) {
        setRotation(-signData.angle);
      }
    }
  }, [selectedDate]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative w-64 h-64">
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 bg-gradient-mystic"></div>
        
        {/* Zodiac signs around the wheel */}
        <div 
          className="absolute inset-4 transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {zodiacSigns.map((sign, index) => {
            const angle = (index * 30) - 90; // Start from top
            const radius = 100;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <div
                key={sign.name}
                className="absolute transition-all duration-500"
                style={{
                  left: `calc(50% + ${x}px - 16px)`,
                  top: `calc(50% + ${y}px - 16px)`,
                  transform: `rotate(${-rotation}deg)` // Counter-rotate the icons
                }}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    activeSign === sign.name 
                      ? 'bg-primary shadow-mystic scale-125' 
                      : 'bg-background/50 hover:bg-primary/20'
                  }`}
                >
                  <ZodiacIcon 
                    sign={sign.name} 
                    size="sm" 
                    className={activeSign === sign.name ? 'text-primary-foreground' : ''} 
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-cosmic border-2 border-primary flex items-center justify-center">
            {activeSign && (
              <ZodiacIcon sign={activeSign} size="lg" />
            )}
          </div>
        </div>

        {/* Decorative stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Active sign info */}
      {activeSign && (
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 animate-fade-in">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-3 text-center border mystic-border">
            <p className="text-lg font-playfair text-primary">{activeSign}</p>
            <p className="text-sm text-muted-foreground">Your solar sign</p>
          </div>
        </div>
      )}
    </div>
  );
};