
-- ============================================
-- FASE 1B: FUNCTIONS, TABELAS E RLS
-- ============================================

-- 1. FUNÇÃO is_owner()
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'owner'
  )
$$;

-- 2. FUNÇÃO get_user_role()
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY 
    CASE role 
      WHEN 'owner' THEN 0 
      WHEN 'admin' THEN 1 
      WHEN 'manager' THEN 2 
      WHEN 'team_lead' THEN 3 
      WHEN 'cleaner' THEN 4 
    END
  LIMIT 1
$$;

-- ============================================
-- 3. TABELA: gps_verifications
-- ============================================
CREATE TABLE IF NOT EXISTS public.gps_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    verification_type VARCHAR NOT NULL DEFAULT 'check_in',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy_meters DOUBLE PRECISION,
    distance_to_job_meters DOUBLE PRECISION,
    is_valid BOOLEAN DEFAULT true,
    validation_flags TEXT[],
    device_info JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gps_company ON public.gps_verifications(company_id);
CREATE INDEX IF NOT EXISTS idx_gps_job ON public.gps_verifications(job_id);
CREATE INDEX IF NOT EXISTS idx_gps_user ON public.gps_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_gps_created ON public.gps_verifications(created_at);

ALTER TABLE public.gps_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gps_select_own_company" ON public.gps_verifications FOR SELECT
USING (company_id = get_user_company_id() OR is_owner());

CREATE POLICY "gps_insert_own_company" ON public.gps_verifications FOR INSERT
WITH CHECK (company_id = get_user_company_id() AND user_id = auth.uid());

CREATE POLICY "gps_update_admin_manager" ON public.gps_verifications FOR UPDATE
USING (company_id = get_user_company_id() AND is_admin_or_manager());

CREATE POLICY "gps_delete_admin" ON public.gps_verifications FOR DELETE
USING (company_id = get_user_company_id() AND has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 4. TABELA: routes
-- ============================================
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id),
    name VARCHAR NOT NULL,
    route_date DATE NOT NULL,
    is_optimized BOOLEAN DEFAULT false,
    optimization_algorithm VARCHAR,
    estimated_duration_minutes INTEGER,
    estimated_distance_miles NUMERIC(10, 2),
    estimated_fuel_cost_cents INTEGER,
    actual_duration_minutes INTEGER,
    actual_distance_miles NUMERIC(10, 2),
    actual_fuel_cost_cents INTEGER,
    job_ids UUID[] NOT NULL DEFAULT '{}',
    job_order INTEGER[] DEFAULT '{}',
    status VARCHAR NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_routes_company ON public.routes(company_id);
CREATE INDEX IF NOT EXISTS idx_routes_team ON public.routes(team_id);
CREATE INDEX IF NOT EXISTS idx_routes_date ON public.routes(route_date);
CREATE INDEX IF NOT EXISTS idx_routes_status ON public.routes(status);

ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "routes_select_own_company" ON public.routes FOR SELECT
USING (company_id = get_user_company_id() OR is_owner());

CREATE POLICY "routes_insert_admin_manager" ON public.routes FOR INSERT
WITH CHECK (company_id = get_user_company_id() AND is_admin_or_manager());

CREATE POLICY "routes_update_admin_manager" ON public.routes FOR UPDATE
USING (company_id = get_user_company_id() AND is_admin_or_manager());

CREATE POLICY "routes_delete_admin" ON public.routes FOR DELETE
USING (company_id = get_user_company_id() AND has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_routes_updated_at
    BEFORE UPDATE ON public.routes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 5. TABELA: marketplace_listings
-- ============================================
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id),
    title VARCHAR NOT NULL,
    description TEXT,
    listing_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    base_price_cents INTEGER NOT NULL DEFAULT 0,
    current_price_cents INTEGER NOT NULL DEFAULT 0,
    dynamic_pricing_enabled BOOLEAN DEFAULT true,
    status VARCHAR NOT NULL DEFAULT 'active',
    filled_by UUID,
    filled_at TIMESTAMPTZ,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_marketplace_company ON public.marketplace_listings(company_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_job ON public.marketplace_listings(job_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON public.marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_date ON public.marketplace_listings(listing_date);

ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "marketplace_select_authenticated" ON public.marketplace_listings FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "marketplace_insert_admin_manager" ON public.marketplace_listings FOR INSERT
WITH CHECK (company_id = get_user_company_id() AND is_admin_or_manager());

CREATE POLICY "marketplace_update_own_company" ON public.marketplace_listings FOR UPDATE
USING (company_id = get_user_company_id() AND is_admin_or_manager());

CREATE POLICY "marketplace_delete_admin" ON public.marketplace_listings FOR DELETE
USING (company_id = get_user_company_id() AND has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_marketplace_updated_at
    BEFORE UPDATE ON public.marketplace_listings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 6. TABELA: analytics_events
-- ============================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID,
    event_name VARCHAR NOT NULL,
    event_category VARCHAR NOT NULL,
    event_data JSONB,
    page_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_company ON public.analytics_events(company_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analytics_select_own_company" ON public.analytics_events FOR SELECT
USING (company_id = get_user_company_id() AND (is_admin_or_manager() OR is_owner()));

CREATE POLICY "analytics_insert_authenticated" ON public.analytics_events FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "analytics_delete_admin" ON public.analytics_events FOR DELETE
USING (company_id = get_user_company_id() AND has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 7. OWNER POLICIES NAS TABELAS EXISTENTES
-- ============================================
CREATE POLICY "owner_view_all_companies" ON public.companies FOR SELECT USING (is_owner());
CREATE POLICY "owner_update_any_company" ON public.companies FOR UPDATE USING (is_owner());
CREATE POLICY "owner_view_all_profiles" ON public.profiles FOR SELECT USING (is_owner());
CREATE POLICY "owner_view_all_jobs" ON public.jobs FOR SELECT USING (is_owner());
CREATE POLICY "owner_view_all_teams" ON public.teams FOR SELECT USING (is_owner());
CREATE POLICY "owner_view_all_customers" ON public.customers FOR SELECT USING (is_owner());
CREATE POLICY "owner_view_all_disputes" ON public.disputes FOR SELECT USING (is_owner());
CREATE POLICY "owner_view_all_evidence" ON public.evidence_uploads FOR SELECT USING (is_owner());
CREATE POLICY "owner_view_all_timesheets" ON public.timesheets FOR SELECT USING (is_owner());
CREATE POLICY "owner_view_all_team_members" ON public.team_members FOR SELECT USING (is_owner());
