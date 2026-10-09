import Link from 'next/link';
import { ForgotForm } from '@/components/CustomerAuthForms';

export const metadata = { title: 'Reset your password' };

export default function ForgotPage() {
  return (
    <div className="auth-page">
      <h1>Reset your password</h1>
      <p className="lead">Enter your email and we will send you a link to choose a new password.</p>
      <ForgotForm />
      <p className="auth-alt"><Link href="/login">Back to log in</Link></p>
    </div>
  );
}
