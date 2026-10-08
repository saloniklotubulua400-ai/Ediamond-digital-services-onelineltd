'use client';
import { useActionState } from 'react';
import { login } from '@/app/admin/actions';

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="panel form">
      {state?.error && <p className="alert" role="alert">{state.error}</p>}
      <div className="field">
        <label htmlFor="password">Admin password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      </div>
      <button className="btn btn-primary" disabled={pending}>{pending ? 'Checking…' : 'Sign in'}</button>
    </form>
  );
}
