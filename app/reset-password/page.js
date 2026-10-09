import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ResetForm } from '@/components/CustomerAuthForms';

export const metadata = { title: 'Choose a new password' };
export const dynamic = 'force-dynamic';

export default async function ResetPage() {
  // The link in the reset email logs the customer in; without that, send them to ask for a new link.
  if (!(await getCurrentUser())) redirect('/forgot-password');
  return (
    <div className="auth-page">
      <h1>Choose a new password</h1>
      <p className="lead">Use at least 8 characters.</p>
      <ResetForm />
    </div>
  );
}
