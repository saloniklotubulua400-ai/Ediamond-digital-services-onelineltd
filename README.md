# Ediamond website: customer login with Supabase Authentication

Customers now sign up and log in through Supabase Authentication. You see them in
Supabase > Authentication > Users. Includes email verification and password reset.
Staff login (/admin, one shared password) is unchanged.

## 1. In Supabase (one time)

1. SQL Editor > New query > paste `supabase/schema-auth.sql` > Run.
   (Unlinks old test requests from old accounts and links requests to Supabase users.)
2. Settings > API Keys: copy the **Publishable key** (sb_publishable_...) and add to `.env.local`:
       SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx
3. Authentication > URL Configuration:
   - Site URL: http://localhost:3000   (your real domain when you go live)
   - Redirect URLs: add http://localhost:3000/**   (and https://yourdomain.com/** later)
4. Authentication > Sign In / Providers > Email: keep "Confirm email" ON.
   Set minimum password length to 8 (the site also requires 8).
5. EMAIL SENDING (important):
   - Supabase's built-in email service only sends to members of your Supabase team, and only
     a few emails per hour. While testing, sign up with your own Supabase account email.
   - Real customers need custom SMTP: Authentication > Emails > SMTP Settings, with a provider
     such as Brevo, Resend, SendGrid or Mailgun. Do this before you go live.
   - Quick testing trick: turn "Confirm email" OFF while testing; signup then logs in at once.
     Turn it back ON before launch.

## 2. In the project (one command, run inside the project folder)

    mkdir -p backup-before-auth && cp lib/auth.js app/account/actions.js app/login/page.js components/CustomerAuthForms.js backup-before-auth/ && unzip -o ../ediamond-auth-upgrade.zip && npm install @supabase/ssr

Then restart the server (Ctrl + C, then `npm run dev`).

## 3. Test

1. /signup: create an account. You see "Check your email".
2. Open the email link. You land on /account, already logged in.
3. Supabase > Authentication > Users: your customer is listed.
4. Send a request while logged in. In Table Editor > requests, `user_id` equals that user's UID.
5. Log out and log in. Try "Forgot your password?" on /login.

## 4. Clean up (after everything works)

- In schema-auth.sql, step 3 (drop old users table) is commented out. Run it when ready.
- Delete the unused files: `rm lib/users.js scripts/migrate-json-to-supabase.mjs`

## Notes

- Existing test accounts in the old `users` table are not moved (their passwords cannot be copied). Sign up again.
- The default Supabase email link works only in the same browser used to sign up. After you set up
  custom SMTP you can paste `supabase/email-template-*.html` into Authentication > Emails > Templates
  so links work on any device (for example signing up on a laptop, opening the email on a phone).
- On the live server add `SITE_URL=https://yourdomain.com` to the environment settings.
- Keys: SUPABASE_SECRET_KEY (saves requests) stays server-only. The publishable key is also used
  only on the server here. Never put either in a NEXT_PUBLIC_ variable.
