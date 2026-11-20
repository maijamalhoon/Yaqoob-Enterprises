-- Keep CMS business identity and customer directions in sync with the
-- two links confirmed by the shop owner. No-op if already correct.
update public.business_settings
set map_url = 'https://maps.app.goo.gl/9ymSnvsS2GdAvEEw5',
    google_business_profile_url = 'https://maps.app.goo.gl/fxKpDcfcnYVKojGv6'
where id = true
  and (
    map_url is distinct from 'https://maps.app.goo.gl/9ymSnvsS2GdAvEEw5'
    or google_business_profile_url is distinct from 'https://maps.app.goo.gl/fxKpDcfcnYVKojGv6'
  );
