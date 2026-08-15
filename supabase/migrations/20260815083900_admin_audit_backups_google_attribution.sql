alter table public.business_settings
  add column if not exists google_business_profile_url text not null default '';

alter table public.analytics_events
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text;

alter table public.analytics_events
  drop constraint if exists analytics_events_utm_source_length,
  add constraint analytics_events_utm_source_length check (utm_source is null or char_length(utm_source) <= 80),
  drop constraint if exists analytics_events_utm_medium_length,
  add constraint analytics_events_utm_medium_length check (utm_medium is null or char_length(utm_medium) <= 80),
  drop constraint if exists analytics_events_utm_campaign_length,
  add constraint analytics_events_utm_campaign_length check (utm_campaign is null or char_length(utm_campaign) <= 120);

create table if not exists public.admin_audit_log (
  id bigint generated always as identity primary key,
  table_name text not null,
  record_id text not null,
  record_label text,
  operation text not null check (operation in ('INSERT', 'UPDATE', 'DELETE')),
  actor_id uuid,
  actor_email text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_created_at_idx on public.admin_audit_log (created_at desc);
create index if not exists admin_audit_log_table_record_idx on public.admin_audit_log (table_name, record_id, created_at desc);
create index if not exists admin_audit_log_actor_idx on public.admin_audit_log (actor_id, created_at desc);

alter table public.admin_audit_log enable row level security;
revoke all on table public.admin_audit_log from anon;
revoke all on table public.admin_audit_log from authenticated;
grant select on table public.admin_audit_log to authenticated;

drop policy if exists admin_read_audit_log on public.admin_audit_log;
create policy admin_read_audit_log
on public.admin_audit_log
for select
to authenticated
using (app_private.is_admin());

create table if not exists public.admin_snapshots (
  id uuid primary key default gen_random_uuid(),
  label text not null default 'Manual backup',
  snapshot jsonb not null,
  created_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists admin_snapshots_created_at_idx on public.admin_snapshots (created_at desc);

alter table public.admin_snapshots enable row level security;
revoke all on table public.admin_snapshots from anon;
revoke all on table public.admin_snapshots from authenticated;
grant select, insert, delete on table public.admin_snapshots to authenticated;

drop policy if exists admin_read_snapshots on public.admin_snapshots;
create policy admin_read_snapshots
on public.admin_snapshots
for select
to authenticated
using (app_private.is_admin());

drop policy if exists admin_insert_snapshots on public.admin_snapshots;
create policy admin_insert_snapshots
on public.admin_snapshots
for insert
to authenticated
with check (app_private.is_admin() and (created_by is null or created_by = auth.uid()));

drop policy if exists admin_delete_snapshots on public.admin_snapshots;
create policy admin_delete_snapshots
on public.admin_snapshots
for delete
to authenticated
using (app_private.is_admin());

create or replace function app_private.capture_admin_audit()
returns trigger
language plpgsql
security definer
set search_path = public, app_private, auth
as $$
declare
  old_row jsonb;
  new_row jsonb;
  claims jsonb;
  actor uuid;
  actor_mail text;
  rid text;
  label text;
begin
  old_row := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end;
  new_row := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end;

  if tg_op = 'UPDATE' and old_row = new_row then
    return new;
  end if;

  begin
    claims := nullif(current_setting('request.jwt.claims', true), '')::jsonb;
    actor := nullif(claims ->> 'sub', '')::uuid;
    actor_mail := nullif(claims ->> 'email', '');
  exception when others then
    actor := null;
    actor_mail := null;
  end;

  rid := coalesce(new_row ->> 'id', old_row ->> 'id', 'singleton');
  label := coalesce(
    new_row ->> 'business_name', new_row ->> 'title', new_row ->> 'name', new_row ->> 'label', new_row ->> 'alt_text',
    old_row ->> 'business_name', old_row ->> 'title', old_row ->> 'name', old_row ->> 'label', old_row ->> 'alt_text',
    rid
  );

  insert into public.admin_audit_log (
    table_name, record_id, record_label, operation, actor_id, actor_email, old_data, new_data
  ) values (
    tg_table_name, rid, label, tg_op, actor, actor_mail, old_row, new_row
  );

  return coalesce(new, old);
end;
$$;

revoke all on function app_private.capture_admin_audit() from public;

DO $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'business_settings',
    'business_hours',
    'service_categories',
    'services',
    'gallery_images',
    'coverage_areas'
  ]
  loop
    execute format('drop trigger if exists admin_audit_%I on public.%I', target_table, target_table);
    execute format(
      'create trigger admin_audit_%I after insert or update or delete on public.%I for each row execute function app_private.capture_admin_audit()',
      target_table,
      target_table
    );
  end loop;
end;
$$;