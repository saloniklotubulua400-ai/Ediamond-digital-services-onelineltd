import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { listRequests } from '@/lib/store';
import { fmtDate, slug } from '@/lib/format';
import Progress from '@/components/Progress';

export const metadata = { title: 'My requests' };
export const dynamic = 'force-dynamic';

export default async function Account() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/account');
  const mine = (await listRequests()).filter((r) => r.userId === user.id);

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Hello, {user.name.split(' ')[0]}</h1>
          <p className="lead">Follow every request you have sent to Ediamond.</p>
          <div className="cta-row"><Link href="/request" className="btn btn-primary">New request</Link></div>
        </div>
      </section>
      <section className="section tight">
        <div className="wrap">
          {mine.length === 0 ? (
            <div className="panel empty">
              <h2>No requests yet</h2>
              <p>Requests you send while logged in appear here with live progress.</p>
              <Link href="/request" className="btn btn-primary">Request a service</Link>
            </div>
          ) : (
            <ul className="req-list">
              {mine.map((r) => (
                <li key={r.id}>
                  <Link href={`/account/requests/${r.id}`} className="req-card">
                    <div className="req-top">
                      <strong>{r.serviceTitle}</strong>
                      <span className={`badge ${slug(r.status)}`}>{r.status}</span>
                    </div>
                    <small>{r.ref} · sent {fmtDate(r.createdAt)}</small>
                    <Progress status={r.status} mini />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
