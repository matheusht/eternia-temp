import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "@/hooks/useTranslation";

interface LoveSketch {
  id: string;
  prompt_description: string;
  physical_traits: string;
  personality_traits: string;
  artistic_style: string;
  astrological_elements: string;
  image_url: string;
  interpretation: string;
  is_favorite: boolean;
  created_at: string;
}

export function LoveSketchGallery() {
  const { t } = useTranslation();
  const [sketches, setSketches] = useState<LoveSketch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSketch, setSelectedSketch] = useState<LoveSketch | null>(null);

  useEffect(() => {
    fetchSketches();
  }, []);

  const fetchSketches = async () => {
    try {
      const { data, error } = await supabase
        .from('love_sketches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSketches(data || []);
    } catch (error) {
      console.error('Error fetching sketches:', error);
      toast.error(t('loveSketch.errorLoading') || "Error loading gallery");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('love_sketches')
        .update({ is_favorite: !currentFavorite })
        .eq('id', id);

      if (error) throw error;
      
      setSketches(prev => 
        prev.map(sketch => 
          sketch.id === id 
            ? { ...sketch, is_favorite: !currentFavorite }
            : sketch
        )
      );
      
      toast.success(currentFavorite ? t('loveSketch.removedFromFavorites') : t('loveSketch.addedToFavorites'));
    } catch (error) {
      toast.error(t('loveSketch.errorUpdating') || "Error updating favorite");
    }
  };

  const deleteSketch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('love_sketches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSketches(prev => prev.filter(sketch => sketch.id !== id));
      toast.success(t('loveSketch.sketchDeleted'));
    } catch (error) {
      toast.error(t('loveSketch.errorDeleting') || "Error deleting sketch");
    }
  };

  const getStyleLabel = (style: string) => {
    return t(`loveSketch.styles.${style}`) || style;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-foreground text-lg">{t('loveSketch.loadingGallery')}</div>
      </div>
    );
  }

  if (sketches.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Heart className="h-16 w-16 text-primary/50 mb-4" />
          <h3 className="text-xl font-cinzel text-foreground mb-2">{t('loveSketch.emptyGallery')}</h3>
          <p className="text-foreground/70 text-center">
            {t('loveSketch.emptyGalleryDesc')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sketches.map((sketch) => (
          <Card key={sketch.id} className="bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={sketch.image_url}
                alt="Love Sketch"
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => setSelectedSketch(sketch)}
              />
              <Button
                size="sm"
                variant="ghost"
                className={`absolute top-2 right-2 p-2 ${
                  sketch.is_favorite 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-white/70 hover:text-white'
                }`}
                onClick={() => toggleFavorite(sketch.id, sketch.is_favorite)}
              >
                <Heart className={`h-4 w-4 ${sketch.is_favorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  {getStyleLabel(sketch.artistic_style)}
                </Badge>
                <span className="text-xs text-foreground/60">
                  {new Date(sketch.created_at).toLocaleDateString('en-US')}
                </span>
              </div>
              
              <p className="text-sm text-foreground/80 line-clamp-2 mb-3">
                {sketch.prompt_description}
              </p>
              
              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedSketch(sketch)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  {t('loveSketch.view')}
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('loveSketch.deleteSketch')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('loveSketch.deleteConfirm')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('loveSketch.cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteSketch(sketch.id)}>
                        {t('loveSketch.delete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedSketch} onOpenChange={() => setSelectedSketch(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-2xl">{t('loveSketch.title')}</DialogTitle>
          </DialogHeader>
          
          {selectedSketch && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <img
                  src={selectedSketch.image_url}
                  alt="Love Sketch"
                  className="rounded-lg shadow-lg max-w-md w-full"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{t('loveSketch.description')}</h4>
                  <p className="text-foreground/80 text-sm">{selectedSketch.prompt_description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{t('loveSketch.physicalCharacteristics')}</h4>
                  <p className="text-foreground/80 text-sm">{selectedSketch.physical_traits}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{t('loveSketch.personality')}</h4>
                  <p className="text-foreground/80 text-sm">{selectedSketch.personality_traits}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{t('loveSketch.astrologicalElements')}</h4>
                  <p className="text-foreground/80 text-sm">{selectedSketch.astrological_elements}</p>
                </div>
              </div>
              
              {selectedSketch.interpretation && (
                <div className="bg-primary/10 rounded-lg p-4">
                  <h4 className="font-cinzel text-lg text-foreground mb-2">{t('loveSketch.mysticalInterpretation')}</h4>
                  <p className="text-foreground/80 leading-relaxed">{selectedSketch.interpretation}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}