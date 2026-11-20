-- Apply ONLY after the server-only RPC is live, configured and verified.
-- Blocks all bypass writes using the public Supabase publishable key.
revoke insert on table public.analytics_events from anon, authenticated;
drop policy if exists public_insert_analytics on public.analytics_events;
notify pgrst, 'reload schema';
