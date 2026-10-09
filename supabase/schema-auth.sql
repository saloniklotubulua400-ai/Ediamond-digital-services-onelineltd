-- Run ONCE in Supabase: SQL Editor > New query > paste > Run.
-- Moves customer accounts from our own `users` table to Supabase Authentication.

-- 1) Old test requests point at old accounts that will not exist in Supabase Authentication,
--    so unlink them (the requests themselves are kept).
alter table public.requests drop constraint if exists requests_user_id_fkey;
update public.requests set user_id = null;

-- 2) From now on a request's user_id must be a Supabase Authentication user.
alter table public.requests
  add constraint requests_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null;

-- 3) OPTIONAL, only after you have confirmed that signup and login work:
--    remove the old custom accounts table.
-- drop table if exists public.users;
