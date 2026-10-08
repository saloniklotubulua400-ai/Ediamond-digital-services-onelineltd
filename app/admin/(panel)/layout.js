import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { logout } from '../actions';
import Logo from '@/components/Logo';

export const metadata = { title: 'Admin', robots: { index: false } };

export default async function PanelLayout({ children }) {
  await requireAdmin();
  return (
    <div className="admin">
      <header className="admin-bar">
        <div className="wrap bar">
          <Logo />
          <nav className="admin-nav">
            <Link href="/admin">Requests</Link>
            <Link href="/" target="_blank">View website</Link>
            <form action={logout}><button className="linklike">Sign out</button></form>
          </nav>
        </div>
      </header>
      <div className="wrap admin-body">{children}</div>
    </div>
  );
}
