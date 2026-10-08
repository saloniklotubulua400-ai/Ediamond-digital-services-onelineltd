import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import LoginForm from '@/components/LoginForm';
import Logo from '@/components/Logo';

export const metadata = { title: 'Admin sign in', robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect('/admin');
  return (
    <div className="admin-login">
      <Logo />
      <h1>Admin sign in</h1>
      <p>See and manage customer requests.</p>
      <LoginForm />
    </div>
  );
}
