-- Create profiles table with user data and progress
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  birth_date DATE NOT NULL,
  birth_time TIME NOT NULL,
  birth_location TEXT NOT NULL,
  goal TEXT NOT NULL CHECK (goal IN ('autoconhecimento', 'amor', 'prosperidade', 'espiritualidade')),
  total_points INTEGER DEFAULT 0,
  current_level TEXT DEFAULT 'Aprendiz',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_activities table for tracking gamification
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('ia_consulta', 'registro_diario', 'visita_diaria', 'ritual_completado')),
  points_earned INTEGER DEFAULT 1,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create diary_entries table
CREATE TABLE public.diary_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('sonho', 'sentimento', 'insight', 'experiencia')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  ai_analysis TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily_practices table
CREATE TABLE public.daily_practices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_type TEXT NOT NULL,
  practice_title TEXT NOT NULL,
  practice_description TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  practice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_practices ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for user_activities
CREATE POLICY "Users can view their own activities" 
ON public.user_activities FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities" 
ON public.user_activities FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for diary_entries
CREATE POLICY "Users can view their own diary entries" 
ON public.diary_entries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diary entries" 
ON public.diary_entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diary entries" 
ON public.diary_entries FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diary entries" 
ON public.diary_entries FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for daily_practices
CREATE POLICY "Users can view their own practices" 
ON public.daily_practices FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own practices" 
ON public.daily_practices FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own practices" 
ON public.daily_practices FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update user level based on points
CREATE OR REPLACE FUNCTION public.update_user_level(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_points INTEGER;
  new_level TEXT;
BEGIN
  -- Get total points for user
  SELECT COALESCE(SUM(points_earned), 0) INTO user_points
  FROM public.user_activities
  WHERE user_id = user_uuid;
  
  -- Determine level based on points
  IF user_points <= 10 THEN
    new_level := 'Aprendiz';
  ELSIF user_points <= 40 THEN
    new_level := 'Iniciado';
  ELSIF user_points <= 100 THEN
    new_level := 'Sábio';
  ELSE
    new_level := 'Mestre';
  END IF;
  
  -- Update user profile
  UPDATE public.profiles 
  SET total_points = user_points, current_level = new_level
  WHERE user_id = user_uuid;
  
  RETURN new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'Usuário'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();