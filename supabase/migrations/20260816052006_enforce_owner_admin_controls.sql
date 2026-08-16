alter table public.admin_profiles
  add column if not exists is_active boolean not null default true;

revoke create on schema public from public, anon, authenticated;

create unique index if not exists admin_email_allowlist_email_lower_uidx
on app_private.admin_email_allowlist ((lower(email)));

create or replace function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = (select auth.uid())
      and is_active = true
  );
$$;

create or replace function app_private.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = (select auth.uid())
      and role = 'owner'::public.admin_role
      and is_active = true
  );
$$;

revoke all on function app_private.is_admin() from public, anon;
grant execute on function app_private.is_admin() to authenticated;
revoke all on function app_private.is_owner() from public, anon;
grant execute on function app_private.is_owner() to authenticated;

revoke all on table public.admin_profiles from anon;
grant select, insert, update, delete on table public.admin_profiles to authenticated;

drop policy if exists admin_profiles_self_read on public.admin_profiles;
drop policy if exists admin_profiles_owner_manage on public.admin_profiles;
drop policy if exists admin_profiles_read on public.admin_profiles;
drop policy if exists admin_profiles_insert on public.admin_profiles;
drop policy if exists admin_profiles_update on public.admin_profiles;
drop policy if exists admin_profiles_delete on public.admin_profiles;
drop policy if exists admin_profiles_owner_insert on public.admin_profiles;
drop policy if exists admin_profiles_owner_update on public.admin_profiles;
drop policy if exists admin_profiles_owner_delete on public.admin_profiles;

create policy admin_profiles_read
on public.admin_profiles
for select
to authenticated
using (
  (is_active = true and user_id = (select auth.uid()))
  or (select app_private.is_owner())
);

create policy admin_profiles_owner_insert
on public.admin_profiles
for insert
to authenticated
with check ((select app_private.is_owner()));

create policy admin_profiles_owner_update
on public.admin_profiles
for update
to authenticated
using ((select app_private.is_owner()))
with check ((select app_private.is_owner()));

create policy admin_profiles_owner_delete
on public.admin_profiles
for delete
to authenticated
using ((select app_private.is_owner()));

create or replace function app_private.protect_last_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  removes_active_owner boolean;
begin
  if tg_op = 'DELETE' then
    removes_active_owner := old.role = 'owner'::public.admin_role and old.is_active = true;
  else
    removes_active_owner := old.role = 'owner'::public.admin_role
      and old.is_active = true
      and (new.role <> 'owner'::public.admin_role or new.is_active = false);
  end if;

  if removes_active_owner then
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended('yaqoob_admin_last_owner', 0)
    );

    if not exists (
      select 1
      from public.admin_profiles
      where user_id <> old.user_id
        and role = 'owner'::public.admin_role
        and is_active = true
    ) then
      raise exception using
        errcode = '23514',
        message = 'The final active owner cannot be removed or deactivated.';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function app_private.protect_last_owner() from public, anon, authenticated;

drop trigger if exists protect_last_admin_owner on public.admin_profiles;
create trigger protect_last_admin_owner
before update or delete
on public.admin_profiles
for each row execute function app_private.protect_last_owner();

create or replace function app_private.capture_admin_profile_audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  claims jsonb;
begin
  begin
    claims := nullif(pg_catalog.current_setting('request.jwt.claims', true), '')::jsonb;
  exception when others then
    claims := null;
  end;

  insert into public.admin_audit_log (
    table_name,
    record_id,
    record_label,
    operation,
    actor_id,
    actor_email,
    old_data,
    new_data
  ) values (
    'admin_profiles',
    (case when tg_op = 'DELETE' then old.user_id else new.user_id end)::text,
    coalesce(
      case when tg_op = 'DELETE' then old.display_name else new.display_name end,
      'Administrator'
    ),
    tg_op,
    (select auth.uid()),
    nullif(claims ->> 'email', ''),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function app_private.capture_admin_profile_audit() from public, anon, authenticated;

drop trigger if exists audit_admin_profiles on public.admin_profiles;
create trigger audit_admin_profiles
after insert or update or delete
on public.admin_profiles
for each row execute function app_private.capture_admin_profile_audit();

create or replace function public.provision_allowed_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  allowed app_private.admin_email_allowlist%rowtype;
begin
  select * into allowed
  from app_private.admin_email_allowlist
  where lower(email) = lower(new.email)
    and is_active = true;

  if found then
    insert into public.admin_profiles (user_id, role, display_name, is_active)
    values (
      new.id,
      allowed.role,
      coalesce(allowed.display_name, pg_catalog.split_part(new.email, '@', 1)),
      true
    )
    on conflict (user_id) do update
      set role = excluded.role,
          display_name = excluded.display_name,
          is_active = true,
          updated_at = now();
  else
    update public.admin_profiles
    set is_active = false,
        updated_at = now()
    where user_id = new.id;
  end if;

  return new;
end;
$$;

revoke all on function public.provision_allowed_admin() from public, anon, authenticated;

create or replace function app_private.sync_admin_allowlist_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_user_id uuid;
  previous_user_id uuid;
begin
  if tg_op = 'DELETE' then
    select id into target_user_id
    from auth.users
    where lower(email) = lower(old.email)
    limit 1;

    if target_user_id is not null then
      update public.admin_profiles
      set is_active = false,
          updated_at = now()
      where user_id = target_user_id;
    end if;

    return old;
  end if;

  select id into target_user_id
  from auth.users
  where lower(email) = lower(new.email)
  limit 1;

  if target_user_id is not null and new.is_active = true then
    insert into public.admin_profiles (user_id, role, display_name, is_active)
    values (
      target_user_id,
      new.role,
      coalesce(new.display_name, pg_catalog.split_part(new.email, '@', 1)),
      true
    )
    on conflict (user_id) do update
      set role = excluded.role,
          display_name = excluded.display_name,
          is_active = true,
          updated_at = now();
  elsif target_user_id is not null then
    update public.admin_profiles
    set is_active = false,
        updated_at = now()
    where user_id = target_user_id;
  end if;

  if tg_op = 'UPDATE' and lower(old.email) <> lower(new.email) then
    select id into previous_user_id
    from auth.users
    where lower(email) = lower(old.email)
    limit 1;

    if previous_user_id is not null and previous_user_id is distinct from target_user_id then
      update public.admin_profiles
      set is_active = false,
          updated_at = now()
      where user_id = previous_user_id;
    end if;
  end if;

  return new;
end;
$$;

revoke all on function app_private.sync_admin_allowlist_profile() from public, anon, authenticated;

drop trigger if exists sync_admin_allowlist_profile on app_private.admin_email_allowlist;
create trigger sync_admin_allowlist_profile
after insert or update or delete
on app_private.admin_email_allowlist
for each row execute function app_private.sync_admin_allowlist_profile();

insert into public.admin_profiles (user_id, role, display_name, is_active)
select
  users.id,
  allowlist.role,
  coalesce(allowlist.display_name, pg_catalog.split_part(users.email, '@', 1)),
  true
from app_private.admin_email_allowlist as allowlist
join auth.users as users on lower(users.email) = lower(allowlist.email)
where allowlist.is_active = true
on conflict (user_id) do update
set role = excluded.role,
    display_name = excluded.display_name,
    is_active = true,
    updated_at = now();

update public.admin_profiles as profile
set is_active = false,
    updated_at = now()
from auth.users as users
where users.id = profile.user_id
  and not exists (
    select 1
    from app_private.admin_email_allowlist as allowlist
    where lower(allowlist.email) = lower(users.email)
      and allowlist.is_active = true
  );

do $$
begin
  if exists (select 1 from auth.users)
    and not exists (
      select 1
      from public.admin_profiles
      where role = 'owner'::public.admin_role
        and is_active = true
    )
  then
    raise exception using
      errcode = '23514',
      message = 'At least one active owner is required before enabling owner controls.';
  end if;
end;
$$;

drop policy if exists admin_read_audit_log on public.admin_audit_log;
create policy admin_read_audit_log
on public.admin_audit_log
for select
to authenticated
using (
  (table_name <> 'admin_profiles' and (select app_private.is_admin()))
  or (select app_private.is_owner())
);

drop policy if exists admin_delete_snapshots on public.admin_snapshots;
create policy admin_delete_snapshots
on public.admin_snapshots
for delete
to authenticated
using ((select app_private.is_owner()));

drop policy if exists admin_insert_snapshots on public.admin_snapshots;
create policy admin_insert_snapshots
on public.admin_snapshots
for insert
to authenticated
with check (
  (select app_private.is_admin())
  and created_by = (select auth.uid())
);

create or replace function public.rollback_admin_audit(target_audit_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not app_private.is_owner() then
    raise exception using errcode = '42501', message = 'Owner access required.';
  end if;

  perform app_private.rollback_admin_audit(target_audit_id);
end;
$$;

create or replace function public.restore_admin_snapshot(target_snapshot_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not app_private.is_owner() then
    raise exception using errcode = '42501', message = 'Owner access required.';
  end if;

  perform app_private.restore_admin_snapshot(target_snapshot_id);
end;
$$;

revoke all on function app_private.rollback_admin_audit(bigint) from public, anon, authenticated;
revoke all on function app_private.restore_admin_snapshot(uuid) from public, anon, authenticated;
revoke all on function public.rollback_admin_audit(bigint) from public, anon;
revoke all on function public.restore_admin_snapshot(uuid) from public, anon;
grant execute on function public.rollback_admin_audit(bigint) to authenticated;
grant execute on function public.restore_admin_snapshot(uuid) to authenticated;

alter function app_private.rollback_admin_audit(bigint) set search_path = '';
alter function app_private.restore_admin_snapshot(uuid) set search_path = '';
