'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { USER_COOKIE, makeUserToken, userCookieOptions } from '@/lib/auth';
import { createUser, verifyUser } from '@/lib/users';

const safeNext = (n) =>
  typeof n === 'string' && n.startsWith('/') && !n.startsWith('//') && !n.startsWith('/admin') ? n : '/account';
const val = (fd, k, max = 200) => String(fd.get(k) ?? '').trim().slice(0, max);

export async function signup(_prev, fd) {
  const values = { name: val(fd, 'name', 100), email: val(fd, 'email', 120), phone: val(fd, 'phone', 30), next: val(fd, 'next') };
  const password = String(fd.get('password') ?? '');
  const errors = {};
  if (values.name.length < 2) errors.name = 'Enter your name.';
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email address.';
  if (values.phone.replace(/\D/g, '').length < 9) errors.phone = 'Enter a valid phone or WhatsApp number.';
  if (password.length < 8) errors.password = 'Use at least 8 characters.';
  else if (password !== String(fd.get('confirm') ?? '')) errors.confirm = 'Passwords do not match.';
  if (Object.keys(errors).length) return { errors, values };

  const res = await createUser({ ...values, password });
  if (res.error === 'exists') {
    return { errors: { email: 'An account with this email already exists. Log in instead.' }, values };
  }
  (await cookies()).set(USER_COOKIE, makeUserToken(res.user.id), userCookieOptions);
  redirect(safeNext(values.next));
}

export async function loginUser(_prev, fd) {
  const email = val(fd, 'email', 120);
  const next = val(fd, 'next');
  const user = await verifyUser(email, String(fd.get('password') ?? ''));
  if (!user) {
    await new Promise((r) => setTimeout(r, 700)); // slows down password guessing
    return { error: 'Wrong email or password.', values: { email, next } };
  }
  (await cookies()).set(USER_COOKIE, makeUserToken(user.id), userCookieOptions);
  redirect(safeNext(next));
}

export async function logoutUser() {
  (await cookies()).delete(USER_COOKIE);
  redirect('/');
}
