'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { WhatsAppIcon } from './Icons';
import { SITE, waLink } from '@/lib/config';
import { GROUPS } from '@/lib/services';

export default function Footer() {
  const path = usePathname();
  if (path.startsWith('/admin')) return null;
  return (
    <footer className="site-footer">
      <div className="wrap foot-grid">
        <div>
          <Logo dark />
          <p className="foot-note">{SITE.tagline} Innovation, technology, your success.</p>
          <a className="btn btn-wa" href={waLink('Hello Ediamond, I would like to talk about a project.')} target="_blank" rel="noreferrer">
            <WhatsAppIcon /> {SITE.whatsappDisplay}
          </a>
        </div>
        {GROUPS.slice(0, 4).map((g) => (
          <div key={g.name}>
            <h3>{g.name}</h3>
            <ul>
              {g.services.slice(0, 4).map((s) => (
                <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.title}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="wrap foot-bottom">
        <span>© {new Date().getFullYear()} Ediamond Ltd. Your trusted tech partner.</span>
        <span>
          <Link href="/services">All services</Link> · <Link href="/request">Request a service</Link> · <Link href="/admin/login">Staff login</Link>
        </span>
      </div>
    </footer>
  );
}
