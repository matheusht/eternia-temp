import { useEffect, useState } from "react";
import { Clock, Sun, Moon, Star } from "lucide-react";

interface AstrologicalChartProps {
  selectedTime: string;
  className?: string;
}

const astrologyHouses = [
  { name: "House 1", description: "Personality", icon: Sun },
  { name: "House 2", description: "Resources", icon: Star },
  { name: "House 3", description: "Communication", icon: Star },
  { name: "House 4", description: "Home", icon: Moon },
  { name: "House 5", description: "Creativity", icon: Sun },
  { name: "House 6", description: "Work", icon: Star },
  { name: "House 7", description: "Relationships", icon: Moon },
  { name: "House 8", description: "Transformation", icon: Star },
  { name: "House 9", description: "Philosophy", icon: Sun },
  { name: "House 10", description: "Career", icon: Star },
  { name: "House 11", description: "Friendships", icon: Moon },
  { name: "House 12", description: "Spirituality", icon: Star }
];

export const AstrologicalChart = ({ selectedTime, className = "" }: AstrologicalChartProps) => {
  const [activeHouse, setActiveHouse] = useState<number>(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (selectedTime) {
      const [hours] = selectedTime.split(':').map(Number);
      // Calculate which astrological house is prominent based on time
      const houseIndex = Math.floor((hours * 12) / 24) + 1;
      setActiveHouse(houseIndex);
      setRotation(((hours * 12) / 24) * 30);
    }
  }, [selectedTime]);

  const getTimeBasedMessage = () => {
    if (!selectedTime) return "";
    
    const [hours] = selectedTime.split(':').map(Number);
    
    if (hours >= 6 && hours < 12) {
      return "Morning born have strong solar energy";
    } else if (hours >= 12 && hours < 18) {
      return "Afternoon born are communicative and social";
    } else if (hours >= 18 && hours < 24) {
      return "Evening born have sharp intuition";
    } else {
      return "Dawn born are unique visionaries";
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative w-64 h-64">
        {/* Outer zodiac wheel */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
        
        {/* Astrological houses */}
        <div 
          className="absolute inset-6 transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {astrologyHouses.map((house, index) => {
            const angle = (index * 30) - 90;
            const radius = 80;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            const IconComponent = house.icon;
            
            return (
              <div
                key={house.name}
                className="absolute transition-all duration-500"
                style={{
                  left: `calc(50% + ${x}px - 12px)`,
                  top: `calc(50% + ${y}px - 12px)`,
                  transform: `rotate(${-rotation}deg)`
                }}
              >
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                    activeHouse === index + 1
                      ? 'bg-primary shadow-mystic scale-125' 
                      : 'bg-background/30 hover:bg-primary/20'
                  }`}
                  title={`${house.name}: ${house.description}`}
                >
                  <IconComponent 
                    size={12} 
                    className={activeHouse === index + 1 ? 'text-primary-foreground' : 'text-primary/60'} 
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Center clock */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-cosmic border-2 border-primary flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>

        {/* Time indicator */}
        {selectedTime && (
          <div 
            className="absolute w-0.5 h-20 bg-primary/80 origin-bottom transition-transform duration-1000"
            style={{
              left: '50%',
              top: '20px',
              transform: `translateX(-50%) rotate(${rotation}deg)`,
              transformOrigin: 'bottom center'
            }}
          />
        )}

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400/60 rounded-full"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${30 + Math.random() * 40}%`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Active house info */}
      {selectedTime && (
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 animate-fade-in">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 text-center border mystic-border max-w-xs">
            <p className="text-sm font-medium text-primary">
              {astrologyHouses[activeHouse - 1]?.name} - {astrologyHouses[activeHouse - 1]?.description}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {getTimeBasedMessage()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};