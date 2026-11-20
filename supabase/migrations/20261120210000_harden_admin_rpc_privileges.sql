-- Restrict public administration RPCs to the caller's own permissions.
-- Gallery writes already have authenticated-only admin RLS; no privileged helper is needed.
-- Backup restores and audit rollbacks still require privileged database access,
-- but the SECURITY DEFINER boundaries stay inside the non-exposed app_private schema.

-- 1. Preserve the gallery business logic and advisory lock, but make it
-- run under the authenticated caller's grants and gallery_images RLS policies.
alter function public.admin_set_featured_gallery_image(uuid) security invoker;

-- 2. Private owner-only privileged helpers. Existing lower-level private
-- restore/rollback functions and their grant rules remain unchanged.
create or replace function app_private.owner_restore_admin_snapshot(target_snapshot_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if not (select app_private.is_owner()) then
    raise exception using errcode = '42501', message = 'Owner access required.';
  end if;

  perform app_private.restore_admin_snapshot(target_snapshot_id);
end;
$function$;

create or replace function app_private.owner_rollback_admin_audit(target_audit_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if not (select app_private.is_owner()) then
    raise exception using errcode = '42501', message = 'Owner access required.';
  end if;

  perform app_private.rollback_admin_audit(target_audit_id);
end;
$function$;

-- No PUBLIC/anon function permissions, including Postgres defaults.
revoke all on function app_private.owner_restore_admin_snapshot(uuid) from public, anon, authenticated, service_role;
revoke all on function app_private.owner_rollback_admin_audit(bigint) from public, anon, authenticated, service_role;
grant execute on function app_private.owner_restore_admin_snapshot(uuid) to authenticated;
grant execute on function app_private.owner_rollback_admin_audit(bigint) to authenticated;

-- 3. Keep the identical RPC names and arguments used by Next.js,
-- but make exposed wrappers SECURITY INVOKER; privileged code is private.
create or replace function public.restore_admin_snapshot(target_snapshot_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  perform app_private.owner_restore_admin_snapshot(target_snapshot_id);
end;
$function$;

create or replace function public.rollback_admin_audit(target_audit_id bigint)
returns void
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  perform app_private.owner_rollback_admin_audit(target_audit_id);
end;
$function$;

revoke all on function public.admin_set_featured_gallery_image(uuid) from public, anon;
revoke all on function public.restore_admin_snapshot(uuid) from public, anon;
revoke all on function public.rollback_admin_audit(bigint) from public, anon;
grant execute on function public.admin_set_featured_gallery_image(uuid) to authenticated;
grant execute on function public.restore_admin_snapshot(uuid) to authenticated;
grant execute on function public.rollback_admin_audit(bigint) to authenticated;

notify pgrst, 'reload schema';
