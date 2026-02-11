
-- Add departments_selected column
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS departments_selected jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Add total_events column
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS total_events integer NOT NULL DEFAULT 0;

-- Change default payment_status to 'registered'
ALTER TABLE public.registrations ALTER COLUMN payment_status SET DEFAULT 'registered';

-- Make payment-related columns optional
ALTER TABLE public.registrations ALTER COLUMN amount SET DEFAULT 0;
ALTER TABLE public.registrations ALTER COLUMN gender SET DEFAULT 'Not specified';
ALTER TABLE public.registrations ALTER COLUMN gender DROP NOT NULL;

-- Create unique index on email to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_email_unique ON public.registrations (email);
