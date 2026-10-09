'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { signup, loginUser, resendConfirmation, forgotPassword, updatePassword } from '@/app/account/actions';

function Field({ id, label, error, ...props }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} aria-invalid={!!error} {...props} />
      {error && <small className="err">{error}</small>}
    </div>
  );
}

// Small "send the confirmation email again" button (its own form, so it can sit next to another form).
function ResendForm({ email }) {
  const [state, action, pending] = useActionState(resendConfirmation, null);
  return (
    <form action={action} className="resend" style={{ marginTop: "1rem" }}>
      <input type="hidden" name="email" value={email} />
      <button className="linklike" disabled={pending}>{pending ? 'Sending…' : 'Resend confirmation email'}</button>
      {state?.ok && <p className="hint" role="status">{state.ok}</p>}
      {state?.error && <p className="alert" role="alert">{state.error}</p>}
    </form>
  );
}

export function LoginForm({ next = '' }) {
  const [state, action, pending] = useActionState(loginUser, null);
  return (
    <>
      <form action={action} className="panel form">
        <input type="hidden" name="next" value={next} />
        {state?.error && <p className="alert" role="alert">{state.error}</p>}
        <Field id="email" label="Email" type="email" autoComplete="email" required defaultValue={state?.values?.email} />
        <Field id="password" label="Password" type="password" autoComplete="current-password" required />
        <button className="btn btn-primary" disabled={pending}>{pending ? 'Checking…' : 'Log in'}</button>
        <p className="fine"><Link href="/forgot-password">Forgot your password?</Link></p>
      </form>
      {state?.unconfirmed && <ResendForm email={state.values.email} />}
    </>
  );
}

export function SignupForm({ next = '' }) {
  const [state, action, pending] = useActionState(signup, null);
  const e = state?.errors || {};
  const v = state?.values || {};

  if (state?.sent) {
    return (
      <div className="panel done" role="status">
        <h2>Check your email</h2>
        <p>We sent a confirmation link to <strong>{state.email}</strong>. Open it to finish creating your account.</p>
        <p className="fine">Not there? Look in your spam folder, or send it again. Open the link in the same browser you used to sign up.</p>
        <ResendForm email={state.email} />
      </div>
    );
  }

  return (
    <form action={action} className="panel form" noValidate>
      <input type="hidden" name="next" value={next} />
      {state?.error && <p className="alert" role="alert">{state.error}</p>}
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

export function ForgotForm() {
  const [state, action, pending] = useActionState(forgotPassword, null);
  if (state?.sent) {
    return (
      <div className="panel done" role="status">
        <h2>Check your email</h2>
        <p>If an account exists for <strong>{state.email}</strong>, we sent a link to choose a new password.</p>
        <p className="fine">Open the link in the same browser. It expires after a while, so use it soon.</p>
      </div>
    );
  }
  return (
    <form action={action} className="panel form">
      {state?.error && <p className="alert" role="alert">{state.error}</p>}
      <Field id="email" label="Email" type="email" autoComplete="email" required defaultValue={state?.values?.email} />
      <button className="btn btn-primary" disabled={pending}>{pending ? 'Sending…' : 'Send reset link'}</button>
    </form>
  );
}

export function ResetForm() {
  const [state, action, pending] = useActionState(updatePassword, null);
  const e = state?.errors || {};
  return (
    <form action={action} className="panel form" noValidate>
      {state?.error && <p className="alert" role="alert">{state.error}</p>}
      <Field id="password" label="New password" type="password" autoComplete="new-password" required error={e.password} />
      <Field id="confirm" label="Confirm new password" type="password" autoComplete="new-password" required error={e.confirm} />
      <button className="btn btn-primary" disabled={pending}>{pending ? 'Saving…' : 'Save new password'}</button>
    </form>
  );
}
