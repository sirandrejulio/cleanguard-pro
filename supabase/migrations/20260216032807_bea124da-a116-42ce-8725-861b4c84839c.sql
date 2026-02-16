
-- ==========================================
-- SHIELD MODULE TABLES
-- ==========================================

-- 1. Evidence Uploads (photos/videos of completed work)
CREATE TABLE public.evidence_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  job_id UUID NOT NULL,
  uploaded_by UUID NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR NOT NULL DEFAULT 'photo',
  thumbnail_url TEXT,
  caption TEXT,
  taken_at TIMESTAMPTZ,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_evidence_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE,
  CONSTRAINT fk_evidence_job FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE
);

ALTER TABLE public.evidence_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view evidence in own company"
  ON public.evidence_uploads FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can upload evidence in own company"
  ON public.evidence_uploads FOR INSERT
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Admins can delete evidence"
  ON public.evidence_uploads FOR DELETE
  USING (company_id = get_user_company_id() AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins/managers can update evidence"
  ON public.evidence_uploads FOR UPDATE
  USING (company_id = get_user_company_id() AND is_admin_or_manager());

CREATE INDEX idx_evidence_job ON public.evidence_uploads(job_id);
CREATE INDEX idx_evidence_company ON public.evidence_uploads(company_id);

CREATE TRIGGER update_evidence_uploads_updated_at
  BEFORE UPDATE ON public.evidence_uploads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Disputes
CREATE TABLE public.disputes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  job_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  opened_by UUID NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR NOT NULL DEFAULT 'open',
  priority VARCHAR NOT NULL DEFAULT 'medium',
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_disputes_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE,
  CONSTRAINT fk_disputes_job FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE,
  CONSTRAINT fk_disputes_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE
);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view disputes in own company"
  ON public.disputes FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Admins/managers can insert disputes"
  ON public.disputes FOR INSERT
  WITH CHECK (company_id = get_user_company_id() AND is_admin_or_manager());

CREATE POLICY "Admins/managers can update disputes"
  ON public.disputes FOR UPDATE
  USING (company_id = get_user_company_id() AND is_admin_or_manager());

CREATE POLICY "Admins can delete disputes"
  ON public.disputes FOR DELETE
  USING (company_id = get_user_company_id() AND has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_disputes_company ON public.disputes(company_id);
CREATE INDEX idx_disputes_job ON public.disputes(job_id);
CREATE INDEX idx_disputes_status ON public.disputes(status);

CREATE TRIGGER update_disputes_updated_at
  BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Timesheets (GPS-verified check-in/out)
CREATE TABLE public.timesheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  job_id UUID NOT NULL,
  user_id UUID NOT NULL,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  check_in_lat DOUBLE PRECISION,
  check_in_lng DOUBLE PRECISION,
  check_out_lat DOUBLE PRECISION,
  check_out_lng DOUBLE PRECISION,
  total_minutes INTEGER,
  notes TEXT,
  status VARCHAR NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_timesheets_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE,
  CONSTRAINT fk_timesheets_job FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE
);

ALTER TABLE public.timesheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view timesheets in own company"
  ON public.timesheets FOR SELECT
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert own timesheets"
  ON public.timesheets FOR INSERT
  WITH CHECK (company_id = get_user_company_id() AND user_id = auth.uid());

CREATE POLICY "Users can update own active timesheets"
  ON public.timesheets FOR UPDATE
  USING (company_id = get_user_company_id() AND (user_id = auth.uid() OR is_admin_or_manager()));

CREATE POLICY "Admins can delete timesheets"
  ON public.timesheets FOR DELETE
  USING (company_id = get_user_company_id() AND has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_timesheets_company ON public.timesheets(company_id);
CREATE INDEX idx_timesheets_job ON public.timesheets(job_id);
CREATE INDEX idx_timesheets_user ON public.timesheets(user_id);

CREATE TRIGGER update_timesheets_updated_at
  BEFORE UPDATE ON public.timesheets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Storage bucket for evidence files
INSERT INTO storage.buckets (id, name, public) VALUES ('evidence', 'evidence', true);

CREATE POLICY "Users can upload evidence files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'evidence' AND auth.uid() IS NOT NULL);

CREATE POLICY "Evidence files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'evidence');

CREATE POLICY "Admins can delete evidence files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'evidence' AND auth.uid() IS NOT NULL);
