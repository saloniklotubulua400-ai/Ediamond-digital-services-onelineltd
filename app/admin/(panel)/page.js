import Link from 'next/link';
import { Download } from 'lucide-react';
import { listRequests, STATUSES } from '@/lib/store';
import { SERVICES } from '@/lib/services';
import { fmtDate, slug } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function Dashboard({ searchParams }) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status) ? sp.status : '';
  const service = sp.service || '';
  const q = (sp.q || '').toLowerCase().trim();

  const all = await listRequests();
  const rows = all.filter((r) =>
    (!status || r.status === status) &&
    (!service || r.serviceSlug === service) &&
    (!q || [r.name, r.phone, r.email, r.ref, r.message].join(' ').toLowerCase().includes(q))
  );
  const count = (s) => all.filter((r) => r.status === s).length;
  const filtered = status || service || q;

  return (
    <>
      {process.env.ADMIN_PASSWORD === 'change-me-now' && (
        <p className="alert warn">You are using the default admin password. Change <code>ADMIN_PASSWORD</code> in <code>.env.local</code> and restart before going live.</p>
      )}
      <div className="admin-head">
        <h1>Customer requests</h1>
        <a className="btn btn-ghost-dark btn-sm" href="/api/admin/export"><Download size={16} /> Download CSV</a>
      </div>

      <div className="stats">
        <Link href="/admin" className={!status ? 'on' : ''}><b>{all.length}</b> All</Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin?status=${encodeURIComponent(s)}`} className={status === s ? 'on' : ''}>
            <b>{count(s)}</b> {s}
          </Link>
        ))}
      </div>

      <form className="filters" action="/admin">
        <input name="q" defaultValue={sp.q || ''} placeholder="Search name, phone, reference or message" aria-label="Search requests" />
        <select name="service" defaultValue={service} aria-label="Filter by service">
          <option value="">All services</option>
          {SERVICES.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
          <option value="other">Other / not sure</option>
        </select>
        <select name="status" defaultValue={status} aria-label="Filter by status">
          <option value="">Any status</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="btn btn-primary btn-sm">Filter</button>
        {filtered && <Link href="/admin" className="linklike">Clear</Link>}
      </form>

      {rows.length === 0 ? (
        <div className="panel empty">
          <h2>{all.length ? 'No requests match these filters' : 'No requests yet'}</h2>
          <p>{all.length ? 'Try clearing the filters.' : <>When a customer submits the <Link href="/request" target="_blank">request form</Link>, it appears here.</>}</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Ref</th><th>Customer</th><th>Service</th><th>Received</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td><Link href={`/admin/requests/${r.id}`}>{r.ref}</Link></td>
                  <td><strong>{r.name}</strong><br /><small>{r.phone}</small></td>
                  <td>{r.serviceTitle}</td>
                  <td>{fmtDate(r.createdAt)}</td>
                  <td><span className={`badge ${slug(r.status)}`}>{r.status}</span></td>
                  <td><Link href={`/admin/requests/${r.id}`} className="btn btn-ghost-dark btn-sm">Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
