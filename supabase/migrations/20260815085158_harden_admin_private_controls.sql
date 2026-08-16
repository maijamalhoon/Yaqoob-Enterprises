create or replace function public.rollback_admin_audit(target_audit_id bigint)
returns void
language sql
security invoker
set search_path = public, app_private, auth
as $$
  select app_private.rollback_admin_audit(target_audit_id);
$$;

revoke all on function public.rollback_admin_audit(bigint) from public, anon;
grant execute on function public.rollback_admin_audit(bigint) to authenticated;

create or replace function public.restore_admin_snapshot(target_snapshot_id uuid)
returns void
language sql
security invoker
set search_path = public, app_private, auth
as $$
  select app_private.restore_admin_snapshot(target_snapshot_id);
$$;

revoke all on function public.restore_admin_snapshot(uuid) from public, anon;
grant execute on function public.restore_admin_snapshot(uuid) to authenticated;

alter table public.admin_email_allowlist set schema app_private;
alter table app_private.admin_email_allowlist disable row level security;
revoke all on table app_private.admin_email_allowlist from public, anon, authenticated;

create or replace function public.provision_allowed_admin()
returns trigger
language plpgsql
security definer
set search_path = public, auth, app_private
as $$
declare
  allowed app_private.admin_email_allowlist%rowtype;
begin
  select * into allowed
  from app_private.admin_email_allowlist
  where lower(email) = lower(new.email)
    and is_active = true;

  if found then
    insert into public.admin_profiles (user_id, role, display_name)
    values (new.id, allowed.role, coalesce(allowed.display_name, split_part(new.email, '@', 1)))
    on conflict (user_id) do update
      set role = excluded.role,
          display_name = excluded.display_name,
          updated_at = now();
  end if;

  return new;
end;
$$;

revoke all on function public.provision_allowed_admin() from public, anon, authenticated;