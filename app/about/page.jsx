import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '@/lib/services';
import { waLink } from '@/lib/config';
import { MiscIcon, WhatsAppIcon } from '@/components/Icons';
import HeroTech from '@/components/HeroTech';

export const metadata = {
  title: 'About us',
  description:
    'Ediamond Ltd is a technology solutions company building innovative, reliable and affordable digital solutions for clients worldwide.',
};

const STATS = [
  { value: `${SERVICES.length}+`, label: 'Digital services' },
  { value: 'Worldwide', label: 'Clients, any time zone' },
  { value: 'Fixed', label: 'Quotes before we start' },
  { value: 'WhatsApp', label: 'Fast, direct support' },
];

const VALUES = [
  { icon: 'Users', title: 'Innovative', text: 'Modern tools and fresh thinking applied to real problems, not trends for their own sake.' },
  { icon: 'LifeBuoy', title: 'Reliable', text: 'We deliver what we promise, on the date we agree, and stay available after launch.' },
  { icon: 'BadgeDollarSign', title: 'Affordable', text: 'Clear, honest pricing that works for startups, NGOs, schools and individuals.' },
  { icon: 'Timer', title: 'Global', text: 'We work across countries and time zones, on your schedule.' },
];

const APPROACH = [
  ['Listen first', 'We start by understanding your goals, your users and your budget.'],
  ['Plan clearly', 'You get a simple plan with a timeline and a fixed price before we begin.'],
  ['Build and share', 'You see progress along the way and give feedback before anything goes live.'],
  ['Launch and support', 'We deliver, hand over and keep your solution running smoothly.'],
];

export default function About() {
  return (
    <>
      <section className="hero about-hero">
        <HeroTech />
        <div className="wrap about-hero-in">
          <span className="eyebrow">About Ediamond</span>
          <h1>
            Technology built around <span className="grad">your ideas</span>
          </h1>
          <p className="lead">
            Ediamond Ltd helps businesses, organizations and individuals bring their ideas to life
            through innovative, reliable and affordable digital solutions.
          </p>
          <div className="cta-row">
            <Link href="/request" className="btn btn-primary">
              Request a service <ArrowRight size={18} />
            </Link>
            <Link href="/services" className="btn btn-ghost">Explore services</Link>
          </div>
        </div>
      </section>

      <section className="about-stats-wrap">
        <div className="wrap about-stats">
          {STATS.map((s) => (
            <div key={s.label} className="stat">
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap two">
          <div>
            <h2>Who we are</h2>
            <p>
              Ediamond Ltd is a technology solutions company. We believe good technology should be
              within everyone&apos;s reach, so we focus on solutions that are innovative, reliable and
              affordable.
            </p>
            <p>
              Our team of developers, designers and technology specialists works with clients across
              industries and time zones. From websites and mobile apps to custom software and
              automation, we take your idea from the first conversation to launch, and we stay with
              you afterwards.
            </p>
            <p>
              Every project starts with listening. We learn about your goals, your users and your
              budget, so what we deliver is practical, polished and ready to grow with you.
            </p>
          </div>
          <aside className="mission">
            <span className="eyebrow">Our mission</span>
            <p>
              To make professional digital solutions accessible to every business, organization and
              individual, wherever they are in the world.
            </p>
            <Link href="/contact" className="mission-link">
              Talk to our team <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <h2>What we stand for</h2>
          <p className="sub">The principles behind every project we take on.</p>
          <div className="about-values">
            {VALUES.map((v) => (
              <div key={v.title} className="vcard">
                <span className="vicon"><MiscIcon name={v.icon} size={24} /></span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>How we work</h2>
          <p className="sub">A simple, transparent process from first message to launch day.</p>
          <ol className="about-steps">
            {APPROACH.map(([t, d], i) => (
              <li key={t}>
                <span>{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band">
        <div className="wrap band-in">
          <h2>Have an idea? Let&apos;s talk</h2>
          <div className="cta-row">
            <Link href="/request" className="btn btn-primary">
              Request a service <ArrowRight size={18} />
            </Link>
            <a
              className="btn btn-wa"
              href={waLink('Hello Ediamond, I would like to learn more about your services.')}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}