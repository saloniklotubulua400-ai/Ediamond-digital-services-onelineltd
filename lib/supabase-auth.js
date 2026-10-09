import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Supabase client for CUSTOMER login. It uses the PUBLISHABLE key and the customer's own
// session cookies, so it can only do what a logged-in customer is allowed to do.
// (The SECRET key client in lib/supabase.js is only for saving and reading requests.)
export async function createAuthClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in .env.local');

  const jar = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return jar.getAll();
      },
      setAll(list) {
        // Server Components cannot set cookies. That is fine: proxy.js refreshes the session.
        try {
          list.forEach(({ name, value, options }) => jar.set(name, value, options));
        } catch {}
      },
    },
  });
}
