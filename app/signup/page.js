import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { SignupForm } from '@/components/CustomerAuthForms';

export const metadata = { title: 'Sign up' };

export default async function SignupPage({ searchParams }) {
  const { next = '' } = await searchParams;
  if (await getCurrentUser()) redirect('/account');
  const q = next ? `?next=${encodeURIComponent(next)}` : '';
  return (
    <div className="auth-page">
      <h1>Create your account</h1>
      <p className="lead">Send requests faster and follow each one from received to completed.</p>
      <SignupForm next={next} />
      <p className="auth-alt">Already have an account? <Link href={`/login${q}`}>Log in</Link></p>
    </div>
  );
}
