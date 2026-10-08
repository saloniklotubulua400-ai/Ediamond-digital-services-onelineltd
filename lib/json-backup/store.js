import { supabase } from './supabase';

// Same functions as the old JSON version, now backed by the Supabase table `requests`.
export const STATUSES = ['New', 'In progress', 'Completed', 'Cancelled'];

const isUuid = (v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(v));

function check(error) {
  if (error) throw new Error(`Supabase error: ${error.message}`);
}

// database row (snake_case)  ->  the object the pages expect (camelCase)
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

export async function listRequests() {
  // Supabase returns at most 1000 rows per call. Add paging if you ever pass that.
  const { data, error } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
  check(error);
  return data.map(toApp);
}

export async function getRequest(id) {
  if (!isUuid(id)) return null;
  const { data, error } = await supabase.from('requests').select('*').eq('id', id).maybeSingle();
  check(error);
  return toApp(data);
}

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
  check(error);
  return toApp(data);
}

export async function updateRequest(id, patch) {
  if (!isUuid(id)) return null;
  const changes = {};
  if (patch.status !== undefined) changes.status = patch.status;
  if (patch.notes !== undefined) changes.notes = patch.notes;
  const { data, error } = await supabase.from('requests').update(changes).eq('id', id).select().maybeSingle();
  check(error);
  return toApp(data);
}

export async function deleteRequest(id) {
  if (!isUuid(id)) return;
  const { error } = await supabase.from('requests').delete().eq('id', id);
  check(error);
}
