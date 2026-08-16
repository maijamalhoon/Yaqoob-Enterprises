begin;

lock table public.gallery_images in share row exclusive mode;

do $$
begin
  if (select count(*) from public.gallery_images where is_featured) > 1 then
    raise exception 'Gallery migration requires at most one featured image';
  end if;

  if exists (
    select 1
    from public.gallery_images
    where is_featured and (not is_active or media_kind <> 'real'::public.media_kind)
  ) then
    raise exception 'Gallery migration found an ineligible featured image';
  end if;

  if exists (
    select 1 from public.gallery_images
    where is_active and media_kind = 'real'::public.media_kind
  ) and not exists (
    select 1 from public.gallery_images where is_featured
  ) then
    raise exception 'Gallery migration requires a featured image when active real images exist';
  end if;
end;
$$;

create unique index gallery_images_one_featured_idx
on public.gallery_images (is_featured)
where is_featured;

alter table public.gallery_images
  add constraint gallery_images_featured_eligible_check
  check (not is_featured or (is_active and media_kind = 'real'::public.media_kind)) not valid;

alter table public.gallery_images
  validate constraint gallery_images_featured_eligible_check;

create or replace function app_private.enforce_gallery_featured_image()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1
    from public.gallery_images
    where is_active and media_kind = 'real'::public.media_kind
  ) and not exists (
    select 1
    from public.gallery_images
    where is_featured
  ) then
    raise exception 'An active real gallery image must be selected as featured'
      using errcode = '23514';
  end if;

  return null;
end;
$$;

revoke all on function app_private.enforce_gallery_featured_image() from public, anon, authenticated;

create constraint trigger gallery_images_require_featured
after insert or update or delete on public.gallery_images
deferrable initially deferred
for each row execute function app_private.enforce_gallery_featured_image();

create or replace function public.admin_complete_gallery_upload(
  p_storage_path text,
  p_alt_text text,
  p_media_kind public.media_kind,
  p_is_featured boolean,
  p_display_order integer,
  p_focal_x numeric,
  p_focal_y numeric
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  target_id uuid;
  actor_id uuid := auth.uid();
  relative_path text;
begin
  if actor_id is null or not app_private.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  relative_path := substring(p_storage_path from char_length(actor_id::text) + 2);
  if p_storage_path is null
    or p_storage_path not like actor_id::text || '/%'
    or relative_path = ''
    or relative_path like '%/%'
    or relative_path !~ '^[0-9]+-[0-9a-f-]+\.(jpg|png|webp)$'
  then
    raise exception 'Invalid gallery storage path' using errcode = '22023';
  end if;

  if p_alt_text is null or char_length(btrim(p_alt_text)) not between 1 and 180
    or p_media_kind is null
    or p_is_featured is null
    or p_display_order is null or p_display_order not between 0 and 10000
    or p_focal_x is null or p_focal_x not between 0 and 100
    or p_focal_y is null or p_focal_y not between 0 and 100
  then
    raise exception 'Invalid gallery image metadata' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('public.gallery_images.featured', 0)
  );

  select id
  into target_id
  from public.gallery_images
  where storage_path = p_storage_path;

  if found then
    return target_id;
  end if;

  insert into public.gallery_images (
    storage_path,
    alt_text,
    caption,
    media_kind,
    is_featured,
    is_active,
    display_order,
    focal_x,
    focal_y
  ) values (
    p_storage_path,
    btrim(p_alt_text),
    '',
    p_media_kind,
    false,
    true,
    p_display_order,
    p_focal_x,
    p_focal_y
  )
  returning id into target_id;

  if p_media_kind = 'real'::public.media_kind
    and (p_is_featured or not exists (select 1 from public.gallery_images where is_featured))
  then
    update public.gallery_images
    set is_featured = false
    where is_featured and id <> target_id;

    update public.gallery_images
    set is_featured = true
    where id = target_id;
  end if;

  return target_id;
end;
$$;

create or replace function public.admin_update_gallery_image(
  p_id uuid,
  p_alt_text text,
  p_media_kind public.media_kind,
  p_is_featured boolean,
  p_is_active boolean,
  p_display_order integer,
  p_focal_x numeric,
  p_focal_y numeric
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  target_was_featured boolean;
  next_id uuid;
begin
  if auth.uid() is null or not app_private.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  if p_id is null
    or p_alt_text is null or char_length(btrim(p_alt_text)) not between 1 and 180
    or p_media_kind is null
    or p_is_featured is null
    or p_is_active is null
    or p_display_order is null or p_display_order not between 0 and 10000
    or p_focal_x is null or p_focal_x not between 0 and 100
    or p_focal_y is null or p_focal_y not between 0 and 100
  then
    raise exception 'Invalid gallery image metadata' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('public.gallery_images.featured', 0)
  );

  select is_featured
  into target_was_featured
  from public.gallery_images
  where id = p_id
  for update;

  if not found then
    raise exception 'Gallery image not found' using errcode = 'P0002';
  end if;

  update public.gallery_images
  set alt_text = btrim(p_alt_text),
      media_kind = p_media_kind,
      is_featured = false,
      is_active = p_is_active,
      display_order = p_display_order,
      focal_x = p_focal_x,
      focal_y = p_focal_y
  where id = p_id;

  if p_is_featured and p_is_active and p_media_kind = 'real'::public.media_kind then
    update public.gallery_images
    set is_featured = false
    where is_featured and id <> p_id;

    update public.gallery_images
    set is_featured = true
    where id = p_id;
  elsif target_was_featured or not exists (select 1 from public.gallery_images where is_featured) then
    select id
    into next_id
    from public.gallery_images
    where is_active and media_kind = 'real'::public.media_kind
    order by (id = p_id), display_order, created_at, id
    limit 1
    for update;

    if next_id is not null then
      update public.gallery_images
      set is_featured = true
      where id = next_id;
    end if;
  end if;

  return p_id;
end;
$$;

create or replace function public.admin_archive_gallery_image(p_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  target_was_featured boolean;
  next_id uuid;
begin
  if auth.uid() is null or not app_private.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  if p_id is null then
    raise exception 'Invalid gallery image reference' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('public.gallery_images.featured', 0)
  );

  select is_featured
  into target_was_featured
  from public.gallery_images
  where id = p_id
  for update;

  if not found then
    raise exception 'Gallery image not found' using errcode = 'P0002';
  end if;

  update public.gallery_images
  set is_active = false,
      is_featured = false
  where id = p_id;

  if target_was_featured then
    select id
    into next_id
    from public.gallery_images
    where is_active and media_kind = 'real'::public.media_kind
    order by display_order, created_at, id
    limit 1
    for update;

    if next_id is not null then
      update public.gallery_images
      set is_featured = true
      where id = next_id;
    end if;
  end if;

  return p_id;
end;
$$;

revoke all on function public.admin_complete_gallery_upload(text, text, public.media_kind, boolean, integer, numeric, numeric) from public, anon;
revoke all on function public.admin_update_gallery_image(uuid, text, public.media_kind, boolean, boolean, integer, numeric, numeric) from public, anon;
revoke all on function public.admin_archive_gallery_image(uuid) from public, anon;

grant execute on function public.admin_complete_gallery_upload(text, text, public.media_kind, boolean, integer, numeric, numeric) to authenticated;
grant execute on function public.admin_update_gallery_image(uuid, text, public.media_kind, boolean, boolean, integer, numeric, numeric) to authenticated;
grant execute on function public.admin_archive_gallery_image(uuid) to authenticated;

-- A featured-image switch produces multiple audit rows. A one-row rollback could
-- violate the exactly-one invariant, so gallery recovery is snapshot-only.
create or replace function public.rollback_admin_audit(target_audit_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_table text;
begin
  if not app_private.is_owner() then
    raise exception 'Owner access required' using errcode = '42501';
  end if;

  select table_name
  into target_table
  from public.admin_audit_log
  where id = target_audit_id;

  if not found then
    raise exception 'Audit entry not found' using errcode = 'P0002';
  end if;

  if target_table = 'gallery_images' then
    raise exception 'Gallery changes must be recovered from a content snapshot'
      using errcode = '0A000';
  end if;

  perform app_private.rollback_admin_audit(target_audit_id);
end;
$$;

revoke all on function public.rollback_admin_audit(bigint) from public, anon;
grant execute on function public.rollback_admin_audit(bigint) to authenticated;

commit;
