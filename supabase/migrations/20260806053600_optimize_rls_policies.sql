drop policy admin_profiles_self_read on public.admin_profiles;
drop policy admin_profiles_owner_manage on public.admin_profiles;
create policy admin_profiles_read on public.admin_profiles for select to authenticated using (user_id = (select auth.uid()) or app_private.is_admin());
create policy admin_profiles_insert on public.admin_profiles for insert to authenticated with check (app_private.is_admin());
create policy admin_profiles_update on public.admin_profiles for update to authenticated using (app_private.is_admin()) with check (app_private.is_admin());
create policy admin_profiles_delete on public.admin_profiles for delete to authenticated using (app_private.is_admin());

drop policy admin_manage_business_settings on public.business_settings;
create policy admin_insert_business_settings on public.business_settings for insert to authenticated with check (app_private.is_admin());
create policy admin_update_business_settings on public.business_settings for update to authenticated using (app_private.is_admin()) with check (app_private.is_admin());
create policy admin_delete_business_settings on public.business_settings for delete to authenticated using (app_private.is_admin());

drop policy public_read_business_hours on public.business_hours;
create policy anon_read_business_hours on public.business_hours for select to anon using (true);
create policy authenticated_read_business_hours on public.business_hours for select to authenticated using (true);
drop policy admin_manage_business_hours on public.business_hours;
create policy admin_insert_business_hours on public.business_hours for insert to authenticated with check (app_private.is_admin());
create policy admin_update_business_hours on public.business_hours for update to authenticated using (app_private.is_admin()) with check (app_private.is_admin());
create policy admin_delete_business_hours on public.business_hours for delete to authenticated using (app_private.is_admin());

drop policy admin_manage_categories on public.service_categories;
create policy admin_insert_categories on public.service_categories for insert to authenticated with check (app_private.is_admin());
create policy admin_update_categories on public.service_categories for update to authenticated using (app_private.is_admin()) with check (app_private.is_admin());
create policy admin_delete_categories on public.service_categories for delete to authenticated using (app_private.is_admin());

drop policy admin_manage_services on public.services;
create policy admin_insert_services on public.services for insert to authenticated with check (app_private.is_admin());
create policy admin_update_services on public.services for update to authenticated using (app_private.is_admin()) with check (app_private.is_admin());
create policy admin_delete_services on public.services for delete to authenticated using (app_private.is_admin());

drop policy admin_manage_coverage on public.coverage_areas;
create policy admin_insert_coverage on public.coverage_areas for insert to authenticated with check (app_private.is_admin());
create policy admin_update_coverage on public.coverage_areas for update to authenticated using (app_private.is_admin()) with check (app_private.is_admin());
create policy admin_delete_coverage on public.coverage_areas for delete to authenticated using (app_private.is_admin());

drop policy admin_manage_gallery on public.gallery_images;
create policy admin_insert_gallery on public.gallery_images for insert to authenticated with check (app_private.is_admin());
create policy admin_update_gallery on public.gallery_images for update to authenticated using (app_private.is_admin()) with check (app_private.is_admin());
create policy admin_delete_gallery on public.gallery_images for delete to authenticated using (app_private.is_admin());

drop policy admin_manage_announcements on public.announcements;
create policy admin_insert_announcements on public.announcements for insert to authenticated with check (app_private.is_admin());
create policy admin_update_announcements on public.announcements for update to authenticated using (app_private.is_admin()) with check (app_private.is_admin());
create policy admin_delete_announcements on public.announcements for delete to authenticated using (app_private.is_admin());

drop policy admin_manage_sections on public.site_sections;
create policy admin_insert_sections on public.site_sections for insert to authenticated with check (app_private.is_admin());
create policy admin_update_sections on public.site_sections for update to authenticated using (app_private.is_admin()) with check (app_private.is_admin());
create policy admin_delete_sections on public.site_sections for delete to authenticated using (app_private.is_admin());
