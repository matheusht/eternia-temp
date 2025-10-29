import { useLocation } from "react-router-dom";
import { Home, Brain, Map, BookOpen, BarChart, Sparkles, Sun, Heart } from "lucide-react";
import { useLanguageNavigation } from "@/hooks/useLanguageNavigation";
import { useTranslation } from "@/hooks/useTranslation";

export const TabNavigation = () => {
  const location = useLocation();
  const { navigate, routes } = useLanguageNavigation();
  const { t } = useTranslation();

  const tabs = [
    { id: "dashboard", label: t("navigation.dashboard"), icon: Home, path: routes.dashboard },
    { id: "horoscope", label: t("navigation.horoscope"), icon: Sun, path: routes.horoscope },
    { id: "compatibility", label: t("navigation.compatibility"), icon: Heart, path: routes.compatibility },
    { id: "oracle", label: t("navigation.oracle"), icon: Brain, path: routes.oracle },
    { id: "astral", label: t("navigation.astralMap"), icon: Map, path: routes.astralMap },
    { id: "tarot", label: t("navigation.tarot"), icon: Sparkles, path: routes.tarot }
  ];

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