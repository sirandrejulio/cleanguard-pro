
-- =============================================
-- CORE TABLES: customers, teams, team_members, jobs
-- =============================================

-- CUSTOMERS TABLE
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  full_name varchar NOT NULL,
  email varchar,
  phone varchar,
  property_address text,
  property_city varchar,
  property_state varchar(2),
  property_zip varchar(10),
  property_sqft integer,
  property_type varchar DEFAULT 'residential',
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_customers_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view customers in own company"
  ON public.customers FOR SELECT
  USING (company_id = public.get_user_company_id());

CREATE POLICY "Admins/managers can insert customers"
  ON public.customers FOR INSERT
  WITH CHECK (company_id = public.get_user_company_id() AND public.is_admin_or_manager());

CREATE POLICY "Admins/managers can update customers"
  ON public.customers FOR UPDATE
  USING (company_id = public.get_user_company_id() AND public.is_admin_or_manager());

CREATE POLICY "Admins can delete customers"
  ON public.customers FOR DELETE
  USING (company_id = public.get_user_company_id() AND public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_customers_company ON public.customers(company_id);
CREATE INDEX idx_customers_active ON public.customers(company_id, is_active);

-- TEAMS TABLE
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  name varchar NOT NULL,
  color varchar(7) DEFAULT '#EF4444',
  max_jobs_per_day integer DEFAULT 8,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_teams_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view teams in own company"
  ON public.teams FOR SELECT
  USING (company_id = public.get_user_company_id());

CREATE POLICY "Admins/managers can insert teams"
  ON public.teams FOR INSERT
  WITH CHECK (company_id = public.get_user_company_id() AND public.is_admin_or_manager());

CREATE POLICY "Admins/managers can update teams"
  ON public.teams FOR UPDATE
  USING (company_id = public.get_user_company_id() AND public.is_admin_or_manager());

CREATE POLICY "Admins can delete teams"
  ON public.teams FOR DELETE
  USING (company_id = public.get_user_company_id() AND public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_teams_company ON public.teams(company_id);

-- TEAM_MEMBERS TABLE
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL,
  user_id uuid NOT NULL,
  is_leader boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_team_members_team FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE,
  CONSTRAINT uq_team_member UNIQUE(team_id, user_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view team members in own company"
  ON public.team_members FOR SELECT
  USING (
    team_id IN (SELECT id FROM public.teams WHERE company_id = public.get_user_company_id())
  );

CREATE POLICY "Admins/managers can insert team members"
  ON public.team_members FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM public.teams WHERE company_id = public.get_user_company_id())
    AND public.is_admin_or_manager()
  );

CREATE POLICY "Admins/managers can update team members"
  ON public.team_members FOR UPDATE
  USING (
    team_id IN (SELECT id FROM public.teams WHERE company_id = public.get_user_company_id())
    AND public.is_admin_or_manager()
  );

CREATE POLICY "Admins can delete team members"
  ON public.team_members FOR DELETE
  USING (
    team_id IN (SELECT id FROM public.teams WHERE company_id = public.get_user_company_id())
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE INDEX idx_team_members_team ON public.team_members(team_id);
CREATE INDEX idx_team_members_user ON public.team_members(user_id);

-- JOBS TABLE
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  team_id uuid,
  assigned_to uuid,
  job_number varchar NOT NULL,
  status varchar NOT NULL DEFAULT 'scheduled',
  service_type varchar NOT NULL DEFAULT 'standard_clean',
  scheduled_date date NOT NULL,
  scheduled_time_start time,
  scheduled_time_end time,
  actual_start timestamptz,
  actual_end timestamptz,
  estimated_duration_minutes integer DEFAULT 120,
  quoted_price numeric(10,2),
  final_price numeric(10,2),
  notes text,
  internal_notes text,
  is_recurring boolean DEFAULT false,
  priority integer DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_jobs_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE,
  CONSTRAINT fk_jobs_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE,
  CONSTRAINT fk_jobs_team FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view jobs in own company"
  ON public.jobs FOR SELECT
  USING (company_id = public.get_user_company_id());

CREATE POLICY "Admins/managers can insert jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (company_id = public.get_user_company_id() AND public.is_admin_or_manager());

CREATE POLICY "Admins/managers can update jobs"
  ON public.jobs FOR UPDATE
  USING (company_id = public.get_user_company_id() AND public.is_admin_or_manager());

CREATE POLICY "Admins can delete jobs"
  ON public.jobs FOR DELETE
  USING (company_id = public.get_user_company_id() AND public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_jobs_company_status ON public.jobs(company_id, status);
CREATE INDEX idx_jobs_scheduled ON public.jobs(company_id, scheduled_date);
CREATE INDEX idx_jobs_customer ON public.jobs(customer_id);
CREATE INDEX idx_jobs_team ON public.jobs(team_id);
CREATE INDEX idx_jobs_assigned ON public.jobs(assigned_to);

-- Function to generate job numbers
CREATE OR REPLACE FUNCTION public.generate_job_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num integer;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(job_number FROM 4) AS integer)), 0) + 1
  INTO next_num
  FROM public.jobs
  WHERE company_id = NEW.company_id;
  
  NEW.job_number := 'JOB' || LPAD(next_num::text, 5, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER generate_job_number_trigger
  BEFORE INSERT ON public.jobs
  FOR EACH ROW
  WHEN (NEW.job_number = '' OR NEW.job_number IS NULL)
  EXECUTE FUNCTION public.generate_job_number();
