insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'shop-media',
  'shop-media',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists public_read_shop_media on storage.objects;
drop policy if exists admin_insert_shop_media on storage.objects;
drop policy if exists admin_update_shop_media on storage.objects;
drop policy if exists admin_delete_shop_media on storage.objects;

create policy public_read_shop_media
on storage.objects
for select
to public
using (bucket_id = 'shop-media');

create policy admin_insert_shop_media
on storage.objects
for insert
to authenticated
with check (bucket_id = 'shop-media' and app_private.is_admin());

create policy admin_update_shop_media
on storage.objects
for update
to authenticated
using (bucket_id = 'shop-media' and app_private.is_admin())
with check (bucket_id = 'shop-media' and app_private.is_admin());

create policy admin_delete_shop_media
on storage.objects
for delete
to authenticated
using (bucket_id = 'shop-media' and app_private.is_admin());
