-- Limpar atividades duplicadas de visita diária (manter apenas uma por dia por usuário)
DELETE FROM user_activities 
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, DATE(completed_at), activity_type) id
  FROM user_activities 
  WHERE activity_type = 'visita_diaria'
  ORDER BY user_id, DATE(completed_at), activity_type, completed_at ASC
) AND activity_type = 'visita_diaria';

-- Atualizar a função handle_new_user para não inserir dados padrão
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;