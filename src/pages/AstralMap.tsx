import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { getPersonalizedHoroscope } from "@/utils/horoscope";
import { AppLayout } from "@/components/AppLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocation } from "react-router-dom";

const AstralMap = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserData();
  const { t } = useTranslation();
  const location = useLocation();
  const isPortuguese = location.pathname.startsWith("/pt");

  // Direct translations for specific sections
  const directTexts = {
    en: {
      yourAstrologicalData: "Your Astrological Data",
      spiritualGoals: "Spiritual Goals",
      yourMapInterpretation: "Your Map Interpretation",
      spiritualFocus: "Spiritual Focus",
      luckyElement: "Lucky Element",
      canEnhanceEnergy: "can enhance your energy",
      energyColor: "Energy Color",
      useEnergyColor: "Use the color",
      toHarmonize: "to harmonize your vibrations",
      goals: {
        autoconhecimento: "Self-Knowledge",
        amor: "Love",
        carreira: "Career",
        saude: "Health",
        espiritualidade: "Spirituality",
        abundancia: "Abundance",
        relacionamentos: "Relationships",
        proposito: "Life Purpose"
      }
    },
    pt: {
      yourAstrologicalData: "Seus Dados Astrológicos",
      spiritualGoals: "Objetivos Espirituais",
      yourMapInterpretation: "Interpretação do Seu Mapa",
      spiritualFocus: "Foco Espiritual",
      luckyElement: "Elemento da Sorte",
      canEnhanceEnergy: "pode potencializar sua energia",
      energyColor: "Cor Energética",
      useEnergyColor: "Use a cor",
      toHarmonize: "para harmonizar suas vibrações",
      goals: {
        autoconhecimento: "Autoconhecimento",
        amor: "Amor",
        carreira: "Carreira",
        saude: "Saúde",
        espiritualidade: "Espiritualidade",
        abundancia: "Abundância",
        relacionamentos: "Relacionamentos",
        proposito: "Propósito de Vida"
      }
    }
  };

  const getDirectText = (key: string): string => {
    const lang = isPortuguese ? 'pt' : 'en';
    const keys = key.split('.');
    let value: any = directTexts[lang];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
  }, [user, navigate]);

  if (!profile) {
    return (
      <div className="min-h-screen cosmic-bg p-4 pb-20">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="text-primary font-medium">
            {t("astralMap.loading")}
          </div>
        </div>
      </div>
    );
  }

  // Get goal label from direct translations
  const getGoalLabel = (goalId: string): string => {
    return getDirectText(`goals.${goalId}`);
  };

  const horoscopeData = getPersonalizedHoroscope(
    profile.birth_date,
    profile.birth_time,
    profile.birth_location,
    profile.goal ||
    (profile.goals && profile.goals.length > 0
      ? profile.goals[0]
      : "autoconhecimento"),
    isPortuguese ? 'pt' : 'en'
  );

  const astralData = {
    sun: horoscopeData.sign,
    moon: "Pisces",
    ascendant: "Scorpio",
    venus: "Virgo",
    mars: "Aries",
    mercury: "Cancer",
  };

  return (
    <AppLayout>
      <div className="min-h-screen cosmic-bg p-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-3xl font-playfair ethereal-text">
              {t("astralMap.title")}
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Dados Pessoais */}
            <Card className="mystic-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  {getDirectText("yourAstrologicalData")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("astralMap.birthDate")}
                  </p>
                  <p className="font-medium">
                    {profile.birth_date.split("-").reverse().join("/")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("astralMap.time")}
                  </p>
                  <p className="font-medium">{profile.birth_time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("astralMap.location")}
                  </p>
                  <p className="font-medium">{profile.birth_location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {getDirectText("spiritualGoals")}
                  </p>
                  <div className="space-y-1">
                    {profile.goals && profile.goals.length > 0 ? (
                      profile.goals.map((goalId: string) => (
                        <p key={goalId} className="text-sm font-medium">
                          • {getGoalLabel(goalId)}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm font-medium capitalize">
                        {getGoalLabel(profile.goal || "autoconhecimento")}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("astralMap.luckyElement")}
                  </p>
                  <p className="font-medium">{horoscopeData.luckyElement}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("astralMap.energyColor")}
                  </p>
                  <p className="font-medium">{horoscopeData.energyColor}</p>
                </div>
              </CardContent>
            </Card>

            {/* Mapa Astral Visual */}
            <Card className="mystic-border cosmic-glow">
              <CardHeader>
                <CardTitle className="text-center">
                  {t("astralMap.astralMandala")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-64 h-64 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30"></div>
                  <div className="absolute inset-4 rounded-full border border-primary/20"></div>
                  <div className="absolute inset-8 rounded-full border border-primary/10"></div>

                  {/* Sun */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
                    <Sun className="w-6 h-6 text-yellow-400 mx-auto" />
                    <p className="text-xs mt-1">
                      {t("astralMap.planetLabels.sun")}
                    </p>
                  </div>

                  {/* Moon */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                    <Moon className="w-6 h-6 text-blue-300 mx-auto" />
                    <p className="text-xs mt-1">
                      {t("astralMap.planetLabels.moon")}
                    </p>
                  </div>

                  {/* Other planets */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-center">
                    <Star className="w-5 h-5 text-red-400 mx-auto" />
                    <p className="text-xs mt-1">
                      {t("astralMap.planetLabels.mars")}
                    </p>
                  </div>

                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-center">
                    <Star className="w-5 h-5 text-green-400 mx-auto" />
                    <p className="text-xs mt-1">
                      {t("astralMap.planetLabels.venus")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Signos Principais */}
            <Card className="mystic-border">
              <CardHeader>
                <CardTitle>{t("astralMap.yourMainSigns")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                  <span className="font-medium">{t("astralMap.sunSign")}</span>
                  <span className="text-primary">{astralData.sun}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                  <span className="font-medium">{t("astralMap.moonSign")}</span>
                  <span className="text-primary">{astralData.moon}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                  <span className="font-medium">
                    {t("astralMap.ascendant")}
                  </span>
                  <span className="text-primary">{astralData.ascendant}</span>
                </div>
              </CardContent>
            </Card>

            {/* Planetas */}
            <Card className="mystic-border">
              <CardHeader>
                <CardTitle>{t("astralMap.planetaryPositions")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    {t("astralMap.planetLabels.venusLove")}
                  </span>
                  <span className="text-sm text-primary">
                    {astralData.venus}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    {t("astralMap.planetLabels.marsEnergy")}
                  </span>
                  <span className="text-sm text-primary">
                    {astralData.mars}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    {t("astralMap.planetLabels.mercuryCommunication")}
                  </span>
                  <span className="text-sm text-primary">
                    {astralData.mercury}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interpretação */}
          <Card className="mystic-border mt-6">
            <CardHeader>
              <CardTitle>{getDirectText("yourMapInterpretation")}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                {horoscopeData.personalizedMessage}
              </p>
              <p className="text-muted-foreground mt-4">
                <strong>{getDirectText("spiritualFocus")}:</strong>{" "}
                {horoscopeData.spiritualFocus}
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>{getDirectText("luckyElement")}:</strong>{" "}
                {horoscopeData.luckyElement} {getDirectText("canEnhanceEnergy")}
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>{getDirectText("energyColor")}:</strong>{" "}
                {getDirectText("useEnergyColor")} {horoscopeData.energyColor}{" "}
                {getDirectText("toHarmonize")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AstralMap;
