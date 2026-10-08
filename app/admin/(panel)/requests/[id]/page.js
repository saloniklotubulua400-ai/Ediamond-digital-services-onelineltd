import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { getRequest, STATUSES } from '@/lib/store';
import { setStatus, saveNotes, removeRequest } from '../../../actions';
import { toIntl, waLink } from '@/lib/config';
import { fmtDate, slug } from '@/lib/format';
import { WhatsAppIcon } from '@/components/Icons';
import ConfirmButton from '@/components/ConfirmButton';

export const dynamic = 'force-dynamic';

export default async function RequestDetail({ params }) {
  const { id } = await params;
  const r = await getRequest(id);
  if (!r) notFound();
  const wa = `https://wa.me/${toIntl(r.phone)}?text=${encodeURIComponent(`Hello ${r.name}, this is Ediamond Ltd about your request ${r.ref} (${r.serviceTitle}).`)}`;

  return (
    <>
      <Link href="/admin" className="crumb dark"><ArrowLeft size={16} /> All requests</Link>
      <div className="admin-head">
        <h1>{r.ref} <span className={`badge ${slug(r.status)}`}>{r.status}</span></h1>
      </div>

      <div className="two detail">
        <div className="panel">
          <h2>{r.serviceTitle}</h2>
          <p className="meta">Received {fmtDate(r.createdAt)}</p>
          <dl>
            <dt>Budget</dt><dd>{r.budget || '—'}</dd>
            <dt>Needed</dt><dd>{r.deadline || '—'}</dd>
          </dl>
          <h3>Project details</h3>
          <p className="msg">{r.message}</p>
        </div>

        <div className="stack">
          <div className="panel">
            <h2>{r.name}</h2>
            <p className="meta">{r.phone}{r.email ? ` · ${r.email}` : ''}</p>
            {r.userId && <p className="meta">Sent from a customer account (they can see this status).</p>}
            <div className="cta-row">
              <a className="btn btn-wa btn-sm" href={wa} target="_blank" rel="noreferrer"><WhatsAppIcon size={16} /> WhatsApp</a>
              <a className="btn btn-ghost-dark btn-sm" href={`tel:${r.phone}`}><Phone size={16} /> Call</a>
              {r.email && <a className="btn btn-ghost-dark btn-sm" href={`mailto:${r.email}`}><Mail size={16} /> Email</a>}
            </div>
          </div>

          <form action={setStatus} className="panel form">
            <input type="hidden" name="id" value={r.id} />
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={r.status}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button className="btn btn-primary btn-sm">Update status</button>
          </form>

          <form action={saveNotes} className="panel form">
            <input type="hidden" name="id" value={r.id} />
            <div className="field">
              <label htmlFor="notes">Internal notes (customers never see these)</label>
              <textarea id="notes" name="notes" rows={4} defaultValue={r.notes} />
            </div>
            <button className="btn btn-primary btn-sm">Save notes</button>
          </form>

          <form action={removeRequest}>
            <input type="hidden" name="id" value={r.id} />
            <ConfirmButton className="linklike danger" message={`Delete request ${r.ref}? This cannot be undone.`}>
              Delete this request
            </ConfirmButton>
          </form>
        </div>
      </div>
    </>
  );
}
