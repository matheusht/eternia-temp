import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { DailyHoroscope } from "@/components/DailyHoroscope";
import { AppLayout } from "@/components/AppLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguageNavigation } from "@/hooks/useLanguageNavigation";

const HoroscopePage = () => {
  const { user } = useAuth();
  const { profile } = useUserData();
  const { navigate } = useLanguageNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-mystic flex items-center justify-center">
        <div className="text-foreground text-xl font-cinzel">{t('common.loadingCosmicEnergies')}</div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-lg px-4 sm:px-6 py-8">
        <DailyHoroscope birthDate={profile.birth_date} />
      </div>
    </AppLayout>
  );
};

export default HoroscopePage;