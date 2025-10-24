import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  birth_date: string;
  birth_time: string;
  birth_location: string;
  goal: string | null; // Legacy single goal support
  goals: string[] | null; // New multiple goals support
  gender: string | null;
  marital_status: string | null;
  interests: string[] | null;
  language_preference: string | null;
  total_points: number;
  current_level: string;
  created_at: string;
  updated_at: string;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        setProfile(data as UserProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data as UserProfile);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const addActivity = async (activityType: 'ia_consulta' | 'registro_diario' | 'visita_diaria' | 'ritual_completado') => {
    if (!user) return;

    try {
      // Add activity
      const { error: activityError } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          points_earned: 1
        });

      if (activityError) throw activityError;

      // Update user level
      const { error: levelError } = await supabase.rpc('update_user_level', {
        user_uuid: user.id
      });

      if (levelError) throw levelError;

      // Refetch profile to get updated points and level
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    addActivity
  };
};