import Link from 'next/link';
import { Download, Search } from 'lucide-react';
import { listRequests, STATUSES } from '@/lib/store';
import { SERVICES } from '@/lib/services';
import { fmtDate, slug } from '@/lib/format';
import './admin.css';

export const dynamic = 'force-dynamic';

export default async function Dashboard({ searchParams }) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status) ? sp.status : '';
  const service = sp.service || '';
  const q = (sp.q || '').toLowerCase().trim();

  const all = await listRequests();
  const rows = all.filter(
    (r) =>
      (!status || r.status === status) &&
      (!service || r.serviceSlug === service) &&
      (!q || [r.name, r.phone, r.email, r.ref, r.message].join(' ').toLowerCase().includes(q))
  );
  const count = (s) => all.filter((r) => r.status === s).length;
  const filtered = Boolean(status || service || q);

  return (
    <div className="dash">
      {process.env.ADMIN_PASSWORD === 'change-me-now' && (
        <p className="alert warn">
          You are using the default admin password. Change <code>ADMIN_PASSWORD</code> in{' '}
          <code>.env.local</code> and restart before going live.
        </p>
      )}

      <header className="dash-head">
        <div>
          <h1>Customer requests</h1>
          <p className="dash-sub">
            {filtered ? `${rows.length} of ${all.length} requests` : `${all.length} requests in total`}
          </p>
        </div>
        <a className="btn btn-ghost-dark btn-sm" href="/api/admin/export">
          <Download size={16} /> Download CSV
        </a>
      </header>

      <nav className="dash-tabs" aria-label="Filter by status">
        <Link href="/admin" className={!status ? 'on' : ''} aria-current={!status ? 'page' : undefined}>
          All <b>{all.length}</b>
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin?status=${encodeURIComponent(s)}`}
            className={status === s ? 'on' : ''}
            aria-current={status === s ? 'page' : undefined}
          >
            {s} <b>{count(s)}</b>
          </Link>
        ))}
      </nav>

      <form className="dash-filters" action="/admin">
        <label className="dash-search">
          <Search size={16} aria-hidden="true" />
          <input
            name="q"
            defaultValue={sp.q || ''}
            placeholder="Search name, phone, reference or message"
            aria-label="Search requests"
          />
        </label>
        <select name="service" defaultValue={service} aria-label="Filter by service">
          <option value="">All services</option>
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
          <option value="other">Other / not sure</option>
        </select>
        <select name="status" defaultValue={status} aria-label="Filter by status">
          <option value="">Any status</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <div className="dash-filter-actions">
          <button className="btn btn-primary btn-sm">Apply filters</button>
          {filtered && (
            <Link href="/admin" className="linklike">
              Clear
            </Link>
          )}
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="panel empty">
          <h2>{all.length ? 'No requests match these filters' : 'No requests yet'}</h2>
          <p>
            {all.length ? (
              'Try clearing the filters.'
            ) : (
              <>
                When a customer submits the{' '}
                <Link href="/request" target="_blank">
                  request form
                </Link>
                , it appears here.
              </>
            )}
          </p>
        </div>
      ) : (
        <div className="dash-table">
          <table>
            <thead>
              <tr>
                <th>Ref</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Received</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td data-label="Ref" className="col-ref">
                    <Link href={`/admin/requests/${r.id}`}>{r.ref}</Link>
                  </td>
                  <td data-label="Customer" className="col-customer">
                    <strong>{r.name}</strong>
                    <small>{r.phone}</small>
                  </td>
                  <td data-label="Service">{r.serviceTitle}</td>
                  <td data-label="Received" className="col-date">
                    {fmtDate(r.createdAt)}
                  </td>
                  <td data-label="Status">
                    <span className={`badge ${slug(r.status)}`}>{r.status}</span>
                  </td>
                  <td className="col-action">
                    <Link href={`/admin/requests/${r.id}`} className="btn btn-ghost-dark btn-sm">
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}