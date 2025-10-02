-- Add new columns to profiles table for expanded onboarding
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS marital_status text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests text[] DEFAULT ARRAY[]::text[];

-- Update the goal column to support multiple goals (convert existing single goal to array if needed)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS goals text[] DEFAULT ARRAY[]::text[];

-- Create index for better performance on interests array
CREATE INDEX IF NOT EXISTS idx_profiles_interests ON public.profiles USING GIN(interests);
CREATE INDEX IF NOT EXISTS idx_profiles_goals ON public.profiles USING GIN(goals);