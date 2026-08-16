alter table public.analytics_events
  add constraint analytics_events_event_name_check
  check (event_name = any (array[
    'page_view'::text,
    'whatsapp_click'::text,
    'call_click'::text,
    'directions_click'::text,
    'service_view'::text
  ])) not valid,
  add constraint analytics_events_page_path_check
  check (char_length(page_path) between 1 and 240 and page_path like '/%') not valid,
  add constraint analytics_events_referrer_host_check
  check (referrer_host is null or char_length(referrer_host) <= 160) not valid,
  add constraint analytics_events_country_code_check
  check (country_code is null or char_length(country_code) <= 8) not valid,
  add constraint analytics_events_city_name_check
  check (city_name is null or char_length(city_name) <= 120) not valid,
  add constraint analytics_events_device_type_check
  check (device_type is null or device_type = any (array['desktop'::text, 'tablet'::text, 'mobile'::text])) not valid,
  add constraint analytics_events_session_hash_check
  check (session_hash is not null and session_hash ~ '^[0-9a-f]{64}$') not valid;

alter table public.analytics_events validate constraint analytics_events_event_name_check;
alter table public.analytics_events validate constraint analytics_events_page_path_check;
alter table public.analytics_events validate constraint analytics_events_referrer_host_check;
alter table public.analytics_events validate constraint analytics_events_country_code_check;
alter table public.analytics_events validate constraint analytics_events_city_name_check;
alter table public.analytics_events validate constraint analytics_events_device_type_check;
alter table public.analytics_events validate constraint analytics_events_session_hash_check;

alter table public.analytics_events alter column session_hash set not null;

drop policy if exists public_insert_analytics on public.analytics_events;

revoke insert on table public.analytics_events from anon, authenticated;
