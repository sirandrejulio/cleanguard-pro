
-- =====================================================
-- CORE AUTH TABLES: companies + profiles
-- =====================================================

-- Companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  owner_id UUID NOT NULL,
  phone VARCHAR(20),
  business_address TEXT,
  
  -- Subscription
  subscription_tier VARCHAR(50) DEFAULT 'trial',
  subscription_status VARCHAR(50) DEFAULT 'active',
  
  -- Features enabled
  shield_enabled BOOLEAN DEFAULT true,
  route_enabled BOOLEAN DEFAULT true,
  fill_enabled BOOLEAN DEFAULT true,
  
  -- Settings
  default_currency VARCHAR(3) DEFAULT 'USD',
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX idx_companies_owner_id ON public.companies(owner_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Companies: owner can do everything
CREATE POLICY "Users can view own company"
  ON public.companies FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can create company on signup"
  ON public.companies FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own company"
  ON public.companies FOR UPDATE
  USING (owner_id = auth.uid());

-- Profiles: user can manage own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Profiles: users in same company can view each other
CREATE POLICY "Company members can view each other"
  ON public.profiles FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
