-- Phase 8: make the existing six-table rollback usable on safe-update Postgres.
-- The SQL must be atomic and reject malformed snapshots BEFORE any deletion.
-- Existing owner-only public wrapper and privileges are left unchanged.
create or replace function app_private.restore_admin_snapshot(target_snapshot_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $restore$
declare
  payload jsonb;
  table_key text;
begin
  if not (select app_private.is_admin()) then
    raise exception 'Not authorised' using errcode = '42501';
  end if;

  select snapshot into payload
  from public.admin_snapshots
  where id = target_snapshot_id
  for share;

  if payload is null then
    raise exception 'Backup not found' using errcode = '22023';
  end if;

  if pg_catalog.jsonb_typeof(payload) <> 'object'
    or payload->>'version' is distinct from '1' then
    raise exception 'Unsupported snapshot version' using errcode = '22023';
  end if;
  foreach table_key in array array[
    'business_settings', 'business_hours', 'service_categories',
    'services', 'gallery_images', 'coverage_areas'
  ]
  loop
    if pg_catalog.jsonb_typeof(payload -> table_key) is distinct from 'array' then
      raise exception 'Incomplete backup: %', table_key using errcode = '22023';
    end if;
  end loop;
  if pg_catalog.jsonb_array_length(payload -> 'business_settings') <> 1 then
    raise exception 'Missing business settings record' using errcode = '22023';
  end if;

  -- Supabase's safe-update protection requires a WHERE clause. All six
  -- primary keys are NOT NULL, so these still deliberately replace each
  -- backed-up table in full (as the original restore function intended).
  delete from public.services where id is not null;
  delete from public.service_categories where id is not null;
  delete from public.coverage_areas where id is not null;
  delete from public.gallery_images where id is not null;
  delete from public.business_hours where id is not null;
  delete from public.business_settings where id is not null;

  insert into public.business_settings
  select * from pg_catalog.jsonb_populate_recordset(null::public.business_settings, payload -> 'business_settings');

  insert into public.business_hours
  select * from pg_catalog.jsonb_populate_recordset(null::public.business_hours, payload -> 'business_hours');

  insert into public.service_categories
  select * from pg_catalog.jsonb_populate_recordset(null::public.service_categories, payload -> 'service_categories');

  insert into public.services
  select * from pg_catalog.jsonb_populate_recordset(null::public.services, payload -> 'services');

  insert into public.gallery_images
  select * from pg_catalog.jsonb_populate_recordset(null::public.gallery_images, payload -> 'gallery_images');

  insert into public.coverage_areas
  select * from pg_catalog.jsonb_populate_recordset(null::public.coverage_areas, payload -> 'coverage_areas');
end;
$restore$;

-- Keep the inner privileged helper inaccessible to ordinary API roles;
-- owner-only public wrapper from the previous migration remains the entry.
revoke all on function app_private.restore_admin_snapshot(uuid) from public, anon, authenticated, service_role;
