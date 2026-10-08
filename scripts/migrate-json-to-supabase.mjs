// Optional: copies existing data/users.json and data/requests.json into Supabase.
// Run once, from the project folder:
//   node --env-file=.env.local scripts/migrate-json-to-supabase.mjs
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});
const read = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : []);

const users = read('data/users.json').map((u) => ({
  id: u.id, name: u.name, email: u.email, phone: u.phone, salt: u.salt, hash: u.hash, created_at: u.createdAt,
}));
const requests = read('data/requests.json').map((r) => ({
  id: r.id, number: r.number, created_at: r.createdAt, status: r.status, notes: r.notes || '',
  user_id: r.userId || null, name: r.name, phone: r.phone, email: r.email || '',
  service_slug: r.serviceSlug, service_title: r.serviceTitle,
  budget: r.budget || '', deadline: r.deadline || '', message: r.message,
}));

if (users.length) {
  const { error } = await supabase.from('users').upsert(users);
  if (error) throw new Error('Users failed: ' + error.message);
}
if (requests.length) {
  const { error } = await supabase.from('requests').upsert(requests);
  if (error) throw new Error('Requests failed: ' + error.message);
}
console.log(`Done: ${users.length} users and ${requests.length} requests copied.`);
console.log('Now run this in the Supabase SQL Editor so new requests continue the numbering:');
console.log("select setval(pg_get_serial_sequence('public.requests','number'), coalesce(max(number),1)) from public.requests;");
