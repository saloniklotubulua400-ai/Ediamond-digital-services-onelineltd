import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GROUPS, SERVICES, TRUST } from '@/lib/services';
import { SITE, waLink } from '@/lib/config';
import { ServiceIcon, MiscIcon, WhatsAppIcon } from '@/components/Icons';

const STEPS = [
  ['Tell us what you need', 'Pick a service and describe your idea in the request form. It takes about two minutes.'],
  ['We reply with a plan', 'We contact you on WhatsApp or by phone with questions, a timeline and a price.'],
  ['We build and test', 'You see progress along the way and give feedback before anything goes live.'],
  ['We deliver and support', 'We launch your solution, hand it over and stay available for fixes and updates.'],
];

const WHY = [
  { icon: 'Users', title: 'Professional team', text: 'Developers, designers and data people working on one project.' },
  { icon: 'BadgeDollarSign', title: 'Affordable rates', text: 'Clear quotes that fit small businesses, NGOs, schools and individuals.' },
  { icon: 'Timer', title: 'Fast delivery', text: 'We agree a delivery date up front and work to it.' },
  { icon: 'LifeBuoy', title: 'Long-term support', text: 'Monthly maintenance and quick fixes after launch.' },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="hand">Your vision. Our code.</p>
            <h1>
              We build digital solutions for a <span className="grad">smarter tomorrow</span>
            </h1>
            <p className="lead">{SITE.description}</p>
            <div className="cta-row">
              <Link href="/request" className="btn btn-primary">Request a service <ArrowRight size={18} /></Link>
              <Link href="/services" className="btn btn-ghost">Browse all {SERVICES.length} services</Link>
            </div>
          </div>
          <div className="wall" aria-label="Our services">
            {SERVICES.map((s, i) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="tile" title={s.title}
                style={{ '--c': s.color, '--i': i }}>
                <ServiceIcon slug={s.slug} size={24} />
                <span>{s.title}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="wrap trust">
          {TRUST.map((t) => (
            <div key={t.label}><MiscIcon name={t.icon} size={20} /> {t.label}</div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>From websites to AI-powered automation, end to end</h2>
          <p className="sub">Pick what you need or combine several. Every service has its own page with examples of what we build.</p>
          <div className="groups">
            {GROUPS.map((g) => (
              <div key={g.name} className="group">
                <h3>{g.name}</h3>
                <p>{g.blurb}</p>
                <ul>
                  {g.services.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`}>
                        <i style={{ background: s.color }} /> {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <h2>How a request works</h2>
          <ol className="steps">
            {STEPS.map(([t, d], i) => (
              <li key={t}><span>{i + 1}</span><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap why">
          {WHY.map((w) => (
            <div key={w.title}>
              <MiscIcon name={w.icon} size={26} />
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="wrap band-in">
          <h2>Let&apos;s build something great together</h2>
          <div className="cta-row">
            <Link href="/request" className="btn btn-primary">Request a service</Link>
            <a className="btn btn-wa" href={waLink('Hello Ediamond, I would like to talk about a project.')} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
