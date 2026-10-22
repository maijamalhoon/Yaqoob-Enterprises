update public.business_hours
set
  opens_at = case weekday
    when 0 then '16:00'::time
    else '09:00'::time
  end,
  closes_at = case weekday
    when 0 then '22:30'::time
    else '23:00'::time
  end,
  periods = case weekday
    when 0 then '[{"opens_at":"16:00","closes_at":"22:30","closes_next_day":false}]'::jsonb
    when 5 then '[{"opens_at":"09:00","closes_at":"13:00","closes_next_day":false},{"opens_at":"14:30","closes_at":"23:00","closes_next_day":false}]'::jsonb
    else '[{"opens_at":"09:00","closes_at":"23:00","closes_next_day":false}]'::jsonb
  end,
  is_closed = false,
  updated_at = now()
where weekday between 0 and 6;

update public.business_settings
set google_business_profile_url = 'https://share.google/NGlOWIpFa4h80iRaY',
    updated_at = now()
where id = true;
