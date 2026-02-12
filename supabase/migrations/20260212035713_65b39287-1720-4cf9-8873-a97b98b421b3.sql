
-- Rename college to college_school
ALTER TABLE public.registrations RENAME COLUMN college TO college_school;

-- Remove payment columns
ALTER TABLE public.registrations DROP COLUMN IF EXISTS payment_status;
ALTER TABLE public.registrations DROP COLUMN IF EXISTS payment_id;
ALTER TABLE public.registrations DROP COLUMN IF EXISTS amount;

-- Add status column with default 'Registered'
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'Registered';
