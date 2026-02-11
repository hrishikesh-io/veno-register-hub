
-- Drop and recreate INSERT policy to explicitly target anon role
DROP POLICY IF EXISTS "Anyone can register" ON public.registrations;

CREATE POLICY "Anyone can register"
ON public.registrations FOR INSERT
TO anon, authenticated
WITH CHECK (true);
