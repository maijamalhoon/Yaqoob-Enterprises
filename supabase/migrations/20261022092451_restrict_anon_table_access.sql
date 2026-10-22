revoke all on table
  public.admin_profiles,
  public.business_settings,
  public.business_hours,
  public.service_categories,
  public.services,
  public.coverage_areas,
  public.gallery_images,
  public.announcements,
  public.site_sections,
  public.analytics_events,
  public.admin_audit_log,
  public.admin_snapshots
from anon, public;

grant select on table
  public.business_settings,
  public.business_hours,
  public.service_categories,
  public.services,
  public.coverage_areas,
  public.gallery_images,
  public.announcements,
  public.site_sections
to anon;

grant insert on table public.analytics_events to anon;
