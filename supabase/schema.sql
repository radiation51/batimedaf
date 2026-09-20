-- Run in the Supabase SQL editor.
-- One row holds the whole site content tree as JSON.

create table if not exists public.site_content (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Anyone may read the published content: the public site depends on it.
drop policy if exists "site_content_read" on public.site_content;
create policy "site_content_read"
  on public.site_content for select
  to anon, authenticated
  using (true);

-- Only signed-in administrators may write.
drop policy if exists "site_content_write" on public.site_content;
create policy "site_content_write"
  on public.site_content for all
  to authenticated
  using (true)
  with check (true);

insert into public.site_content (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Storage: pictures uploaded from the admin panel.
-- ---------------------------------------------------------------------------

-- Public bucket: the site reads these URLs without any credentials.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Anyone may read the pictures: the public site displays them.
drop policy if exists "media_read" on storage.objects;
create policy "media_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

-- Only signed-in administrators may add, replace or remove them.
drop policy if exists "media_insert" on storage.objects;
create policy "media_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "media_update" on storage.objects;
create policy "media_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

drop policy if exists "media_delete" on storage.objects;
create policy "media_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');

-- Then create the administrator account in Authentication → Users,
-- and disable public sign-ups in Authentication → Providers.
