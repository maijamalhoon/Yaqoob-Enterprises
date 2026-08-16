drop policy if exists public_insert_analytics on public.analytics_events;

create policy public_insert_analytics
on public.analytics_events
for insert
to anon, authenticated
with check (
  event_name = any (array[
    'page_view'::text,
    'whatsapp_click'::text,
    'call_click'::text,
    'directions_click'::text,
    'service_view'::text
  ])
  and char_length(page_path) between 1 and 240
  and page_path like '/%'
  and (referrer_host is null or char_length(referrer_host) <= 160)
  and (country_code is null or char_length(country_code) <= 8)
  and (city_name is null or char_length(city_name) <= 120)
  and (device_type is null or device_type = any (array['desktop'::text, 'tablet'::text, 'mobile'::text]))
  and session_hash ~ '^[0-9a-f]{64}$'
);
