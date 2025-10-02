-- Modificar a coluna goal para suportar múltiplos objetivos como string separada por vírgulas
ALTER TABLE public.profiles 
ALTER COLUMN goal TYPE text;