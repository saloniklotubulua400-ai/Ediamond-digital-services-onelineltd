import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const COOKIE = 'ediamond_admin';
const WEEK = 7 * 24 * 60 * 60 * 1000;

const secret = () => process.env.AUTH_SECRET || 'dev-only-secret';
const sign = (v) => crypto.createHmac('sha256', secret()).update(v).digest('hex');
const sha = (v) => crypto.createHash('sha256').update(String(v)).digest();

export function checkPassword(input) {
  const expected = process.env.ADMIN_PASSWORD || 'change-me-now';
  return crypto.timingSafeEqual(sha(input || ''), sha(expected));
}

export function makeToken() {
  const exp = String(Date.now() + WEEK);
  return `${exp}.${sign(exp)}`;
}

export function verifyToken(token) {
  if (!token) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(exp));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now();
}

export async function isAdmin() {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login');
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: WEEK / 1000,
};

// ---------- Customer accounts ----------
import { getUserById } from './users';

export const USER_COOKIE = 'ediamond_user';
const MONTH = 30 * 24 * 60 * 60 * 1000;
export const userCookieOptions = { ...cookieOptions, maxAge: MONTH / 1000 };

export function makeUserToken(userId) {
  const body = `${userId}.${Date.now() + MONTH}`;
  return `${body}.${sign(body)}`;
}

export function verifyUserToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [id, exp, sig] = parts;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(`${id}.${exp}`));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return Number(exp) > Date.now() ? id : null;
}

export async function getCurrentUser() {
  const jar = await cookies();
  const id = verifyUserToken(jar.get(USER_COOKIE)?.value);
  return id ? getUserById(id) : null;
}
