import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, Moon, Heart, Lightbulb, Sparkles, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { analyzeEntry } from "@/utils/spiritualAnalysis";
import { AppLayout } from "@/components/AppLayout";
import { useTranslation } from "@/hooks/useTranslation";

interface DiaryEntry {
  id: string;
  created_at: string;
  type: 'dream' | 'feeling' | 'insight' | 'experience';
  title: string;
  content: string;
  ai_analysis?: string;
}

const SpiritualDiary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, addActivity } = useUserData();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: 'feeling' as DiaryEntry['type'],
    title: '',
    content: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  // Fetch diary entries
  useEffect(() => {
    if (!user) return;

    const fetchEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('diary_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEntries((data || []) as DiaryEntry[]);
      } catch (error) {
        console.error('Error fetching diary entries:', error);
        toast({
          title: "Error",
          description: "Could not load diary entries.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [user, toast]);

  const entryTypes = {
    dream: { icon: Moon, label: 'Dream', color: 'bg-blue-500' },
    feeling: { icon: Heart, label: 'Feeling', color: 'bg-pink-500' },
    insight: { icon: Lightbulb, label: 'Insight', color: 'bg-yellow-500' },
    experience: { icon: Sparkles, label: 'Experience', color: 'bg-purple-500' }
  };

  const handleAddEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim() || !user || !profile) return;

    setSaving(true);
    try {
      // Generate spiritual analysis locally (no API costs)
      const localAnalysis = analyzeEntry(
        newEntry.type,
        newEntry.title,
        newEntry.content,
        profile.goal || 'spirituality'
      );

      // Save to database with analysis
      const { data: entryData, error: entryError } = await supabase
        .from('diary_entries')
        .insert({
          user_id: user.id,
          type: newEntry.type,
          title: newEntry.title,
          content: newEntry.content,
          ai_analysis: localAnalysis
        })
        .select()
        .single();

      if (entryError) throw entryError;

      // Add to local state
      setEntries([entryData as DiaryEntry, ...entries]);
      
      // Add activity for gamification
      await addActivity('registro_diario');

      setNewEntry({ type: 'feeling', title: '', content: '' });
      setIsAddingEntry(false);

      toast({
        title: "Entry saved!",
        description: "Your spiritual experience has been recorded with personalized analysis."
      });

    } catch (error) {
      console.error('Error saving diary entry:', error);
        toast({
          title: "Error",
          description: "Could not save the entry.",
          variant: "destructive"
        });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      setEntries(entries.filter(entry => entry.id !== entryId));
      
      toast({
        title: "Entry deleted",
        description: "The entry has been removed from your diary."
      });
    } catch (error) {
      console.error('Error deleting entry:', error);
        toast({
          title: "Error",
          description: "Could not delete the entry.",
          variant: "destructive"
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen cosmic-bg p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="text-primary font-medium">{t('spiritualDiary.loadingDiary')}</div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen cosmic-bg p-4 pb-20">
        <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center justify-center flex-1">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-playfair ethereal-text">{t('spiritualDiary.title')}</h1>
            </div>
          </div>
          
          <Button 
            variant="cosmic"
            onClick={() => setIsAddingEntry(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('spiritualDiary.newEntry')}
          </Button>
        </div>

        {/* Add Entry Form */}
        {isAddingEntry && (
          <Card className="mystic-border cosmic-glow mb-6">
            <CardHeader>
              <CardTitle>{t('spiritualDiary.newSpiritualEntry')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">{t('spiritualDiary.entryTypeLabel')}</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(entryTypes).map(([key, type]) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={key}
                        variant={newEntry.type === key ? "cosmic" : "ethereal"}
                        onClick={() => setNewEntry(prev => ({ ...prev, type: key as DiaryEntry['type'] }))}
                        className="flex items-center gap-2 h-auto p-3"
                      >
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t('spiritualDiary.titleLabel')}</label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t('spiritualDiary.titlePlaceholder')}
                  className="w-full p-2 rounded-md border border-input bg-background"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t('spiritualDiary.descriptionLabel')}</label>
                <Textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  placeholder={t('spiritualDiary.descriptionPlaceholder')}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleAddEntry} 
                  variant="cosmic" 
                  disabled={saving || !newEntry.title.trim() || !newEntry.content.trim()}
                >
                  {saving ? t('spiritualDiary.saving') : t('spiritualDiary.saveEntry')}
                </Button>
                <Button 
                  variant="ethereal" 
                  onClick={() => setIsAddingEntry(false)}
                  disabled={saving}
                >
                  {t('spiritualDiary.cancel')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Entries List */}
        <div className="space-y-4">
          {entries.map((entry) => {
            const TypeIcon = entryTypes[entry.type].icon;
            return (
              <Card key={entry.id} className="mystic-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${entryTypes[entry.type].color} p-2`}>
                        <TypeIcon className="w-full h-full text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{entry.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString('en-US')} at {new Date(entry.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {entryTypes[entry.type].label}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this entry?')) {
                            handleDeleteEntry(entry.id);
                          }
                        }}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {entry.content}
                  </p>
                  
                  {entry.ai_analysis && (
                    <div className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">{t('spiritualDiary.spiritualAiAnalysis')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        {entry.ai_analysis}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {entries.length === 0 && !isAddingEntry && (
          <Card className="mystic-border text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('spiritualDiary.emptyDiary')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('spiritualDiary.emptyDiaryDesc')}
              </p>
              <Button variant="cosmic" onClick={() => setIsAddingEntry(true)}>
                {t('spiritualDiary.makeFirstEntry')}
              </Button>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </AppLayout>
  );
};

export default SpiritualDiary;