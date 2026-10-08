import { supabase } from './supabase';

// Backed by the Supabase table `requests`.
export const STATUSES = ['New', 'In progress', 'Completed', 'Cancelled'];

const PAGE_SIZE = 1000; // Supabase returns at most 1000 rows per call

const isUuid = (v) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(v));

// Plain-English hints for the most common setup problems
function hintFor(error) {
  const msg = `${error.message || ''} ${error.details || ''}`.toLowerCase();
  if (msg.includes('invalid path') || msg.includes('/rest/v1'))
    return 'The Supabase URL is wrong. Use only https://<project>.supabase.co with nothing after it, then restart the server.';
  if (error.code === 'PGRST205' || error.code === '42P01' || msg.includes('schema cache') || msg.includes('does not exist'))
    return 'The table or column is missing. Run the create-table SQL in the Supabase SQL Editor.';
  if (error.code === '42501' || msg.includes('permission denied') || msg.includes('row-level security'))
    return 'Access blocked. Use the service_role key on the server, or add an RLS policy.';
  if (msg.includes('invalid api key') || msg.includes('jwt'))
    return 'The API key is wrong or missing. Check your .env file and restart the server.';
  if (msg.includes('fetch failed') || msg.includes('network'))
    return 'Cannot reach Supabase. Check the project URL and that the project is not paused.';
  return error.hint || '';
}

function check(error, action) {
  if (!error) return;
  const info = {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    status: error.status,
    cause: error.cause?.message || '',
  };
  console.error(`[requests] ${action} failed:`, JSON.stringify(info, null, 2));
  const text = error.message || error.code || String(error) || 'unknown error';
  const hint = hintFor(error);
  throw new Error(`Supabase error while ${action}: ${text}${hint ? ` | ${hint}` : ''}`);
}

// database row (snake_case) -> the object the pages expect (camelCase)
function toApp(r) {
  if (!r) return null;
  return {
    id: r.id,
    number: r.number,
    ref: `EDL-${String(r.number).padStart(4, '0')}`,
    createdAt: r.created_at,
    status: r.status,
    notes: r.notes ?? '',
    ...(r.user_id ? { userId: r.user_id } : {}),
    name: r.name,
    phone: r.phone,
    email: r.email,
    serviceSlug: r.service_slug,
    serviceTitle: r.service_title,
    budget: r.budget,
    deadline: r.deadline,
    message: r.message,
  };
}

// ---------- Read ----------

export async function listRequests() {
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    check(error, 'loading requests');
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) break; // last page
  }
  return rows.map(toApp);
}

export async function getRequest(id) {
  if (!isUuid(id)) return null;
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  check(error, 'loading a request');
  return toApp(data);
}

// ---------- Write ----------

export async function createRequest(d) {
  const { data, error } = await supabase
    .from('requests')
    .insert({
      user_id: d.userId ?? null,
      name: d.name,
      phone: d.phone,
      email: d.email || '',
      service_slug: d.serviceSlug,
      service_title: d.serviceTitle,
      budget: d.budget || '',
      deadline: d.deadline || '',
      message: d.message,
    })
    .select()
    .single();
  check(error, 'creating a request');
  return toApp(data);
}

export async function updateRequest(id, patch = {}) {
  if (!isUuid(id)) return null;

  const changes = {};
  if (patch.status !== undefined) {
    if (!STATUSES.includes(patch.status)) {
      throw new Error(`Invalid status "${patch.status}". Use one of: ${STATUSES.join(', ')}`);
    }
    changes.status = patch.status;
  }
  if (patch.notes !== undefined) changes.notes = String(patch.notes);

  if (Object.keys(changes).length === 0) return getRequest(id); // nothing to update

  const { data, error } = await supabase
    .from('requests')
    .update(changes)
    .eq('id', id)
    .select()
    .maybeSingle();
  check(error, 'updating a request');
  return toApp(data);
}

export async function deleteRequest(id) {
  if (!isUuid(id)) return;
  const { error } = await supabase.from('requests').delete().eq('id', id);
  check(error, 'deleting a request');
}