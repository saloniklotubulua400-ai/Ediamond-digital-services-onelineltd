import { NextResponse } from 'next/server';
import { createRequest } from '@/lib/store';
import { getService } from '@/lib/services';
import { getCurrentUser } from '@/lib/auth';

const clean = (v, max) => String(v ?? '').trim().slice(0, max);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
  }

  // Spam trap: bots fill the hidden field. Pretend it worked.
  if (clean(body.website, 100)) return NextResponse.json({ ok: true, ref: 'EDL-0000' });

  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 120);
  const slug = clean(body.service, 60);
  const message = clean(body.message, 3000);

  const errors = {};
  if (name.length < 2) errors.name = 'Enter your name.';
  if (phone.replace(/\D/g, '').length < 9) errors.phone = 'Enter a valid phone or WhatsApp number.';
  if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (slug !== 'other' && !getService(slug)) errors.service = 'Choose a service.';
  if (message.length < 10) errors.message = 'Describe your project in at least a sentence.';
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });

  const user = await getCurrentUser();
  const rec = await createRequest({
    ...(user ? { userId: user.id } : {}),
    name, phone, email,
    serviceSlug: slug,
    serviceTitle: slug === 'other' ? 'Other / not sure' : getService(slug).title,
    budget: clean(body.budget, 60),
    deadline: clean(body.deadline, 60),
    message,
  });
  return NextResponse.json({ ok: true, ref: rec.ref });
}
