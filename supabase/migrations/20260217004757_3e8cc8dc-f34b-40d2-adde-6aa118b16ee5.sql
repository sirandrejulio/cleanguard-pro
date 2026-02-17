
-- Create waitlist_entries table for tracking customers waiting for slots
CREATE TABLE public.waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id),
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  preferred_service_type VARCHAR NOT NULL DEFAULT 'standard_clean',
  preferred_date DATE,
  preferred_time_start TIME,
  preferred_time_end TIME,
  notes TEXT,
  status VARCHAR NOT NULL DEFAULT 'waiting',
  notified_at TIMESTAMPTZ,
  filled_at TIMESTAMPTZ,
  filled_job_id UUID REFERENCES public.jobs(id),
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "waitlist_select_own_company" ON public.waitlist_entries
  FOR SELECT USING (company_id = get_user_company_id() OR is_owner());

CREATE POLICY "waitlist_insert_admin_manager" ON public.waitlist_entries
  FOR INSERT WITH CHECK (company_id = get_user_company_id() AND is_admin_or_manager());

CREATE POLICY "waitlist_update_admin_manager" ON public.waitlist_entries
  FOR UPDATE USING (company_id = get_user_company_id() AND is_admin_or_manager());

CREATE POLICY "waitlist_delete_admin" ON public.waitlist_entries
  FOR DELETE USING (company_id = get_user_company_id() AND has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_waitlist_entries_updated_at
  BEFORE UPDATE ON public.waitlist_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Index for performance
CREATE INDEX idx_waitlist_company_status ON public.waitlist_entries(company_id, status);
