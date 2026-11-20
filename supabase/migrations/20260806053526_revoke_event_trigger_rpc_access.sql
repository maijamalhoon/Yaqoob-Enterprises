-- On the original hosted project this utility function already existed.
-- Fresh isolated Supabase stacks never had it: keep this hardening migration
-- reproducible without creating a privileged event-trigger helper.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;
