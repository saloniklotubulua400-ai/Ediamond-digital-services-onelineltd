# Ediamond website: switch from JSON files to Supabase

This upgrade replaces `lib/store.js` and `lib/users.js` so requests and customer accounts
are saved in a Supabase (PostgreSQL) database instead of `data/*.json`.
No page or component changes. All function names and return shapes are the same.

## Steps

1. Create a project at https://supabase.com (New project). Save the database password.
2. Open **SQL Editor > New query**, paste the contents of `supabase/schema.sql`, press **Run**.
3. Open **Settings > API Keys**. Copy the **Project URL** and a **Secret key** (`sb_secret_...`;
   if none exists, create new API keys). Add to the project's `.env.local`:

       SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
       SUPABASE_SECRET_KEY=sb_secret_xxxxxxxxxxxx

4. From inside the project folder (the one with package.json), run ONE command
   (it backs up the old files, copies the new ones and installs the package):

       mkdir -p lib/json-backup && cp lib/store.js lib/users.js lib/json-backup/ && unzip -o ../ediamond-supabase-upgrade.zip && npm install @supabase/supabase-js

5. Optional, only if you already have real data in `data/*.json`:

       node --env-file=.env.local scripts/migrate-json-to-supabase.mjs

   then run the SQL line it prints in the Supabase SQL Editor.
6. `npm run dev`, send a test request, and check **Table Editor > requests** in Supabase.

## Safety rules

- The secret key bypasses all database security. Keep it only in `.env.local` and in your
  hosting provider's environment settings. Never prefix it with `NEXT_PUBLIC_`, never commit it.
- If it ever leaks, create a new secret key in Supabase and delete the old one.
- Row Level Security is switched on for both tables with no public policies, so the public
  (publishable) key cannot read any customer data.
- Supabase returns at most 1000 rows per query. If you ever pass 1000 requests, add paging
  to `listRequests()` in `lib/store.js`.
- If you add a new status in `lib/store.js`, nothing changes in the database (status is plain text).
