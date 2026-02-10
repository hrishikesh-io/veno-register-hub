
-- Create registrations table
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reg_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  selected_events JSONB NOT NULL DEFAULT '[]'::jsonb,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  amount NUMERIC NOT NULL DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unique constraint on email
CREATE UNIQUE INDEX idx_registrations_email ON public.registrations (email);

-- Index on selected_events for fast filtering
CREATE INDEX idx_registrations_events ON public.registrations USING GIN (selected_events);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: Anyone can insert registrations (public form)
CREATE POLICY "Anyone can register"
  ON public.registrations FOR INSERT
  WITH CHECK (true);

-- RLS: Only admin can view registrations
CREATE POLICY "Admin can view all registrations"
  ON public.registrations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS: Only admin can update registrations
CREATE POLICY "Admin can update registrations"
  ON public.registrations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS: Only admin can delete registrations
CREATE POLICY "Admin can delete registrations"
  ON public.registrations FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS for user_roles: only admin can view
CREATE POLICY "Admin can view roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to generate next registration ID
CREATE OR REPLACE FUNCTION public.generate_reg_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(reg_id FROM 9) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.registrations;
  NEW.reg_id := 'VEN2026-' || LPAD(next_num::TEXT, 3, '0');
  RETURN NEW;
END;
$$;

-- Trigger to auto-generate reg_id
CREATE TRIGGER set_reg_id
  BEFORE INSERT ON public.registrations
  FOR EACH ROW
  WHEN (NEW.reg_id IS NULL OR NEW.reg_id = '')
  EXECUTE FUNCTION public.generate_reg_id();
