'use server';
import { redirect } from 'next/navigation';
import { createAuthClient } from '@/lib/supabase-auth';
import { siteOrigin } from '@/lib/origin';

const safeNext = (n) =>
  typeof n === 'string' && n.startsWith('/') && !n.startsWith('//') && !n.startsWith('/admin') ? n : '/account';
const val = (fd, k, max = 200) => String(fd.get(k) ?? '').trim().slice(0, max);
const wait = () => new Promise((r) => setTimeout(r, 700)); // slows down password guessing

const GENERIC = 'Something went wrong. Please try again in a moment.';
const MAIL_RATE = 'Too many emails were sent. Please wait a few minutes and try again.';
const MAIL_BLOCKED = 'We could not send the email. Please contact us on WhatsApp and we will help.';

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

  let res;
  try {
    const supabase = await createAuthClient();
    res = await supabase.auth.signUp({
      email: values.email,
      password,
      options: {
        data: { name: values.name, phone: values.phone },
        emailRedirectTo: `${await siteOrigin()}/auth/confirm?next=${encodeURIComponent(safeNext(values.next))}`,
      },
    });
  } catch (e) {
    console.error('signup:', e.message);
    return { error: GENERIC, values };
  }

  const { data, error } = res;
  if (error) {
    console.error('signup:', error.code, error.message);
    if (error.code === 'user_already_exists' || error.code === 'email_exists')
      return { errors: { email: 'An account with this email already exists. Log in, or reset your password.' }, values };
    if (error.code === 'weak_password') return { errors: { password: 'Choose a stronger password.' }, values };
    if (error.code === 'over_email_send_rate_limit') return { error: MAIL_RATE, values };
    if (error.code === 'email_address_not_authorized') return { error: MAIL_BLOCKED, values };
    return { error: GENERIC, values };
  }
  // Supabase hides whether an email is already registered: an existing, confirmed email returns no identities.
  if (data.user && data.user.identities?.length === 0)
    return { errors: { email: 'An account with this email already exists. Log in, or reset your password.' }, values };

  if (data.session) redirect(safeNext(values.next)); // email confirmation switched off in Supabase
  return { sent: true, email: values.email, values };
}

export async function loginUser(_prev, fd) {
  const email = val(fd, 'email', 120);
  const next = val(fd, 'next');
  let res;
  try {
    const supabase = await createAuthClient();
    res = await supabase.auth.signInWithPassword({ email, password: String(fd.get('password') ?? '') });
  } catch (e) {
    console.error('login:', e.message);
    return { error: GENERIC, values: { email, next } };
  }
  if (res.error) {
    console.error('login:', res.error.code, res.error.message);
    await wait();
    if (res.error.code === 'email_not_confirmed')
      return { error: 'Please confirm your email first. Check your inbox and spam folder.', unconfirmed: true, values: { email, next } };
    if (res.error.code === 'invalid_credentials') return { error: 'Wrong email or password.', values: { email, next } };
    return { error: GENERIC, values: { email, next } };
  }
  redirect(safeNext(next));
}

export async function resendConfirmation(_prev, fd) {
  const email = val(fd, 'email', 120);
  try {
    const supabase = await createAuthClient();
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${await siteOrigin()}/auth/confirm?next=/account` },
    });
    if (error) {
      console.error('resend:', error.code, error.message);
      return { error: error.code === 'over_email_send_rate_limit' ? MAIL_RATE : 'Could not resend the email. Please wait a minute and try again.' };
    }
  } catch (e) {
    console.error('resend:', e.message);
    return { error: GENERIC };
  }
  return { ok: 'Email sent. Check your inbox and spam folder.' };
}

export async function forgotPassword(_prev, fd) {
  const email = val(fd, 'email', 120);
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: 'Enter a valid email address.', values: { email } };
  try {
    const supabase = await createAuthClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${await siteOrigin()}/auth/confirm?next=/reset-password`,
    });
    if (error) {
      console.error('forgot:', error.code, error.message);
      if (error.code === 'over_email_send_rate_limit') return { error: MAIL_RATE, values: { email } };
      if (error.code === 'email_address_not_authorized') return { error: MAIL_BLOCKED, values: { email } };
      // Supabase unreachable or down: do not claim an email was sent.
      if (error.name === 'AuthRetryableFetchError' || !error.status || error.status >= 500) return { error: GENERIC, values: { email } };
    }
  } catch (e) {
    console.error('forgot:', e.message);
    return { error: GENERIC, values: { email } };
  }
  // Same answer whether or not the email has an account, so nobody can probe for customers.
  return { sent: true, email };
}

export async function updatePassword(_prev, fd) {
  const password = String(fd.get('password') ?? '');
  if (password.length < 8) return { errors: { password: 'Use at least 8 characters.' } };
  if (password !== String(fd.get('confirm') ?? '')) return { errors: { confirm: 'Passwords do not match.' } };
  try {
    const supabase = await createAuthClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.error('updatePassword:', error.code, error.message);
      if (error.code === 'same_password') return { errors: { password: 'Choose a password you have not used before.' } };
      if (error.code === 'weak_password') return { errors: { password: 'Choose a stronger password.' } };
      return { error: 'Your reset link may have expired. Request a new one.' };
    }
  } catch (e) {
    console.error('updatePassword:', e.message);
    return { error: GENERIC };
  }
  redirect('/account');
}

export async function logoutUser() {
  try {
    const supabase = await createAuthClient();
    await supabase.auth.signOut();
  } catch (e) {
    console.error('logout:', e.message);
  }
  redirect('/');
}
