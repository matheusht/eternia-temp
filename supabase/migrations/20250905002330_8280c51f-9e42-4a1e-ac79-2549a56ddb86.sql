-- Etapa 1: Corrigir a tabela profiles e função handle_new_user
-- Permitir que campos obrigatórios sejam nulos temporariamente até o onboarding
ALTER TABLE public.profiles ALTER COLUMN birth_date DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN birth_time DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN birth_location DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN goal DROP NOT NULL;

-- Atualizar a função handle_new_user para apenas criar o perfil básico
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, total_points, current_level)
  VALUES (NEW.id, 0, 'Aprendiz');
  RETURN NEW;
END;
$$;

-- Adicionar policy para DELETE na tabela diary_entries
CREATE POLICY "Users can delete their own diary entries" 
ON public.diary_entries 
FOR DELETE 
USING (auth.uid() = user_id);