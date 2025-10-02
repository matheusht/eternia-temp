import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TarotCard } from '@/utils/tarotCards';
import { useToast } from '@/components/ui/use-toast';

export interface TarotReading {
  id: string;
  date: Date;
  spreadType: 'three-card' | 'celtic-cross' | 'love' | 'career';
  cards: TarotCard[];
  interpretation: string;
}

export const useTarotReadings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadReadings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tarot_readings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading readings:', error);
        toast({
          variant: "destructive",
          title: "Error", 
          description: "Could not load tarot readings",
        });
        return;
      }

      const formattedReadings: TarotReading[] = (data || []).map(reading => ({
        id: reading.id,
        date: new Date(reading.created_at),
        spreadType: reading.spread_type as 'three-card' | 'celtic-cross' | 'love' | 'career',
        cards: reading.cards as unknown as TarotCard[],
        interpretation: reading.interpretation
      }));

      setReadings(formattedReadings);
    } catch (error) {
      console.error('Error loading readings:', error);
      toast({
        title: "Error",
        description: "Could not load tarot readings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveReading = async (cards: TarotCard[], interpretation: string, spreadType: 'three-card' | 'celtic-cross' | 'love' | 'career') => {
    if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save readings",
          variant: "destructive"
        });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('tarot_readings')
        .insert({
          user_id: user.id,
          spread_type: spreadType,
          cards: cards as any,
          interpretation: interpretation
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving reading:', error);
        toast({
          title: "Error",
          description: "Could not save the reading",
          variant: "destructive"
        });
        return false;
      }

      const newReading: TarotReading = {
        id: data.id,
        date: new Date(data.created_at),
        spreadType: data.spread_type as 'three-card' | 'celtic-cross' | 'love' | 'career',
        cards: data.cards as unknown as TarotCard[],
        interpretation: data.interpretation
      };

      setReadings(prev => [newReading, ...prev]);
      
      toast({
        title: "Reading Saved",
        description: "Your reading has been successfully saved to history",
      });

      return true;
    } catch (error) {
      console.error('Error saving reading:', error);
      toast({
        title: "Error",
        description: "Could not save the reading",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteReading = async (readingId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('tarot_readings')
        .delete()
        .eq('id', readingId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting reading:', error);
        toast({
          title: "Error",
          description: "Could not delete the reading",
          variant: "destructive"
        });
        return false;
      }

      setReadings(prev => prev.filter(reading => reading.id !== readingId));
      
      toast({
        title: "Reading Deleted",
        description: "The reading has been removed from history",
      });

      return true;
    } catch (error) {
      console.error('Error deleting reading:', error);
      toast({
        title: "Error",
        description: "Could not delete the reading",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadReadings();
    } else {
      setReadings([]);
    }
  }, [user]);

  return {
    readings,
    isLoading,
    saveReading,
    deleteReading,
    reloadReadings: loadReadings
  };
};