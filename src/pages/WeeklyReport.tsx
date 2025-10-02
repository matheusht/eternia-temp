import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Star, Calendar, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/AppLayout";
import { PasswordChangeForm } from "@/components/PasswordChangeForm";

interface WeeklyStats {
  diaryEntries: number;
  aiConsultations: number;
  dailyVisits: number;
  totalPoints: number;
  weekRange: string;
}

const WeeklyReport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserData();
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  // Fetch weekly statistics
  useEffect(() => {
    if (!user) return;

    const fetchWeeklyStats = async () => {
      try {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        
        // Get diary entries count
        const { count: diaryCount } = await supabase
          .from('diary_entries')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('created_at', weekStart.toISOString());

        // Get activities count
        const { data: activities } = await supabase
          .from('user_activities')
          .select('activity_type')
          .eq('user_id', user.id)
          .gte('completed_at', weekStart.toISOString());

        const aiConsultations = activities?.filter(a => a.activity_type === 'ia_consulta').length || 0;
        const dailyVisits = activities?.filter(a => a.activity_type === 'visita_diaria').length || 0;

        const stats: WeeklyStats = {
          diaryEntries: diaryCount || 0,
          aiConsultations,
          dailyVisits,
          totalPoints: profile?.total_points || 0,
          weekRange: `${weekStart.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} - ${new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}`
        };

        setWeeklyStats(stats);
      } catch (error) {
        console.error('Error fetching weekly stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyStats();
  }, [user, profile]);

  if (loading || !weeklyStats) {
    return (
      <div className="min-h-screen cosmic-bg p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="cosmic-pulse">Loading report...</div>
        </div>
      </div>
    );
  }

  const spiritualProgress = {
    level: profile?.current_level || "Apprentice",
    nextLevel: profile?.current_level === "Apprentice" ? "Initiate" : 
               profile?.current_level === "Initiate" ? "Sage" : "Master",
    progress: Math.min(((profile?.total_points || 0) % 40) * 2.5, 100)
  };

  const highlights = [
    weeklyStats.diaryEntries > 0 ? `You made ${weeklyStats.diaryEntries} entries in your spiritual diary` : "Consider making more diary entries",
    weeklyStats.aiConsultations > 0 ? `You made ${weeklyStats.aiConsultations} consultations with the Oracle` : "Explore the Oracle more for guidance",
    `You accumulated ${weeklyStats.totalPoints} spiritual points on your journey`
  ];

  const challenges = [
    weeklyStats.diaryEntries < 3 ? "Try to maintain a more regular diary" : "Keep your diary active",
    weeklyStats.aiConsultations < 2 ? "Consider making more spiritual consultations" : "Excellent connection with your intuition"
  ];

  return (
    <AppLayout>
      <div className="min-h-screen cosmic-bg p-4 pb-20">
        <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-playfair ethereal-text">Weekly Report</h1>
              <p className="text-muted-foreground">{weeklyStats.weekRange}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Progress Overview */}
          <Card className="mystic-border cosmic-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Spiritual Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {weeklyStats.totalPoints}
                  </div>
                  <p className="text-sm text-muted-foreground">Spiritual Points</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {weeklyStats.dailyVisits}
                  </div>
                  <p className="text-sm text-muted-foreground">Visits this Week</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {spiritualProgress.level}
                  </div>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Level: {spiritualProgress.level}</span>
                  <span className="text-sm text-muted-foreground">
                    {spiritualProgress.progress}% to {spiritualProgress.nextLevel}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div 
                    className="bg-gradient-cosmic h-3 rounded-full transition-all duration-500"
                    style={{ width: `${spiritualProgress.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities Summary */}
          <Card className="mystic-border">
            <CardHeader>
              <CardTitle>Week Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/5">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {weeklyStats.aiConsultations}
                  </div>
                  <p className="text-xs text-muted-foreground">AI Consultations</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/5">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {weeklyStats.diaryEntries}
                  </div>
                  <p className="text-xs text-muted-foreground">Diary Entries</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/5">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {weeklyStats.dailyVisits}
                  </div>
                  <p className="text-xs text-muted-foreground">Daily Visits</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/5">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {spiritualProgress.level}
                  </div>
                  <p className="text-xs text-muted-foreground">Spiritual Level</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights & Highlights */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="mystic-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Week Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground">{highlight}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="mystic-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Areas for Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground">{challenge}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Spiritual Insight */}
          <Card className="mystic-border cosmic-glow">
            <CardHeader>
              <CardTitle className="text-center">Weekly Spiritual Insight</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg leading-relaxed text-muted-foreground italic">
                "This week was marked by {weeklyStats.diaryEntries > 0 ? 'deep reflections' : 'growth opportunities'}. 
                Your {profile?.goal || 'self-discovery'} journey is flourishing with {weeklyStats.totalPoints} spiritual points accumulated."
              </p>
              <Badge variant="secondary" className="mt-4">
                Based on {profile?.goal || 'self-discovery'}
              </Badge>
            </CardContent>
          </Card>

          {/* Next Week Preview */}
          <Card className="mystic-border">
            <CardHeader>
              <CardTitle>Next Week Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-gradient-cosmic/10">
                  <h4 className="font-medium mb-2">Spiritual Focus</h4>
                  <p className="text-sm text-muted-foreground">Connection with nature</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-cosmic/10">
                  <h4 className="font-medium mb-2">Recommended Ritual</h4>
                  <p className="text-sm text-muted-foreground">Full moon bath</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-cosmic/10">
                  <h4 className="font-medium mb-2">Dominant Energy</h4>
                  <p className="text-sm text-muted-foreground">Transformation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <PasswordChangeForm />
        </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default WeeklyReport;