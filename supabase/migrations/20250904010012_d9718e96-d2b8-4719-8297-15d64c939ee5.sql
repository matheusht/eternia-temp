-- Fix diary_entries table constraint to accept English values
ALTER TABLE public.diary_entries DROP CONSTRAINT IF EXISTS diary_entries_type_check;
ALTER TABLE public.diary_entries ADD CONSTRAINT diary_entries_type_check 
CHECK (type IN ('dream', 'feeling', 'insight', 'experience'));