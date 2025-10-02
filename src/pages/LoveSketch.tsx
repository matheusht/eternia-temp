import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { AppLayout } from "@/components/AppLayout";
import { LoveSketchForm } from "@/components/love-sketch/LoveSketchForm";
import { LoveSketchGallery } from "@/components/love-sketch/LoveSketchGallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Palette } from "lucide-react";

const LoveSketch = () => {
  const { user } = useAuth();
  const { profile } = useUserData();
  const navigate = useNavigate();
  const [refreshGallery, setRefreshGallery] = useState(0);

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-mystic flex items-center justify-center">
        <div className="text-foreground text-xl font-cinzel">Loading cosmic energies...</div>
      </div>
    );
  }

  const handleSketchGenerated = () => {
    setRefreshGallery(prev => prev + 1);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cinzel text-foreground mb-4 flex items-center justify-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            Love Sketch
            <Palette className="h-8 w-8 text-primary" />
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Visualize your special connection through artificial intelligence. 
            Create a mystical portrait of the person who inhabits your thoughts and dreams.
          </p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Create Sketch
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              My Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <LoveSketchForm 
              userProfile={profile} 
              onSketchGenerated={handleSketchGenerated}
            />
          </TabsContent>

          <TabsContent value="gallery">
            <LoveSketchGallery key={refreshGallery} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default LoveSketch;