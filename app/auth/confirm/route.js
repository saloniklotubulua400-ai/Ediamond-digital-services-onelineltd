import { NextResponse } from 'next/server';
import { createAuthClient } from '@/lib/supabase-auth';
import { siteOrigin } from '@/lib/origin';

// Where the links in Supabase emails land (confirm email, reset password).
// Supports both link styles:
//   ?token_hash=...&type=...  (custom email templates, works on any device)
//   ?code=...                 (Supabase default templates, same browser only)
const TYPES = ['email', 'signup', 'recovery', 'invite', 'magiclink', 'email_change'];
const safeNext = (n) => (typeof n === 'string' && n.startsWith('/') && !n.startsWith('//') && !n.startsWith('/admin') ? n : '/account');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const origin = await siteOrigin();
  const next = safeNext(searchParams.get('next'));
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const code = searchParams.get('code');

  let error = null;
  try {
    const supabase = await createAuthClient();
    if (token_hash && TYPES.includes(type)) ({ error } = await supabase.auth.verifyOtp({ type, token_hash }));
    else if (code) ({ error } = await supabase.auth.exchangeCodeForSession(code));
    else error = new Error('No token in the link');
  } catch (e) {
    error = e;
  }

  if (error) {
    console.error('auth/confirm:', error.message);
    return NextResponse.redirect(`${origin}/login?error=link`);
  }
  return NextResponse.redirect(`${origin}${next}`);
}
