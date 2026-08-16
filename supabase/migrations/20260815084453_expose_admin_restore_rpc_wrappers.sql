create or replace function public.rollback_admin_audit(target_audit_id bigint)
returns void
language sql
security definer
set search_path = public, app_private, auth
as $$
  select app_private.rollback_admin_audit(target_audit_id);
$$;

revoke all on function public.rollback_admin_audit(bigint) from public, anon;
grant execute on function public.rollback_admin_audit(bigint) to authenticated;

create or replace function public.restore_admin_snapshot(target_snapshot_id uuid)
returns void
language sql
security definer
set search_path = public, app_private, auth
as $$
  select app_private.restore_admin_snapshot(target_snapshot_id);
$$;

revoke all on function public.restore_admin_snapshot(uuid) from public, anon;
grant execute on function public.restore_admin_snapshot(uuid) to authenticated;