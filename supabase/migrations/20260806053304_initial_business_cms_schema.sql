create extension if not exists pgcrypto;

create type public.service_status as enum ('active','appointment_only','temporarily_unavailable','coming_soon','hidden');
create type public.media_kind as enum ('concept','real');
create type public.admin_role as enum ('owner','editor');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.admin_role not null default 'editor',
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles
    where user_id = auth.uid()
  );
$$;

create table public.business_settings (
  id boolean primary key default true check (id),
  business_name text not null default 'Yaqoob Enterprises',
  tagline text not null default 'Everyday Services, Made Easier',
  phone_display text not null default '+92 349 2568864',
  phone_e164 text not null default '+923492568864',
  whatsapp_e164 text not null default '+923492568864',
  address text not null default 'Plot No. 7, Street No. 1, Sector B, Akhtar Colony, Karachi 75500, Pakistan',
  map_url text not null default 'https://maps.app.goo.gl/hui54LEXRjMeWxme9',
  pricing_message text not null default 'Hamari service charges kaam ki type, quantity, urgency, delivery location aur applicable official fees ke mutabiq vary karti hain. Exact quotation kaam shuru hone se pehle WhatsApp ya shop par confirm ki jati hai.',
  concept_image_notice text not null default 'Storefront concept preview — actual shop photos coming soon.',
  website_active boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.business_settings (id) values (true);

create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 0 and 6),
  label text not null,
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  display_order smallint not null,
  updated_at timestamptz not null default now(),
  unique (weekday)
);

insert into public.business_hours (weekday,label,opens_at,closes_at,is_closed,display_order) values
(1,'Monday','07:00','22:00',false,1),
(2,'Tuesday','07:00','22:00',false,2),
(3,'Wednesday','07:00','22:00',false,3),
(4,'Thursday','07:00','22:00',false,4),
(5,'Friday','07:00','22:00',false,5),
(6,'Saturday','07:00','22:00',false,6),
(0,'Sunday','07:00','22:00',false,7);

create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  description text not null default '',
  icon_key text not null default 'briefcase',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.service_categories(id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  short_description text not null,
  detailed_description text not null default '',
  status public.service_status not null default 'active',
  available_at_shop boolean not null default true,
  whatsapp_request boolean not null default true,
  pickup_available boolean not null default false,
  delivery_available boolean not null default false,
  doorstep_available boolean not null default false,
  appointment_required boolean not null default false,
  requirements text[] not null default '{}',
  important_note text not null default '',
  display_order integer not null default 0,
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coverage_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  delivery_available boolean not null default true,
  doorstep_biometric_available boolean not null default true,
  pickup_available boolean not null default false,
  extra_charge_may_apply boolean not null default true,
  notes text not null default '',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  alt_text text not null,
  caption text not null default '',
  media_kind public.media_kind not null default 'real',
  is_featured boolean not null default false,
  display_order integer not null default 0,
  focal_x numeric(5,2) not null default 50 check (focal_x between 0 and 100),
  focal_y numeric(5,2) not null default 50 check (focal_y between 0 and 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  link_label text,
  link_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.site_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique check (section_key ~ '^[a-z0-9_]+$'),
  title text not null default '',
  subtitle text not null default '',
  body text not null default '',
  content jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.analytics_events (
  id bigint generated always as identity primary key,
  event_name text not null,
  page_path text not null default '/',
  referrer_host text,
  country_code text,
  city_name text,
  device_type text,
  session_hash text,
  created_at timestamptz not null default now()
);

create index services_category_order_idx on public.services(category_id, display_order);
create index services_status_idx on public.services(status);
create index coverage_active_order_idx on public.coverage_areas(is_active, display_order);
create index gallery_featured_order_idx on public.gallery_images(is_featured, display_order);
create index announcements_active_dates_idx on public.announcements(is_active, starts_at, ends_at);
create index analytics_created_idx on public.analytics_events(created_at desc);
create index analytics_event_idx on public.analytics_events(event_name, created_at desc);

create trigger admin_profiles_updated_at before update on public.admin_profiles for each row execute function public.set_updated_at();
create trigger business_settings_updated_at before update on public.business_settings for each row execute function public.set_updated_at();
create trigger business_hours_updated_at before update on public.business_hours for each row execute function public.set_updated_at();
create trigger service_categories_updated_at before update on public.service_categories for each row execute function public.set_updated_at();
create trigger services_updated_at before update on public.services for each row execute function public.set_updated_at();
create trigger coverage_areas_updated_at before update on public.coverage_areas for each row execute function public.set_updated_at();
create trigger gallery_images_updated_at before update on public.gallery_images for each row execute function public.set_updated_at();
create trigger announcements_updated_at before update on public.announcements for each row execute function public.set_updated_at();
create trigger site_sections_updated_at before update on public.site_sections for each row execute function public.set_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.business_settings enable row level security;
alter table public.business_hours enable row level security;
alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.coverage_areas enable row level security;
alter table public.gallery_images enable row level security;
alter table public.announcements enable row level security;
alter table public.site_sections enable row level security;
alter table public.analytics_events enable row level security;

create policy admin_profiles_self_read on public.admin_profiles for select to authenticated using (user_id = auth.uid());
create policy admin_profiles_owner_manage on public.admin_profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy public_read_business_settings on public.business_settings for select to anon, authenticated using (website_active or public.is_admin());
create policy admin_manage_business_settings on public.business_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy public_read_business_hours on public.business_hours for select to anon, authenticated using (true);
create policy admin_manage_business_hours on public.business_hours for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy public_read_categories on public.service_categories for select to anon, authenticated using (is_active or public.is_admin());
create policy admin_manage_categories on public.service_categories for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy public_read_services on public.services for select to anon, authenticated using ((status <> 'hidden' and exists (select 1 from public.service_categories c where c.id = category_id and c.is_active)) or public.is_admin());
create policy admin_manage_services on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy public_read_coverage on public.coverage_areas for select to anon, authenticated using (is_active or public.is_admin());
create policy admin_manage_coverage on public.coverage_areas for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy public_read_gallery on public.gallery_images for select to anon, authenticated using (is_active or public.is_admin());
create policy admin_manage_gallery on public.gallery_images for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy public_read_announcements on public.announcements for select to anon, authenticated using ((is_active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now())) or public.is_admin());
create policy admin_manage_announcements on public.announcements for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy public_read_sections on public.site_sections for select to anon, authenticated using (is_active or public.is_admin());
create policy admin_manage_sections on public.site_sections for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy public_insert_analytics on public.analytics_events for insert to anon, authenticated with check (event_name in ('page_view','whatsapp_click','call_click','directions_click','service_view'));
create policy admin_read_analytics on public.analytics_events for select to authenticated using (public.is_admin());
create policy admin_delete_analytics on public.analytics_events for delete to authenticated using (public.is_admin());

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('site-media','site-media',true,10485760,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy public_read_site_media on storage.objects for select to public using (bucket_id = 'site-media');
create policy admin_insert_site_media on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and public.is_admin());
create policy admin_update_site_media on storage.objects for update to authenticated using (bucket_id = 'site-media' and public.is_admin()) with check (bucket_id = 'site-media' and public.is_admin());
create policy admin_delete_site_media on storage.objects for delete to authenticated using (bucket_id = 'site-media' and public.is_admin());

grant execute on function public.is_admin() to anon, authenticated;
