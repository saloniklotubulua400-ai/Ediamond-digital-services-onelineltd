import { headers } from 'next/headers';

// The public address of the site (used in the links Supabase puts in emails).
// Set SITE_URL in .env.local on the live server, e.g. SITE_URL=https://yourdomain.com
export async function siteOrigin() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || (host?.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}
