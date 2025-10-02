-- Add English translations for database values
-- Update practice types to support both Portuguese and English
-- This will require updating existing data and adding new English options

-- First, let's check what practice types we currently have
-- Then we'll add English equivalents

-- Create a mapping table for practice types (bilingual support)
CREATE TABLE IF NOT EXISTS public.practice_type_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pt_value TEXT NOT NULL,
  en_value TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(pt_value),
  UNIQUE(en_value)
);

-- Enable RLS on translations table
ALTER TABLE public.practice_type_translations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all authenticated users
CREATE POLICY "Allow read access to practice translations" 
ON public.practice_type_translations 
FOR SELECT 
USING (true);

-- Insert common practice type translations
INSERT INTO public.practice_type_translations (pt_value, en_value, category) VALUES
('meditacao', 'meditation', 'mindfulness'),
('gratidao', 'gratitude', 'mindfulness'), 
('diario', 'journaling', 'reflection'),
('afirmacao', 'affirmation', 'mindfulness'),
('respiracao', 'breathwork', 'wellness'),
('visualizacao', 'visualization', 'mindfulness');

-- Create similar translation table for goals
CREATE TABLE IF NOT EXISTS public.goal_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pt_value TEXT NOT NULL,
  en_value TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(pt_value),
  UNIQUE(en_value)
);

-- Enable RLS on goal translations table
ALTER TABLE public.goal_translations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all authenticated users
CREATE POLICY "Allow read access to goal translations" 
ON public.goal_translations 
FOR SELECT 
USING (true);

-- Insert goal translations
INSERT INTO public.goal_translations (pt_value, en_value, category) VALUES
('autoconhecimento', 'self-knowledge', 'personal'),
('amor', 'love', 'relationships'),
('prosperidade', 'prosperity', 'abundance'),
('espiritualidade', 'spirituality', 'growth');

-- Create translation table for interests
CREATE TABLE IF NOT EXISTS public.interest_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pt_value TEXT NOT NULL,
  en_value TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(pt_value),
  UNIQUE(en_value)
);

-- Enable RLS on interest translations table
ALTER TABLE public.interest_translations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all authenticated users
CREATE POLICY "Allow read access to interest translations" 
ON public.interest_translations 
FOR SELECT 
USING (true);

-- Insert interest translations
INSERT INTO public.interest_translations (pt_value, en_value, category) VALUES
('astrologia', 'astrology', 'spiritual'),
('tarot', 'tarot', 'divination'),
('meditacao', 'meditation', 'mindfulness'),
('cristais', 'crystals', 'healing'),
('numerologia', 'numerology', 'divination'),
('feng_shui', 'feng_shui', 'harmony');

-- Add language preference to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS language_preference TEXT DEFAULT 'pt';

-- Create index for better performance on language queries
CREATE INDEX IF NOT EXISTS idx_profiles_language ON public.profiles(language_preference);

-- Add updated_at trigger to translation tables
CREATE TRIGGER update_practice_translations_updated_at
BEFORE UPDATE ON public.practice_type_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goal_translations_updated_at
BEFORE UPDATE ON public.goal_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interest_translations_updated_at
BEFORE UPDATE ON public.interest_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();