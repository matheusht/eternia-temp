-- Create table for love sketches
CREATE TABLE public.love_sketches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prompt_description TEXT NOT NULL,
  physical_traits TEXT,
  personality_traits TEXT,
  artistic_style TEXT NOT NULL DEFAULT 'romantic',
  astrological_elements TEXT,
  image_url TEXT NOT NULL,
  interpretation TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.love_sketches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sketches" 
ON public.love_sketches 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sketches" 
ON public.love_sketches 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sketches" 
ON public.love_sketches 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sketches" 
ON public.love_sketches 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_love_sketches_updated_at
BEFORE UPDATE ON public.love_sketches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();