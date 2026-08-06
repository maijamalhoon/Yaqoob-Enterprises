alter table public.business_hours
  add column if not exists periods jsonb not null default '[]'::jsonb;

alter table public.business_hours
  drop constraint if exists business_hours_periods_array;

alter table public.business_hours
  add constraint business_hours_periods_array
  check (jsonb_typeof(periods) = 'array');

update public.business_hours
set periods = case weekday
  when 0 then '[{"opens_at":"12:00","closes_at":"00:00","closes_next_day":true}]'::jsonb
  when 5 then '[{"opens_at":"07:00","closes_at":"13:00","closes_next_day":false},{"opens_at":"15:00","closes_at":"23:00","closes_next_day":false}]'::jsonb
  else '[{"opens_at":"07:00","closes_at":"23:00","closes_next_day":false}]'::jsonb
end,
opens_at = case when weekday = 0 then '12:00'::time else '07:00'::time end,
closes_at = case when weekday = 0 then '00:00'::time else '23:00'::time end,
is_closed = false,
updated_at = now();

update public.business_settings
set phone_display = '+92 349 2568864',
    phone_e164 = '+923492568864',
    whatsapp_e164 = '+923492568864',
    address = 'Plot No. 7, Street No. 1, Sector B, Akhtar Colony, Karachi, Pakistan',
    map_url = 'https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A',
    updated_at = now()
where id = true;
