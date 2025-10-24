import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUserData } from "@/hooks/useUserData";
import { useDailyLimits } from "@/hooks/useDailyLimits";
import { useAuth } from "@/hooks/useAuth";
import { getZodiacSign } from "@/utils/horoscope";
import { Loader2, Sparkles, Clock, Heart } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

// We'll create the schema inside the component to access translations

interface LoveSketchFormProps {
  userProfile: any;
  onSketchGenerated: () => void;
}

export function LoveSketchForm({
  userProfile,
  onSketchGenerated,
}: LoveSketchFormProps) {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSketch, setGeneratedSketch] = useState<{
    imageUrl: string;
    interpretation: string;
  } | null>(null);
  const { session } = useAuth();
  const { addActivity } = useUserData();
  const {
    dailyCount,
    limitReached,
    isLoading,
    maxLimit,
    remainingAttempts,
    refreshLimit,
    getResetTime,
  } = useDailyLimits("love_sketches", 2);

  const formSchema = z.object({
    promptDescription: z
      .string()
      .min(10, t('loveSketch.validation.descriptionMin')),
    physicalTraits: z.string().min(5, t('loveSketch.validation.physicalMin')),
    personalityTraits: z.string().min(5, t('loveSketch.validation.personalityMin')),
    artisticStyle: z.string().min(1, t('loveSketch.validation.styleRequired')),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptDescription: "",
      physicalTraits: "",
      personalityTraits: "",
      artisticStyle: "romantic",
    },
  });

  const artisticStyles = [
    { value: "romantic", label: t('loveSketch.styles.romantic') },
    { value: "mystical", label: t('loveSketch.styles.mystical') },
    { value: "renaissance", label: t('loveSketch.styles.renaissance') },
    { value: "watercolor", label: t('loveSketch.styles.watercolor') },
    { value: "fantasy", label: t('loveSketch.styles.fantasy') },
    { value: "portrait", label: t('loveSketch.styles.portrait') },
  ];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (limitReached) {
      toast.error(t('loveSketch.errors.dailyLimit'));
      return;
    }

    setIsGenerating(true);

    try {
      const userSign = userProfile.birth_date
        ? getZodiacSign(userProfile.birth_date)
        : "Aquarius";
      const elements = {
        Aries: "Fire",
        Leo: "Fire",
        Sagittarius: "Fire",
        Taurus: "Earth",
        Virgo: "Earth",
        Capricorn: "Earth",
        Gemini: "Air",
        Libra: "Air",
        Aquarius: "Air",
        Cancer: "Water",
        Scorpio: "Water",
        Pisces: "Water",
      };
      const userElement = elements[userSign as keyof typeof elements] || "Air";

      // Generate image using Supabase Edge Function with explicit auth token
      const { data, error } = await supabase.functions.invoke(
        "generate-love-sketch",
        {
          body: {
            ...values,
            userSign,
            userElement,
          },
          headers: session?.access_token
            ? {
                Authorization: `Bearer ${session.access_token}`,
              }
            : undefined,
        }
      );

      if (error) throw error;

      // Save to database
      const { error: saveError } = await supabase.from("love_sketches").insert({
        user_id: userProfile.user_id,
        prompt_description: values.promptDescription,
        physical_traits: values.physicalTraits,
        personality_traits: values.personalityTraits,
        artistic_style: values.artisticStyle,
        astrological_elements: `${userSign} - ${userElement}`,
        image_url: data.imageUrl,
        interpretation: data.interpretation,
      });

      if (saveError) throw saveError;

      setGeneratedSketch({
        imageUrl: data.imageUrl,
        interpretation: data.interpretation,
      });

      // Award points for creating sketch
      await addActivity("ia_consulta");

      // Refresh limit counter
      refreshLimit();

      toast.success(t('loveSketch.sketchCreated'));
      onSketchGenerated();
    } catch (error: any) {
      console.error("Error generating love sketch:", error);

      let errorMessage = t('loveSketch.errors.tryAgain');

      // Try to extract error message from response
      if (error.context?.body) {
        try {
          const errorBody =
            typeof error.context.body === "string"
              ? JSON.parse(error.context.body)
              : error.context.body;

          if (errorBody.error) {
            errorMessage = errorBody.error;
          }
        } catch (parseError) {
          console.error("Could not parse error body:", parseError);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle specific status codes
      if (error.context?.status === 429) {
        errorMessage = t('loveSketch.errors.dailyLimit');
      } else if (error.context?.status === 401) {
        errorMessage = t('loveSketch.errors.sessionExpired');
      } else if (
        error.context?.status === 500 &&
        errorMessage.includes("credits")
      ) {
        errorMessage = t('loveSketch.errors.systemUnavailable');
      }

      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewSketch = () => {
    setGeneratedSketch(null);
    form.reset();
  };

  if (generatedSketch) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-cinzel text-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            {t('loveSketch.yourSketch')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <img
              src={generatedSketch.imageUrl}
              alt="Love Sketch"
              className="rounded-lg shadow-lg max-w-md w-full"
            />
          </div>

          <div className="bg-primary/10 rounded-lg p-4">
            <h3 className="font-cinzel text-lg text-foreground mb-2">
              {t('loveSketch.mysticalInterpretation')}
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              {generatedSketch.interpretation}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => toast.success(t('loveSketch.sketchSaved'))}
              className="bg-accent hover:bg-accent/90"
            >
              {t('loveSketch.saveToGallery')}
            </Button>
            <Button
              onClick={handleNewSketch}
              className="bg-primary hover:bg-primary/90"
            >
              {t('loveSketch.createNew')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl font-cinzel text-foreground text-center">
          {t('loveSketch.describeConnection')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Daily limit indicator */}
        <div className="mb-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-3 bg-muted/50 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">
                {t('loveSketch.checkingLimit')}
              </span>
            </div>
          ) : limitReached ? (
            <Alert className="border-destructive/50 bg-destructive/10">
              <Clock className="h-4 w-4" />
              <AlertDescription className="text-foreground">
                <strong>{t('loveSketch.limitReached')}</strong> {t('loveSketch.limitReachedDesc', { count: dailyCount, max: maxLimit })}
                <br />
                <span className="text-sm text-muted-foreground">
                  {t('loveSketch.resetAt', { 
                    time: getResetTime().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  })}
                </span>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {t('loveSketch.dailySketches')}: {dailyCount}/{maxLimit}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {remainingAttempts} {t('loveSketch.remaining')}
              </span>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="promptDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    {t('loveSketch.generalDescription')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('loveSketch.descriptionPlaceholder')}
                      className="min-h-[100px] bg-background/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="physicalTraits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      {t('loveSketch.physicalCharacteristics2')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('loveSketch.physicalPlaceholder')}
                        className="min-h-[80px] bg-background/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personalityTraits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      {t('loveSketch.personalityAndEnergy')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('loveSketch.personalityPlaceholder')}
                        className="min-h-[80px] bg-background/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="artisticStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    {t('loveSketch.artisticStyle')}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder={t('loveSketch.chooseStyle')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {artisticStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isGenerating || limitReached}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {t('loveSketch.generating')}
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  {t('loveSketch.generateButton')}
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
