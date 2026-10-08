'use client';
import { useActionState } from 'react';
import { signup, loginUser } from '@/app/account/actions';

function Field({ id, label, error, ...props }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} aria-invalid={!!error} {...props} />
      {error && <small className="err">{error}</small>}
    </div>
  );
}

export function LoginForm({ next = '' }) {
  const [state, action, pending] = useActionState(loginUser, null);
  return (
    <form action={action} className="panel form">
      <input type="hidden" name="next" value={next} />
      {state?.error && <p className="alert" role="alert">{state.error}</p>}
      <Field id="email" label="Email" type="email" autoComplete="email" required defaultValue={state?.values?.email} />
      <Field id="password" label="Password" type="password" autoComplete="current-password" required />
      <button className="btn btn-primary" disabled={pending}>{pending ? 'Checking…' : 'Log in'}</button>
    </form>
  );
}

export function SignupForm({ next = '' }) {
  const [state, action, pending] = useActionState(signup, null);
  const e = state?.errors || {};
  const v = state?.values || {};
  return (
    <form action={action} className="panel form" noValidate>
      <input type="hidden" name="next" value={next} />
      <Field id="name" label="Your name" autoComplete="name" required defaultValue={v.name} error={e.name} />
      <Field id="email" label="Email" type="email" autoComplete="email" required defaultValue={v.email} error={e.email} />
      <Field id="phone" label="WhatsApp or phone number" type="tel" autoComplete="tel" placeholder="e.g. 0712 345 678" required defaultValue={v.phone} error={e.phone} />
      <div className="row2">
        <Field id="password" label="Password" type="password" autoComplete="new-password" required error={e.password} />
        <Field id="confirm" label="Confirm password" type="password" autoComplete="new-password" required error={e.confirm} />
      </div>
      <button className="btn btn-primary" disabled={pending}>{pending ? 'Creating account…' : 'Create account'}</button>
    </form>
  );
}
