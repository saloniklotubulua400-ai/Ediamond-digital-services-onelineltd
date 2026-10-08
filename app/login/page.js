import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { LoginForm } from '@/components/CustomerAuthForms';

export const metadata = { title: 'Log in' };

export default async function LoginPage({ searchParams }) {
  const { next = '' } = await searchParams;
  if (await getCurrentUser()) redirect('/account');
  const q = next ? `?next=${encodeURIComponent(next)}` : '';
  return (
    <div className="auth-page">
      <h1>Log in</h1>
      <p className="lead">See the progress of your requests with Ediamond.</p>
      <LoginForm next={next} />
      <p className="auth-alt">New here? <Link href={`/signup${q}`}>Create an account</Link></p>
    </div>
  );
}
