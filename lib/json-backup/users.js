import crypto from 'node:crypto';
import { supabase } from './supabase';

// Same functions as the old JSON version, now backed by the Supabase table `users`.
// Passwords are still salted + hashed with scrypt, so the database never holds a real password.
const isUuid = (v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(v));
const hash = (pw, salt) => crypto.scryptSync(pw, salt, 64);
const publicUser = ({ id, name, email, phone }) => ({ id, name, email, phone });

export async function createUser({ name, email, phone, password }) {
  const salt = crypto.randomBytes(16).toString('hex');
  const { data, error } = await supabase
    .from('users')
    .insert({ name, email: email.toLowerCase(), phone, salt, hash: hash(password, salt).toString('hex') })
    .select('id, name, email, phone')
    .single();
  if (error) {
    if (error.code === '23505') return { error: 'exists' }; // email already registered
    throw new Error(`Supabase error: ${error.message}`);
  }
  return { user: publicUser(data) };
}

export async function verifyUser(email, password) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', String(email).toLowerCase().trim())
    .maybeSingle();
  if (error) throw new Error(`Supabase error: ${error.message}`);
  // Always do the hashing work so timing does not reveal whether the email exists.
  const salt = user?.salt || 'x'.repeat(32);
  const attempt = hash(String(password), salt);
  const stored = Buffer.from(user?.hash || '0'.repeat(128), 'hex');
  const ok = crypto.timingSafeEqual(attempt, stored);
  return ok && user ? publicUser(user) : null;
}

export async function getUserById(id) {
  if (!isUuid(id)) return null;
  const { data, error } = await supabase.from('users').select('id, name, email, phone').eq('id', id).maybeSingle();
  if (error) throw new Error(`Supabase error: ${error.message}`);
  return data ? publicUser(data) : null;
}
