create unique index gallery_one_active_real_featured_idx
on public.gallery_images (is_featured)
where is_featured and is_active and media_kind = 'real';

create or replace function public.admin_set_featured_gallery_image(target_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select app_private.is_admin()) then
    raise exception using errcode = '42501', message = 'Administrator access required.';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('yaqoob_featured_gallery_image', 0)
  );

  if not exists (
    select 1
    from public.gallery_images
    where id = target_id
      and is_active = true
      and media_kind = 'real'::public.media_kind
  ) then
    raise exception using errcode = '23514', message = 'Choose an active real shop photo.';
  end if;

  update public.gallery_images
  set is_featured = false
  where is_featured = true;

  update public.gallery_images
  set is_featured = true
  where id = target_id;
end;
$$;

revoke all on function public.admin_set_featured_gallery_image(uuid) from public, anon;
grant execute on function public.admin_set_featured_gallery_image(uuid) to authenticated;
