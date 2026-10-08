'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { COOKIE, checkPassword, makeToken, cookieOptions, requireAdmin } from '@/lib/auth';
import { STATUSES, updateRequest, deleteRequest } from '@/lib/store';

export async function login(_prev, formData) {
  if (!checkPassword(formData.get('password'))) {
    await new Promise((r) => setTimeout(r, 700)); // slows down password guessing
    return { error: 'Wrong password. Try again.' };
  }
  (await cookies()).set(COOKIE, makeToken(), cookieOptions);
  redirect('/admin');
}

export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect('/admin/login');
}

export async function setStatus(formData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const status = String(formData.get('status'));
  if (STATUSES.includes(status)) await updateRequest(id, { status });
  revalidatePath('/admin');
  revalidatePath(`/admin/requests/${id}`);
}

export async function saveNotes(formData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  await updateRequest(id, { notes: String(formData.get('notes') || '').slice(0, 3000) });
  revalidatePath(`/admin/requests/${id}`);
}

export async function removeRequest(formData) {
  await requireAdmin();
  await deleteRequest(String(formData.get('id')));
  revalidatePath('/admin');
  redirect('/admin');
}
