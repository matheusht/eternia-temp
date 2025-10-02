-- Update the level function to use English level names
CREATE OR REPLACE FUNCTION public.update_user_level(user_uuid uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_points INTEGER;
  new_level TEXT;
BEGIN
  -- Get total points for user
  SELECT COALESCE(SUM(points_earned), 0) INTO user_points
  FROM public.user_activities
  WHERE user_id = user_uuid;
  
  -- Determine level based on points (now in English)
  IF user_points <= 10 THEN
    new_level := 'Apprentice';
  ELSIF user_points <= 40 THEN
    new_level := 'Initiate';
  ELSIF user_points <= 100 THEN
    new_level := 'Sage';
  ELSE
    new_level := 'Master';
  END IF;
  
  -- Update user profile
  UPDATE public.profiles 
  SET total_points = user_points, current_level = new_level
  WHERE user_id = user_uuid;
  
  RETURN new_level;
END;
$function$;

-- Update the new user function to use English default level
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, total_points, current_level)
  VALUES (NEW.id, 0, 'Apprentice');
  RETURN NEW;
END;
$function$;