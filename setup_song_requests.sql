-- Run once in the connected project's Supabase SQL Editor.
-- Song suggestions are private; guests can submit but cannot read the list.
begin;

create table if not exists public.song_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  song_title text not null check (char_length(btrim(song_title)) between 1 and 120),
  artist text check (artist is null or char_length(btrim(artist)) between 1 and 120)
);

alter table public.song_requests enable row level security;
revoke all on public.song_requests from anon, authenticated;
grant insert (id, song_title, artist) on public.song_requests to anon, authenticated;

drop policy if exists "Visitors can suggest songs" on public.song_requests;
create policy "Visitors can suggest songs" on public.song_requests
  for insert to anon, authenticated with check (true);

-- The project owner can review requests in Supabase Table Editor.
-- No public SELECT, UPDATE, or DELETE permissions are granted.
commit;
