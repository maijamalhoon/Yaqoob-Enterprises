-- Remove table-maintenance and DDL privileges from Data API roles.
-- Row-level CRUD grants and policies are unchanged.
revoke truncate, references, trigger, maintain
  on all tables in schema public
  from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke truncate, references, trigger, maintain
  on tables from anon, authenticated;

-- The allowlist has no direct Data API grants. Its only application caller is
-- a SECURITY DEFINER function owned by postgres; the table is postgres-owned,
-- and FORCE ROW LEVEL SECURITY is disabled, so that function remains usable.
alter table app_private.admin_email_allowlist enable row level security;

-- Rollback (restores the pre-migration broad grants; use only after reviewing
-- the access risk and confirming the original privilege state is still wanted):
-- alter table app_private.admin_email_allowlist disable row level security;
-- grant truncate, references, trigger, maintain on table
--   public.admin_profiles,
--   public.analytics_events,
--   public.announcements,
--   public.business_hours,
--   public.business_settings,
--   public.coverage_areas,
--   public.gallery_images,
--   public.service_categories,
--   public.services,
--   public.site_sections
--   to authenticated;
-- alter default privileges for role postgres in schema public
--   grant truncate, references, trigger, maintain
--   on tables to anon, authenticated;
