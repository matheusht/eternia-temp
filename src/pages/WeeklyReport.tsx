import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Star, Calendar, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/AppLayout";
import { PasswordChangeForm } from "@/components/PasswordChangeForm";
import { useTranslation } from "@/hooks/useTranslation";
import { formatDate } from "@/utils/dateFormat";

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
  const { t, language } = useTranslation();
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth");
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
          .from("diary_entries")
          .select("*", { count: "exact" })
          .eq("user_id", user.id)
          .gte("created_at", weekStart.toISOString());

        // Get activities count
        const { data: activities } = await supabase
          .from("user_activities")
          .select("activity_type")
          .eq("user_id", user.id)
          .gte("completed_at", weekStart.toISOString());

        const aiConsultations =
          activities?.filter((a) => a.activity_type === "ia_consulta").length ||
          0;
        const dailyVisits =
          activities?.filter((a) => a.activity_type === "visita_diaria")
            .length || 0;

        const stats: WeeklyStats = {
          diaryEntries: diaryCount || 0,
          aiConsultations,
          dailyVisits,
          totalPoints: profile?.total_points || 0,
          weekRange: `${formatDate(weekStart, language, {
            day: "2-digit",
            month: "short",
          })} - ${formatDate(new Date(), language, {
            day: "2-digit",
            month: "short",
          })}`,
        };

        setWeeklyStats(stats);
      } catch (error) {
        console.error("Error fetching weekly stats:", error);
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
          <div className="cosmic-pulse">{t("weeklyReport.loadingReport")}</div>
        </div>
      </div>
    );
  }

  // Get translated level names
  const getLevelName = (level: string) => {
    const levelMap: Record<string, string> = {
      Apprentice: "apprentice",
      Initiate: "initiate",
      Sage: "sage",
      Master: "master",
    };
    const levelKey = levelMap[level] || "apprentice";
    return t(`levels.${levelKey}`);
  };

  const getNextLevel = (currentLevel: string) => {
    if (currentLevel === "Apprentice") return "Initiate";
    if (currentLevel === "Initiate") return "Sage";
    if (currentLevel === "Sage") return "Master";
    return "Master";
  };

  const spiritualProgress = {
    level: getLevelName(profile?.current_level || "Apprentice"),
    nextLevel: getLevelName(
      getNextLevel(profile?.current_level || "Apprentice")
    ),
    progress: Math.min(((profile?.total_points || 0) % 40) * 2.5, 100),
  };

  const highlights = [
    weeklyStats.diaryEntries > 0
      ? t("weeklyReport.highlights.diaryEntries", {
          count: weeklyStats.diaryEntries.toString(),
        })
      : t("weeklyReport.highlights.noDiaryEntries"),
    weeklyStats.aiConsultations > 0
      ? t("weeklyReport.highlights.consultations", {
          count: weeklyStats.aiConsultations.toString(),
        })
      : t("weeklyReport.highlights.noConsultations"),
    t("weeklyReport.highlights.pointsAccumulated", {
      points: weeklyStats.totalPoints.toString(),
    }),
  ];

  const challenges = [
    weeklyStats.diaryEntries < 3
      ? t("weeklyReport.challenges.fewDiaryEntries")
      : t("weeklyReport.challenges.goodDiary"),
    weeklyStats.aiConsultations < 2
      ? t("weeklyReport.challenges.fewConsultations")
      : t("weeklyReport.challenges.goodIntuition"),
  ];

  return (
    <AppLayout>
      <div className="min-h-screen cosmic-bg p-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-playfair ethereal-text">
                  {t("weeklyReport.title")}
                </h1>
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
                  {t("weeklyReport.spiritualProgress")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {weeklyStats.totalPoints}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("weeklyReport.spiritualPoints")}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {weeklyStats.dailyVisits}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("weeklyReport.visitsThisWeek")}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {spiritualProgress.level}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("weeklyReport.currentLevel")}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {t("weeklyReport.levelProgress")}{" "}
                      {spiritualProgress.level}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {spiritualProgress.progress}
                      {t("weeklyReport.progressTo")}{" "}
                      {spiritualProgress.nextLevel}
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
                <CardTitle>{t("weeklyReport.weekActivities")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-primary/5">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {weeklyStats.aiConsultations}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("weeklyReport.aiConsultations")}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/5">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {weeklyStats.diaryEntries}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("weeklyReport.diaryEntries")}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/5">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {weeklyStats.dailyVisits}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("weeklyReport.dailyVisits")}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/5">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {spiritualProgress.level}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("weeklyReport.spiritualLevel")}
                    </p>
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
                    {t("weeklyReport.weekHighlights")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-muted-foreground">
                          {highlight}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="mystic-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    {t("weeklyReport.areasForGrowth")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-muted-foreground">
                          {challenge}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Spiritual Insight */}
            <Card className="mystic-border cosmic-glow">
              <CardHeader>
                <CardTitle className="text-center">
                  {t("weeklyReport.weeklySpiritualInsight")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg leading-relaxed text-muted-foreground italic">
                  "
                  {weeklyStats.diaryEntries > 0
                    ? t("weeklyReport.insight.deepReflections")
                    : t("weeklyReport.insight.growthOpportunities")}
                  .{" "}
                  {t("weeklyReport.insight.journeyFlourishing", {
                    goal: profile?.goal
                      ? t(`astralMap.goals.${profile.goal}`)
                      : t("astralMap.goals.autoconhecimento"),
                    points: weeklyStats.totalPoints.toString(),
                  })}
                  "
                </p>
                <Badge variant="secondary" className="mt-4">
                  {t("weeklyReport.insight.basedOn", {
                    goal: profile?.goal
                      ? t(`astralMap.goals.${profile.goal}`)
                      : t("astralMap.goals.autoconhecimento"),
                  })}
                </Badge>
              </CardContent>
            </Card>

            {/* Next Week Preview */}
            <Card className="mystic-border">
              <CardHeader>
                <CardTitle>{t("weeklyReport.nextWeekPreview")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-gradient-cosmic/10">
                    <h4 className="font-medium mb-2">
                      {t("weeklyReport.spiritualFocus")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("weeklyReport.nextWeek.connectionWithNature")}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-cosmic/10">
                    <h4 className="font-medium mb-2">
                      {t("weeklyReport.recommendedRitual")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("weeklyReport.nextWeek.fullMoonBath")}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-cosmic/10">
                    <h4 className="font-medium mb-2">
                      {t("weeklyReport.dominantEnergy")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("weeklyReport.nextWeek.transformation")}
                    </p>
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
