
-- Fix: Remove recursive policy on profiles
DROP POLICY IF EXISTS "Company members can view each other" ON public.profiles;

-- Create security definer function to get company_id safely
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
$$;

-- Re-create policy using security definer function
CREATE POLICY "Company members can view each other"
  ON public.profiles FOR SELECT
  USING (company_id = public.get_user_company_id());

-- =====================================================
-- USER ROLES TABLE (for proper access control)
-- =====================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'team_lead', 'cleaner');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
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

CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
  )
$$;

-- Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own initial role"
  ON public.user_roles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage roles in company"
  ON public.user_roles FOR ALL
  USING (public.is_admin_or_manager());
