-- Storage buckets for guest-visible media (hero photos, amenity videos, logos).
-- Buckets are public-read so magic-link guests can load assets without a session;
-- writes are limited to authenticated hosts.

insert into storage.buckets (id, name, public)
values
  ('media', 'media', true),
  ('branding', 'branding', true)
on conflict (id) do nothing;

create policy "public read media"
  on storage.objects for select
  using (bucket_id in ('media', 'branding'));

create policy "authenticated upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('media', 'branding'));

create policy "authenticated update own media"
  on storage.objects for update to authenticated
  using (bucket_id in ('media', 'branding') and owner = auth.uid());

create policy "authenticated delete own media"
  on storage.objects for delete to authenticated
  using (bucket_id in ('media', 'branding') and owner = auth.uid());
