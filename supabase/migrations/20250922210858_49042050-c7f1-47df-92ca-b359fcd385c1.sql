-- Update user levels from Portuguese to English
UPDATE public.profiles 
SET current_level = CASE 
  WHEN current_level = 'Mestre' THEN 'Master'
  WHEN current_level = 'Aprendiz' THEN 'Apprentice' 
  WHEN current_level = 'Iniciado' THEN 'Initiate'
  ELSE current_level
END
WHERE current_level IN ('Mestre', 'Aprendiz', 'Iniciado');

-- Update default value for new users
ALTER TABLE public.profiles 
ALTER COLUMN current_level SET DEFAULT 'Apprentice';