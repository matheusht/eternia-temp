-- Remove the check constraint that prevents multiple goals
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_goal_check;