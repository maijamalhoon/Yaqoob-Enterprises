alter function public.set_updated_at() set search_path = public, pg_temp;

create schema if not exists app_private;
revoke all on schema app_private from public, anon;
grant usage on schema app_private to authenticated;

create or replace function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admin_profiles
    where user_id = auth.uid()
  );
$$;

revoke all on function app_private.is_admin() from public, anon;
grant execute on function app_private.is_admin() to authenticated;

drop policy admin_profiles_owner_manage on public.admin_profiles;
create policy admin_profiles_owner_manage on public.admin_profiles for all to authenticated using (app_private.is_admin()) with check (app_private.is_admin());

drop policy public_read_business_settings on public.business_settings;
create policy anon_read_business_settings on public.business_settings for select to anon using (website_active);
create policy authenticated_read_business_settings on public.business_settings for select to authenticated using (website_active or app_private.is_admin());
drop policy admin_manage_business_settings on public.business_settings;
create policy admin_manage_business_settings on public.business_settings for all to authenticated using (app_private.is_admin()) with check (app_private.is_admin());

drop policy admin_manage_business_hours on public.business_hours;
create policy admin_manage_business_hours on public.business_hours for all to authenticated using (app_private.is_admin()) with check (app_private.is_admin());

drop policy public_read_categories on public.service_categories;
create policy anon_read_categories on public.service_categories for select to anon using (is_active);
create policy authenticated_read_categories on public.service_categories for select to authenticated using (is_active or app_private.is_admin());
drop policy admin_manage_categories on public.service_categories;
create policy admin_manage_categories on public.service_categories for all to authenticated using (app_private.is_admin()) with check (app_private.is_admin());

drop policy public_read_services on public.services;
create policy anon_read_services on public.services for select to anon using (status <> 'hidden' and exists (select 1 from public.service_categories c where c.id = category_id and c.is_active));
create policy authenticated_read_services on public.services for select to authenticated using ((status <> 'hidden' and exists (select 1 from public.service_categories c where c.id = category_id and c.is_active)) or app_private.is_admin());
drop policy admin_manage_services on public.services;
create policy admin_manage_services on public.services for all to authenticated using (app_private.is_admin()) with check (app_private.is_admin());

drop policy public_read_coverage on public.coverage_areas;
create policy anon_read_coverage on public.coverage_areas for select to anon using (is_active);
create policy authenticated_read_coverage on public.coverage_areas for select to authenticated using (is_active or app_private.is_admin());
drop policy admin_manage_coverage on public.coverage_areas;
create policy admin_manage_coverage on public.coverage_areas for all to authenticated using (app_private.is_admin()) with check (app_private.is_admin());

drop policy public_read_gallery on public.gallery_images;
create policy anon_read_gallery on public.gallery_images for select to anon using (is_active);
create policy authenticated_read_gallery on public.gallery_images for select to authenticated using (is_active or app_private.is_admin());
drop policy admin_manage_gallery on public.gallery_images;
create policy admin_manage_gallery on public.gallery_images for all to authenticated using (app_private.is_admin()) with check (app_private.is_admin());

drop policy public_read_announcements on public.announcements;
create policy anon_read_announcements on public.announcements for select to anon using (is_active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now()));
create policy authenticated_read_announcements on public.announcements for select to authenticated using ((is_active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now())) or app_private.is_admin());
drop policy admin_manage_announcements on public.announcements;
create policy admin_manage_announcements on public.announcements for all to authenticated using (app_private.is_admin()) with check (app_private.is_admin());

drop policy public_read_sections on public.site_sections;
create policy anon_read_sections on public.site_sections for select to anon using (is_active);
create policy authenticated_read_sections on public.site_sections for select to authenticated using (is_active or app_private.is_admin());
drop policy admin_manage_sections on public.site_sections;
create policy admin_manage_sections on public.site_sections for all to authenticated using (app_private.is_admin()) with check (app_private.is_admin());

drop policy admin_read_analytics on public.analytics_events;
create policy admin_read_analytics on public.analytics_events for select to authenticated using (app_private.is_admin());
drop policy admin_delete_analytics on public.analytics_events;
create policy admin_delete_analytics on public.analytics_events for delete to authenticated using (app_private.is_admin());

drop policy admin_insert_site_media on storage.objects;
create policy admin_insert_site_media on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and app_private.is_admin());
drop policy admin_update_site_media on storage.objects;
create policy admin_update_site_media on storage.objects for update to authenticated using (bucket_id = 'site-media' and app_private.is_admin()) with check (bucket_id = 'site-media' and app_private.is_admin());
drop policy admin_delete_site_media on storage.objects;
create policy admin_delete_site_media on storage.objects for delete to authenticated using (bucket_id = 'site-media' and app_private.is_admin());

revoke execute on function public.is_admin() from public, anon, authenticated;
drop function public.is_admin();
