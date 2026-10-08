import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getRequest } from '@/lib/store';
import { waLink } from '@/lib/config';
import { fmtDate, slug } from '@/lib/format';
import Progress, { STATUS_TEXT } from '@/components/Progress';
import { WhatsAppIcon } from '@/components/Icons';

export const dynamic = 'force-dynamic';

export default async function MyRequest({ params }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/account/requests/${id}`)}`);
  const r = await getRequest(id);
  if (!r || r.userId !== user.id) notFound();

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <Link href="/account" className="crumb"><ArrowLeft size={16} /> My requests</Link>
          <h1>{r.serviceTitle}</h1>
          <p className="lead">{r.ref} · sent {fmtDate(r.createdAt)} <span className={`badge ${slug(r.status)}`}>{r.status}</span></p>
        </div>
      </section>
      <section className="section tight">
        <div className="wrap narrow">
          <div className="panel">
            <h2>Progress</h2>
            <Progress status={r.status} />
            <p>{STATUS_TEXT[r.status]}</p>
            <a className="btn btn-wa btn-sm" target="_blank" rel="noreferrer"
              href={waLink(`Hello Ediamond, I am asking about my request ${r.ref} (${r.serviceTitle}).`)}>
              <WhatsAppIcon size={16} /> Ask about this request
            </a>
          </div>
          <div className="panel" style={{ marginTop: '1rem' }}>
            <h2>Your request</h2>
            <dl>
              <dt>Budget</dt><dd>{r.budget || '—'}</dd>
              <dt>Needed</dt><dd>{r.deadline || '—'}</dd>
            </dl>
            <p className="msg">{r.message}</p>
          </div>
        </div>
      </section>
    </>
  );
}
