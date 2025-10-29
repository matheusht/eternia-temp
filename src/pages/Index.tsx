import { useState, useEffect } from "react";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { DailyDashboard } from "@/components/DailyDashboard";
import { EterniaLanding } from "@/components/EterniaLanding";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/AppLayout";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguageNavigation } from "@/hooks/useLanguageNavigation";

interface OnboardingData {
  displayName: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  goals: string[];
  gender: string;
  maritalStatus: string;
  interests: string[];
}

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, addActivity } = useUserData();
  const { navigate, routes } = useLanguageNavigation();
  const { t } = useTranslation();
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Track daily visit only once per day
    if (user && profile) {
      const today = new Date().toDateString();
      const lastVisit = localStorage.getItem("lastDailyVisit");

      if (lastVisit !== today) {
        addActivity("visita_diaria");
        localStorage.setItem("lastDailyVisit", today);
      }
    }
  }, [user, profile]);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: data.displayName,
          birth_date: data.birthDate,
          birth_time: data.birthTime,
          birth_location: data.birthLocation,
          goals: data.goals,
          gender: data.gender,
          marital_status: data.maritalStatus,
          interests: data.interests,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      // Reload the page to trigger a fresh profile fetch
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-mystic flex items-center justify-center">
        <div className="text-foreground text-xl font-cinzel">
          {t("common.loadingCosmicEnergies")}
        </div>
      </div>
    );
  }

  if (!user) {
    return <EterniaLanding onExplore={() => navigate("/auth")} />;
  }

  // Landing page logic removed - now shown after onboarding completion

  // Show onboarding if profile is incomplete
  if (
    !profile?.birth_date ||
    !profile?.birth_time ||
    !profile?.birth_location ||
    !profile?.display_name
  ) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <AppLayout>
      <DailyDashboard profile={profile} />
    </AppLayout>
  );
};

export default Index;
