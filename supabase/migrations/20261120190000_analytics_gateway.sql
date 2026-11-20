-- Additive first stage: keep the legacy insert grant until the new
-- server-only RPC has been deployed and its ingestion has been verified.
-- This migration creates NO credentials; configure the credential out-of-band.
create schema if not exists analytics_internal;
revoke all on schema analytics_internal from public;
grant usage on schema analytics_internal to anon;

create table if not exists analytics_internal.ingest_credential (
  singleton boolean primary key default true check (singleton),
  secret_hash text not null check (secret_hash ~ '^[0-9a-f]{64}$'),
  rotated_at timestamptz not null default now()
);
revoke all on table analytics_internal.ingest_credential from public, anon, authenticated;
alter table analytics_internal.ingest_credential enable row level security;

create or replace function analytics_internal.record_event(
  p_secret text, p_event jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  authorized boolean;
  event_name text;
  page_path text;
  session_hash text;
begin
  -- Token is random 256-bit hex; only its SHA-256 hash exists in the DB.
  select (secret_hash = pg_catalog.encode(pg_catalog.sha256(
    pg_catalog.convert_to(p_secret, 'UTF8')
  ), 'hex')) into authorized
  from analytics_internal.ingest_credential
  where singleton = true;

  if authorized is distinct from true then
    raise exception 'Analytics ingest authorization failed' using errcode = '42501';
  end if;

  if p_event is null
     or pg_catalog.jsonb_typeof(p_event) is distinct from 'object'
     or pg_catalog.octet_length(p_event::text) > 2048 then
    raise exception 'Invalid analytics payload' using errcode = '22023';
  end if;

  event_name := p_event->>'event_name';
  page_path := p_event->>'page_path';
  session_hash := p_event->>'session_hash';

  if event_name is null
      or event_name not in ('page_view','whatsapp_click','call_click','directions_click','service_view')
      or page_path is null or length(page_path) not between 1 and 240
      or left(page_path,1) <> '/'
      or page_path = '/admin' or left(page_path,7) = '/admin/'
      or session_hash is null or session_hash !~ '^[0-9a-f]{64}$'
      or (p_event->>'referrer_host') is not null and length(p_event->>'referrer_host') > 160
      or (p_event->>'country_code') is not null and length(p_event->>'country_code') > 8
      or (p_event->>'city_name') is not null and length(p_event->>'city_name') > 120
      or (p_event->>'device_type') is not null and p_event->>'device_type' not in ('mobile','tablet','desktop')
      or (p_event->>'utm_source') is not null and length(p_event->>'utm_source') > 80
      or (p_event->>'utm_medium') is not null and length(p_event->>'utm_medium') > 80
      or (p_event->>'utm_campaign') is not null and length(p_event->>'utm_campaign') > 120 then
    raise exception 'Invalid analytics payload' using errcode = '22023';
  end if;

  insert into public.analytics_events (
    event_name, page_path, referrer_host, country_code, city_name,
    device_type, session_hash, utm_source, utm_medium, utm_campaign
  ) values (
    event_name, page_path, p_event->>'referrer_host', p_event->>'country_code',
    p_event->>'city_name', p_event->>'device_type', session_hash,
    p_event->>'utm_source', p_event->>'utm_medium', p_event->>'utm_campaign'
  );
end
$function$;
revoke all on function analytics_internal.record_event(text, jsonb) from public, authenticated;
grant execute on function analytics_internal.record_event(text, jsonb) to anon;

-- Public endpoint uses invoker privilege; the narrow privileged function
-- remains outside exposed API schemas.
create or replace function public.record_public_analytics_event(
  p_secret text, p_event jsonb
)
returns void
language sql
security invoker
set search_path = ''
as $function$
  select analytics_internal.record_event(p_secret, p_event);
$function$;
revoke all on function public.record_public_analytics_event(text, jsonb) from public, authenticated;
grant execute on function public.record_public_analytics_event(text, jsonb) to anon;

notify pgrst, 'reload schema';
