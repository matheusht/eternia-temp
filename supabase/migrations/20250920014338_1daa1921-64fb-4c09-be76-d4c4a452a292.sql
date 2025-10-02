-- Create tarot readings table
CREATE TABLE public.tarot_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spread_type TEXT NOT NULL CHECK (spread_type IN ('three-card', 'celtic-cross', 'love', 'career')),
  cards JSONB NOT NULL,
  interpretation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tarot_readings ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own tarot readings" 
ON public.tarot_readings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tarot readings" 
ON public.tarot_readings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tarot readings" 
ON public.tarot_readings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tarot readings" 
ON public.tarot_readings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tarot_readings_updated_at
BEFORE UPDATE ON public.tarot_readings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();