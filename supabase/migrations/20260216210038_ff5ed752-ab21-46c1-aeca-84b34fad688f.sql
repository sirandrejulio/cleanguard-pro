
-- Fix SECURITY DEFINER view issue (linter ERROR)
-- Recreate v_jobs_dashboard as SECURITY INVOKER so RLS is enforced for the querying user
DROP VIEW IF EXISTS public.v_jobs_dashboard;

CREATE VIEW public.v_jobs_dashboard
WITH (security_invoker = true)
AS
SELECT 
  j.id,
  j.job_number,
  j.status,
  j.scheduled_date,
  j.quoted_price,
  c.full_name AS customer_name,
  c.property_address,
  t.name AS team_name,
  p.full_name AS assigned_name,
  j.company_id
FROM jobs j
LEFT JOIN customers c ON j.customer_id = c.id
LEFT JOIN teams t ON j.team_id = t.id
LEFT JOIN profiles p ON j.assigned_to = p.user_id;
