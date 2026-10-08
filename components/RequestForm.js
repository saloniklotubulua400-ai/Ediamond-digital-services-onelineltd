'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from './Icons';
import { waLink } from '@/lib/config';

const BUDGETS = ['Not sure yet', 'Under KES 20,000', 'KES 20,000 – 50,000', 'KES 50,000 – 150,000', 'Above KES 150,000'];
const DEADLINES = ['As soon as possible', 'Within 2 weeks', 'Within a month', 'I am flexible'];

export default function RequestForm({ services, initialService = '', user = null }) {
  const [state, setState] = useState({ status: 'idle', errors: {}, ref: '', message: '' });
  const [serviceTitle, setServiceTitle] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState({ status: 'sending', errors: {}, ref: '', message: '' });
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setState({ status: 'error', errors: json.errors || {}, ref: '', message: json.message || 'Please check the highlighted fields.' });
        return;
      }
      setServiceTitle(services.find((s) => s.slug === data.service)?.title || 'Other');
      setState({ status: 'done', errors: {}, ref: json.ref, message: '' });
      form.reset();
    } catch {
      setState({ status: 'error', errors: {}, ref: '', message: 'Could not send your request. Check your internet connection and try again.' });
    }
  }

  if (state.status === 'done') {
    return (
      <div className="panel done" role="status">
        <CheckCircle2 size={44} />
        <h2>Request received</h2>
        <p>Your reference is <strong>{state.ref}</strong>. We will contact you on the number you gave, usually within one working day.</p>
        {user && <p><Link href="/account">Follow its progress in My requests.</Link></p>}
        <p>Want a faster reply? Send us a WhatsApp message with your reference.</p>
        <div className="cta-row">
          <a className="btn btn-wa" target="_blank" rel="noreferrer"
            href={waLink(`Hello Ediamond, I just sent request ${state.ref} for ${serviceTitle}.`)}>
            <WhatsAppIcon /> Message us on WhatsApp
          </a>
          <button className="btn btn-ghost-dark" onClick={() => setState({ status: 'idle', errors: {}, ref: '', message: '' })}>
            Send another request
          </button>
        </div>
      </div>
    );
  }

  const err = (k) => state.errors[k];
  const busy = state.status === 'sending';

  return (
    <form className="panel form" onSubmit={onSubmit} noValidate>
      {state.message && <p className="alert" role="alert">{state.message}</p>}
      {!user && (
        <p className="hint">
          Want to follow your request&apos;s progress? <Link href="/login?next=/request">Log in</Link> or <Link href="/signup?next=/request">sign up</Link> first.
        </p>
      )}

      <div className="field">
        <label htmlFor="service">Service you need</label>
        <select id="service" name="service" defaultValue={initialService} required aria-invalid={!!err('service')}>
          <option value="" disabled>Choose a service</option>
          {services.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
          <option value="other">Other / not sure</option>
        </select>
        {err('service') && <small className="err">{err('service')}</small>}
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" defaultValue={user?.name} autoComplete="name" required aria-invalid={!!err('name')} />
          {err('name') && <small className="err">{err('name')}</small>}
        </div>
        <div className="field">
          <label htmlFor="phone">WhatsApp or phone number</label>
          <input id="phone" name="phone" type="tel" defaultValue={user?.phone} autoComplete="tel" placeholder="e.g. 0712 345 678" required aria-invalid={!!err('phone')} />
          {err('phone') && <small className="err">{err('phone')}</small>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="email">Email <span className="opt">(optional)</span></label>
        <input id="email" name="email" type="email" defaultValue={user?.email} autoComplete="email" aria-invalid={!!err('email')} />
        {err('email') && <small className="err">{err('email')}</small>}
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="budget">Budget</label>
          <select id="budget" name="budget" defaultValue={BUDGETS[0]}>
            {BUDGETS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="deadline">When do you need it?</label>
          <select id="deadline" name="deadline" defaultValue={DEADLINES[0]}>
            {DEADLINES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="message">Tell us about your project</label>
        <textarea id="message" name="message" rows={5} required aria-invalid={!!err('message')}
          placeholder="What do you want to build or fix? Who will use it? Any examples you like?" />
        {err('message') && <small className="err">{err('message')}</small>}
      </div>

      {/* Hidden spam trap: real people never fill this in. */}
      <div className="trap" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <button className="btn btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send request'}</button>
      <p className="fine">By sending this form you agree that we may contact you about your request. See <Link href="/contact">other ways to reach us</Link>.</p>
    </form>
  );
}
