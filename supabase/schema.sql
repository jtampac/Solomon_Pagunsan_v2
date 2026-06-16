-- ===================================================================
-- SOLOMON PAGUNSAN — SUPABASE SCHEMA  (supabase/schema.sql)
-- Run this ONCE in: Supabase dashboard → SQL Editor → New query → Run.
-- It is safe to re-run (idempotent).
--
-- Creates:
--   • profiles      — one row per user, holds the role ('admin')
--   • is_admin()    — helper used by Row Level Security policies
--   • a trigger that gives every new auth user an 'admin' profile
--       (safe ONLY because you keep public sign-ups DISABLED and create
--        the admin user yourself — see README §3)
--   • content       — a single row whose `body` jsonb is the whole site
--   • RLS policies  — public can READ content; only admins can WRITE
--   • a public Storage bucket `site-images` (public read, admin write)
-- ===================================================================

-- ------------------------------------------------------------------
-- 1) PROFILES  (roles)
-- ------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- ------------------------------------------------------------------
-- 2) is_admin() helper
-- ------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ------------------------------------------------------------------
-- 3) Auto-create an admin profile for each new auth user
--    Keep public sign-ups DISABLED so only YOU can create users.
-- ------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------
-- 4) CONTENT  (single-row store for the whole website)
-- ------------------------------------------------------------------
create table if not exists public.content (
  id         integer primary key default 1,
  body       jsonb not null,
  updated_at timestamptz not null default now(),
  constraint content_singleton check (id = 1)
);

alter table public.content enable row level security;

-- anyone (including anonymous visitors) may READ the content
drop policy if exists "content_public_read" on public.content;
create policy "content_public_read"
  on public.content for select
  using (true);

-- only admins may INSERT / UPDATE / DELETE
drop policy if exists "content_admin_write" on public.content;
create policy "content_admin_write"
  on public.content for all
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------------
-- 5) STORAGE  bucket for uploaded images
-- ------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

-- public read of files in the bucket
drop policy if exists "site_images_public_read" on storage.objects;
create policy "site_images_public_read"
  on storage.objects for select
  using (bucket_id = 'site-images');

-- only admins may upload / change / remove files
drop policy if exists "site_images_admin_insert" on storage.objects;
create policy "site_images_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "site_images_admin_update" on storage.objects;
create policy "site_images_admin_update"
  on storage.objects for update
  using (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "site_images_admin_delete" on storage.objects;
create policy "site_images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'site-images' and public.is_admin());

-- ------------------------------------------------------------------
-- DONE. Next: run supabase/seed_content.sql to load the website content.
-- ------------------------------------------------------------------
