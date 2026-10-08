import { createClient } from '@supabase/supabase-js';

// SERVER ONLY. The secret key bypasses all security rules, so never import this
// file from a component that has 'use client' and never put the key in NEXT_PUBLIC_*.
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local');
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
