alter table public.admin_audit_log
  add column if not exists reverted_at timestamptz,
  add column if not exists reverted_by uuid;

create or replace function app_private.rollback_admin_audit(target_audit_id bigint)
returns void
language plpgsql
security definer
set search_path = public, app_private, auth
as $$
declare
  audit_row public.admin_audit_log%rowtype;
  current_data jsonb;
  column_list text;
  affected integer;
begin
  if not app_private.is_admin() then
    raise exception 'Not authorised';
  end if;

  select * into audit_row
  from public.admin_audit_log
  where id = target_audit_id
  for update;

  if not found then
    raise exception 'History entry not found';
  end if;
  if audit_row.reverted_at is not null then
    raise exception 'This history entry has already been rolled back';
  end if;
  if audit_row.table_name not in ('business_settings','business_hours','service_categories','services','gallery_images','coverage_areas') then
    raise exception 'This type of change cannot be rolled back';
  end if;

  if audit_row.operation in ('INSERT','UPDATE') then
    execute format('select to_jsonb(t) from public.%I t where t.id::text = $1', audit_row.table_name)
      into current_data
      using audit_row.record_id;

    if current_data is null then
      raise exception 'The current record no longer exists';
    end if;
    if current_data is distinct from audit_row.new_data then
      raise exception 'This record changed after the selected history entry. Roll back the newer change first.';
    end if;
  end if;

  if audit_row.operation = 'INSERT' then
    execute format('delete from public.%I where id::text = $1', audit_row.table_name)
      using audit_row.record_id;
    get diagnostics affected = row_count;
    if affected <> 1 then raise exception 'Could not reverse the created record'; end if;

  elsif audit_row.operation = 'UPDATE' then
    select string_agg(format('%I', a.attname), ', ' order by a.attnum)
      into column_list
    from pg_attribute a
    where a.attrelid = format('public.%I', audit_row.table_name)::regclass
      and a.attnum > 0
      and not a.attisdropped
      and a.attgenerated = '';

    execute format(
      'update public.%I set (%s) = (select %s from jsonb_populate_record(null::public.%I, $1)) where id::text = $2',
      audit_row.table_name, column_list, column_list, audit_row.table_name
    ) using audit_row.old_data, audit_row.record_id;
    get diagnostics affected = row_count;
    if affected <> 1 then raise exception 'Could not restore the previous record values'; end if;

  elsif audit_row.operation = 'DELETE' then
    execute format('select to_jsonb(t) from public.%I t where t.id::text = $1', audit_row.table_name)
      into current_data
      using audit_row.record_id;
    if current_data is not null then
      raise exception 'A record with this ID already exists';
    end if;

    execute format(
      'insert into public.%I select * from jsonb_populate_record(null::public.%I, $1)',
      audit_row.table_name, audit_row.table_name
    ) using audit_row.old_data;
  end if;

  update public.admin_audit_log
  set reverted_at = now(), reverted_by = auth.uid()
  where id = target_audit_id;
end;
$$;

revoke all on function app_private.rollback_admin_audit(bigint) from public, anon;
grant execute on function app_private.rollback_admin_audit(bigint) to authenticated;

create or replace function app_private.restore_admin_snapshot(target_snapshot_id uuid)
returns void
language plpgsql
security definer
set search_path = public, app_private, auth
as $$
declare
  payload jsonb;
begin
  if not app_private.is_admin() then
    raise exception 'Not authorised';
  end if;

  select snapshot into payload
  from public.admin_snapshots
  where id = target_snapshot_id;

  if payload is null then
    raise exception 'Backup not found';
  end if;

  delete from public.services;
  delete from public.service_categories;
  delete from public.coverage_areas;
  delete from public.gallery_images;
  delete from public.business_hours;
  delete from public.business_settings;

  insert into public.business_settings
  select * from jsonb_populate_recordset(null::public.business_settings, coalesce(payload -> 'business_settings', '[]'::jsonb));

  insert into public.business_hours
  select * from jsonb_populate_recordset(null::public.business_hours, coalesce(payload -> 'business_hours', '[]'::jsonb));

  insert into public.service_categories
  select * from jsonb_populate_recordset(null::public.service_categories, coalesce(payload -> 'service_categories', '[]'::jsonb));

  insert into public.services
  select * from jsonb_populate_recordset(null::public.services, coalesce(payload -> 'services', '[]'::jsonb));

  insert into public.gallery_images
  select * from jsonb_populate_recordset(null::public.gallery_images, coalesce(payload -> 'gallery_images', '[]'::jsonb));

  insert into public.coverage_areas
  select * from jsonb_populate_recordset(null::public.coverage_areas, coalesce(payload -> 'coverage_areas', '[]'::jsonb));
end;
$$;

revoke all on function app_private.restore_admin_snapshot(uuid) from public, anon;
grant execute on function app_private.restore_admin_snapshot(uuid) to authenticated;