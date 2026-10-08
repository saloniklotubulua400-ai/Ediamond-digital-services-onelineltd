import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { GROUPS } from '@/lib/services';
import { ServiceIcon } from '@/components/Icons';

export const metadata = {
  title: 'Services',
  description: 'Web development, mobile apps, business software, AI, payments, automation, hosting, security and training from Ediamond Ltd.',
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Our services</h1>
          <p className="lead">Choose a service to see what we build, then send a request. Not sure which one you need? Describe your idea and we will advise you.</p>
        </div>
      </section>
      <section className="section tight">
        <div className="wrap">
          {GROUPS.map((g) => (
            <div key={g.name} className="svc-group">
              <div className="svc-group-head">
                <h2>{g.name}</h2>
                <p>{g.blurb}</p>
              </div>
              <ul className="svc-list">
                {g.services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="svc-row" style={{ '--c': s.color }}>
                      <span className="chip"><ServiceIcon slug={s.slug} /></span>
                      <span className="svc-text">
                        <strong>{s.title}</strong>
                        <small>{s.summary}</small>
                      </span>
                      <ChevronRight size={20} className="chev" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
