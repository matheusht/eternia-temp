import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useDailyLimits(tableName: string, limitPerDay: number = 2) {
  const { user } = useAuth();
  const [dailyCount, setDailyCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [limitReached, setLimitReached] = useState<boolean>(false);

  const checkDailyLimit = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from(tableName as any)
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString());

      if (error) throw error;

      const count = data?.length || 0;
      setDailyCount(count);
      setLimitReached(count >= limitPerDay);
    } catch (error) {
      console.error('Error checking daily limit:', error);
      setDailyCount(0);
      setLimitReached(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkDailyLimit();
  }, [user, tableName]);

  const refreshLimit = () => {
    checkDailyLimit();
  };

  const getResetTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  return {
    dailyCount,
    limitReached,
    isLoading,
    maxLimit: limitPerDay,
    remainingAttempts: Math.max(0, limitPerDay - dailyCount),
    refreshLimit,
    getResetTime,
  };
}
