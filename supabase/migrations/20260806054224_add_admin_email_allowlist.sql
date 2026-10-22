create table if not exists public.admin_email_allowlist (
  email text primary key,
  role public.admin_role not null default 'editor',
  display_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_email_allowlist enable row level security;

revoke all on public.admin_email_allowlist from anon, authenticated;

drop trigger if exists set_admin_email_allowlist_updated_at on public.admin_email_allowlist;
create trigger set_admin_email_allowlist_updated_at
before update on public.admin_email_allowlist
for each row execute function public.set_updated_at();

create or replace function public.provision_allowed_admin()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  allowed public.admin_email_allowlist%rowtype;
begin
  select * into allowed
  from public.admin_email_allowlist
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

drop trigger if exists provision_allowed_admin_after_signup on auth.users;
create trigger provision_allowed_admin_after_signup
after insert or update of email on auth.users
for each row execute function public.provision_allowed_admin();

insert into public.admin_email_allowlist (email, role, display_name, is_active)
values ('jamalarain186@gmail.com', 'owner', 'Jamal Arain', true)
on conflict (email) do update
set role = excluded.role,
    display_name = excluded.display_name,
    is_active = true,
    updated_at = now();

