import { useLocation, useNavigate } from "react-router-dom";
import { Home, Brain, Map, BookOpen, BarChart, Sparkles, Sun, Heart } from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
  { id: "horoscope", label: "Horóscopo", icon: Sun, path: "/horoscopo" },
  { id: "compatibility", label: "Amor", icon: Heart, path: "/compatibilidade" },
  { id: "oracle", label: "Oracle", icon: Brain, path: "/ia-vidente" },
  { id: "astral", label: "Mapa Astral", icon: Map, path: "/mapa-astral" },
  { id: "tarot", label: "Tarot", icon: Sparkles, path: "/tarot" }
];

export const TabNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const active = isActive(tab.path);
            
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`
                  flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 min-w-[60px]
                  ${active 
                    ? 'text-white bg-purple-600 transform scale-105' 
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }
                `}
              >
                <IconComponent 
                  className={`w-5 h-5 mb-1 transition-transform duration-200 ${
                    active ? '' : 'hover:scale-110'
                  }`} 
                />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};