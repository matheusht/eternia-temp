import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { MarriageCompatibility } from "@/components/MarriageCompatibility";
import { AppLayout } from "@/components/AppLayout";

const Compatibility = () => {
  const { user } = useAuth();
  const { profile } = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-mystic flex items-center justify-center">
        <div className="text-foreground text-xl font-cinzel">Loading cosmic energies...</div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-lg px-4 sm:px-6 py-8">
        <MarriageCompatibility userBirthDate={profile.birth_date} />
      </div>
    </AppLayout>
  );
};

export default Compatibility;