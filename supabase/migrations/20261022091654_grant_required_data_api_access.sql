-- Keep Data API table access explicit; RLS still controls which rows each role can use.
grant usage on schema public to anon, authenticated;

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

grant select, insert, update, delete on table
  public.admin_profiles,
  public.business_settings,
  public.business_hours,
  public.service_categories,
  public.services,
  public.coverage_areas,
  public.gallery_images,
  public.announcements,
  public.site_sections,
  public.analytics_events
to authenticated;
