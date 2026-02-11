
-- Drop broken restrictive policies
DROP POLICY IF EXISTS "Anyone can register" ON public.registrations;
DROP POLICY IF EXISTS "Admin can view all registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admin can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admin can delete registrations" ON public.registrations;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Anyone can register"
ON public.registrations FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admin can view all registrations"
ON public.registrations FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update registrations"
ON public.registrations FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete registrations"
ON public.registrations FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
