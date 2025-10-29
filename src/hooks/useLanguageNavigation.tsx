import { useLanguageContext } from "@/contexts/LanguageContext";

export const useLanguageNavigation = () => {
  const { language, getLocalizedPath, navigateWithLanguage } = useLanguageContext();

  // Helper function to get localized routes
  const getRoutes = () => ({
    // Auth routes
    auth: getLocalizedPath('/auth'),

    // Onboarding routes
    onboarding: getLocalizedPath('/onboarding'),

    // Main app routes
    dashboard: getLocalizedPath('/'),
    horoscope: getLocalizedPath('/horoscope'),
    compatibility: getLocalizedPath('/compatibility'),
    loveSketch: getLocalizedPath('/love-sketch'),
    oracle: getLocalizedPath('/oracle'),
    tarot: getLocalizedPath('/tarot'),
    astralMap: getLocalizedPath('/astral-map'),
    diary: getLocalizedPath('/diary'),
    weeklyReport: getLocalizedPath('/weekly-report'),

    // Landing
    landing: getLocalizedPath('/'),
  });

  return {
    language,
    routes: getRoutes(),
    navigate: navigateWithLanguage,
    getLocalizedPath,
  };
};