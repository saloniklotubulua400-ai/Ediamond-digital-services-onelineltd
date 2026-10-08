import Link from 'next/link';
import { SITE, waLink } from '@/lib/config';
import { WhatsAppIcon } from '@/components/Icons';

export const metadata = { title: 'Contact', description: 'Talk to Ediamond Ltd on WhatsApp or send a service request.' };

export default function Contact() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Talk to us</h1>
          <p className="lead">The fastest way to reach us is WhatsApp. If you already know what you need, send a request and we will reply with questions and a quote.</p>
        </div>
      </section>
      <section className="section tight">
        <div className="wrap two">
          <div className="panel">
            <h2>WhatsApp</h2>
            <p className="big-num">{SITE.whatsappDisplay}</p>
            <a className="btn btn-wa" href={waLink('Hello Ediamond, I would like to talk about a project.')} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> Start a chat
            </a>
          </div>
          <div className="panel">
            <h2>Send a request</h2>
            <p>Choose a service, describe your idea and tell us your budget and timeline. Every request gets a reference number so you can quote it when we talk.</p>
            <Link href="/request" className="btn btn-primary">Request a service</Link>
          </div>
        </div>
      </section>
    </>
  );
}
