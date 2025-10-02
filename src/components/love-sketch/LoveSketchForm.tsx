import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUserData } from "@/hooks/useUserData";
import { useDailyLimits } from "@/hooks/useDailyLimits";
import { getZodiacSign } from "@/utils/horoscope";
import { Loader2, Sparkles, Clock, Heart } from "lucide-react";

const formSchema = z.object({
  promptDescription: z.string().min(10, "Describe with more details (minimum 10 characters)"),
  physicalTraits: z.string().min(5, "Describe some physical characteristics"),
  personalityTraits: z.string().min(5, "Describe the personality"),
  artisticStyle: z.string().min(1, "Select an artistic style"),
});

interface LoveSketchFormProps {
  userProfile: any;
  onSketchGenerated: () => void;
}

export function LoveSketchForm({ userProfile, onSketchGenerated }: LoveSketchFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSketch, setGeneratedSketch] = useState<{
    imageUrl: string;
    interpretation: string;
  } | null>(null);
  const { addActivity } = useUserData();
  const { dailyCount, limitReached, isLoading, maxLimit, remainingAttempts, refreshLimit, getResetTime } = 
    useDailyLimits('love_sketches', 2);

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
    { value: "romantic", label: "Romantic & Soft" },
    { value: "mystical", label: "Mystical & Ethereal" },
    { value: "renaissance", label: "Classical Renaissance" },
    { value: "watercolor", label: "Delicate Watercolor" },
    { value: "fantasy", label: "Magical Fantasy" },
    { value: "portrait", label: "Realistic Portrait" },
  ];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (limitReached) {
      toast.error("Daily limit reached! Try again tomorrow.");
      return;
    }

    setIsGenerating(true);
    
    try {
      const userSign = userProfile.birth_date ? getZodiacSign(userProfile.birth_date) : "Aquarius";
      const elements = {
        "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
        "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
        "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
        "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water"
      };
      const userElement = elements[userSign as keyof typeof elements] || "Air";

      // Generate image using Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-love-sketch', {
        body: {
          ...values,
          userSign,
          userElement
        }
      });

      if (error) throw error;

      // Save to database
      const { error: saveError } = await supabase
        .from('love_sketches')
        .insert({
          user_id: userProfile.user_id,
          prompt_description: values.promptDescription,
          physical_traits: values.physicalTraits,
          personality_traits: values.personalityTraits,
          artistic_style: values.artisticStyle,
          astrological_elements: `${userSign} - ${userElement}`,
          image_url: data.imageUrl,
          interpretation: data.interpretation
        });

      if (saveError) throw saveError;

      setGeneratedSketch({
        imageUrl: data.imageUrl,
        interpretation: data.interpretation
      });

      // Award points for creating sketch
      await addActivity('ia_consulta');
      
      // Refresh limit counter
      refreshLimit();
      
      toast.success("Love sketch created successfully!");
      onSketchGenerated();
      
    } catch (error: any) {
      console.error('Error generating love sketch:', error);
      
      let errorMessage = "Tente novamente mais tarde";
      
      // Handle specific error types
      if (error.message?.includes('limite diário') || error.message?.includes('Daily limit')) {
        errorMessage = "Você atingiu o limite diário de 2 love sketches. Volte amanhã!";
      } else if (error.message?.includes('créditos') || error.message?.includes('quota')) {
        errorMessage = "Sistema temporariamente indisponível. Entre em contato com o suporte.";
      } else if (error.message?.includes('Unauthorized') || error.message?.includes('autorizado')) {
        errorMessage = "Sessão expirada. Faça login novamente.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(`Erro ao gerar sketch: ${errorMessage}`);
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
            Your Love Sketch
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
            <h3 className="font-cinzel text-lg text-foreground mb-2">Mystical Interpretation</h3>
            <p className="text-foreground/80 leading-relaxed">{generatedSketch.interpretation}</p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => toast.success("Sketch saved to your gallery!")}
              className="bg-accent hover:bg-accent/90"
            >
              Save to Gallery
            </Button>
            <Button onClick={handleNewSketch} className="bg-primary hover:bg-primary/90">
              Create New Sketch
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
          Describe Your Special Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Daily limit indicator */}
        <div className="mb-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-3 bg-muted/50 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Checking daily limit...</span>
            </div>
          ) : limitReached ? (
            <Alert className="border-destructive/50 bg-destructive/10">
              <Clock className="h-4 w-4" />
              <AlertDescription className="text-foreground">
                <strong>Daily limit reached!</strong> You've created {dailyCount}/{maxLimit} love sketches today.
                <br />
                <span className="text-sm text-muted-foreground">
                  Reset at midnight ({getResetTime().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </span>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Daily sketches: {dailyCount}/{maxLimit}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {remainingAttempts} {remainingAttempts === 1 ? 'remaining' : 'remaining'}
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
                  <FormLabel className="text-foreground">General Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the special person you would like to visualize... Talk about the connection you feel, special moments, or simply how you imagine them..."
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
                    <FormLabel className="text-foreground">Physical Characteristics</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Eye color, hair, height, distinctive features..."
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
                    <FormLabel className="text-foreground">Personality and Energy</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Caring, adventurous, intellectual, spiritual..."
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
                  <FormLabel className="text-foreground">Artistic Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Choose the sketch style" />
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
                  Creating Mystical Sketch...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Love Sketch
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}