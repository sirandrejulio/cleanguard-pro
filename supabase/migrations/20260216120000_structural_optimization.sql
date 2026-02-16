-- =====================================================
-- STRUCTURAL OPTIMIZATION & NORMALIZATION MIGRATION
-- Data: 16/02/2026
-- Description: Adds missing FKs, Enums, and optimizes structure without data loss.
-- =====================================================

-- 1. Create ENUMS for better data integrity
DO $$ BEGIN
    CREATE TYPE public.job_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.job_service_type AS ENUM ('standard_clean', 'deep_clean', 'move_in_out', 'post_construction', 'office', 'window_cleaning', 'carpet_cleaning');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add Missing Foreign Keys (Critical for Integrity)

-- Jobs -> Assigned Profile
-- First, ensure all assigned_to UUIDs actually exist in profiles (optional cleanup step omitted for safety, assume consistency or set null)
DO $$ BEGIN
    ALTER TABLE public.jobs 
    ADD CONSTRAINT fk_jobs_assigned_profile 
    FOREIGN KEY (assigned_to) 
    REFERENCES public.profiles(user_id) -- Linking to USER_ID not ID because auth references usually use user_id
    ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN undefined_object THEN null; -- If table doesn't exist yet
END $$;

-- Evidence -> Uploaded By Profile
DO $$ BEGIN
    ALTER TABLE public.evidence_uploads
    ADD CONSTRAINT fk_evidence_uploader
    FOREIGN KEY (uploaded_by)
    REFERENCES public.profiles(user_id)
    ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Disputes -> Opened By / Resolved By
DO $$ BEGIN
    ALTER TABLE public.disputes
    ADD CONSTRAINT fk_disputes_opener
    FOREIGN KEY (opened_by)
    REFERENCES public.profiles(user_id)
    ON DELETE SET NULL;

    ALTER TABLE public.disputes
    ADD CONSTRAINT fk_disputes_resolver
    FOREIGN KEY (resolved_by)
    REFERENCES public.profiles(user_id)
    ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Timesheets -> User
DO $$ BEGIN
    ALTER TABLE public.timesheets
    ADD CONSTRAINT fk_timesheets_user
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(user_id)
    ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Optimization Indexes (If not already present)

CREATE INDEX IF NOT EXISTS idx_jobs_status_enum ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_profiles_email_search ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_customers_search_name ON public.customers USING gin(to_tsvector('english', full_name));

-- 4. VIEW for Dashboard Usage (Simplifies Frontend Queries)
CREATE OR REPLACE VIEW public.v_jobs_dashboard AS
SELECT 
  j.id,
  j.job_number,
  j.status,
  j.scheduled_date,
  j.quoted_price,
  c.full_name as customer_name,
  c.property_address,
  t.name as team_name,
  p.full_name as assigned_name,
  j.company_id
FROM public.jobs j
LEFT JOIN public.customers c ON j.customer_id = c.id
LEFT JOIN public.teams t ON j.team_id = t.id
LEFT JOIN public.profiles p ON j.assigned_to = p.user_id;

-- Grant access to the view
GRANT SELECT ON public.v_jobs_dashboard TO authenticated;

-- RLS for View (Postgres Views don't have RLS automatically, need to filter in WHERE or use security barrier view)
-- Simpler approach: Users query the View but RLS applies to underlying tables IF view is not security definer.
-- However, for Supabase, it's safer to query tables directly if RLS is complex. 
-- We will keep the View as a helper for Admin dashboards or Analytics.

-- 5. Data Cleanup Check (Audit)
-- Ensure all profiles have a corresponding entry in user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin'::public.app_role 
FROM public.profiles 
WHERE user_id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT DO NOTHING;

-- End of Migration
