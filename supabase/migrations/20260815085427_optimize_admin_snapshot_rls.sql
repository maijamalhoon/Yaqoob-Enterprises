drop policy if exists admin_insert_snapshots on public.admin_snapshots;
create policy admin_insert_snapshots
on public.admin_snapshots
for insert
to authenticated
with check (app_private.is_admin() and (created_by is null or created_by = (select auth.uid())));