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

-- ---------------------------------------------------------------------------
-- Messages sent from the contact form, read in the admin's Messages page.
-- ---------------------------------------------------------------------------

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  phone text not null default '' check (char_length(phone) <= 50),
  subject text not null default '' check (char_length(subject) <= 200),
  -- The residence or apartment the visitor was looking at, if any.
  about text not null default '' check (char_length(about) <= 300),
  message text not null check (char_length(message) between 1 and 5000),
  is_read boolean not null default false,
  is_done boolean not null default false
);

alter table public.contact_messages enable row level security;

-- Visitors may send a message, never read one back (theirs or anyone's).
drop policy if exists "contact_messages_send" on public.contact_messages;
create policy "contact_messages_send"
  on public.contact_messages for insert
  to anon, authenticated
  with check (not is_read and not is_done);

-- Signed-in administrators read, mark and delete them.
drop policy if exists "contact_messages_admin" on public.contact_messages;
create policy "contact_messages_admin"
  on public.contact_messages for all
  to authenticated
  using (true)
  with check (true);

-- Then create the administrator account in Authentication → Users,
-- and disable public sign-ups in Authentication → Providers.
