import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES, getService } from '@/lib/services';
import { ServiceIcon } from '@/components/Icons';

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = getService(slug);
  return s ? { title: s.title, description: s.summary } : {};
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const others = SERVICES.filter((o) => o.group === s.group && o.slug !== s.slug);
  const more = others.length ? others : SERVICES.filter((o) => o.slug !== s.slug).slice(0, 3);

  return (
    <>
      <section className="page-head svc-head" style={{ '--c': s.color }}>
        <div className="wrap">
          <Link href="/services" className="crumb">All services</Link>
          <div className="svc-title">
            <span className="chip big"><ServiceIcon slug={s.slug} size={30} /></span>
            <h1>{s.title}</h1>
          </div>
          <p className="lead">{s.summary}</p>
          <div className="cta-row">
            <Link href={`/request?service=${s.slug}`} className="btn btn-primary">
              Request {s.title} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap two">
          <div>
            <h2>What we can build for you</h2>
            <ul className="checks" style={{ '--c': s.color }}>
              {s.items.map((it) => (
                <li key={it}><Check size={18} aria-hidden="true" /> {it}</li>
              ))}
            </ul>
            <p className="note">Need something that is not listed? Send a request and describe it. We will tell you honestly whether we can do it.</p>
          </div>
          <aside className="side">
            <h3>Related services</h3>
            <ul>
              {more.map((o) => (
                <li key={o.slug}>
                  <Link href={`/services/${o.slug}`}>
                    <i style={{ background: o.color }} /> {o.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
