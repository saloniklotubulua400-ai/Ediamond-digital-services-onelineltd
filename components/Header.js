'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { logoutUser } from '@/app/account/actions';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export default function Header({ user }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (path.startsWith('/admin')) return null;

  const active = (href) => (href === '/' ? path === '/' : path.startsWith(href));
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Logo dark />
        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={close} aria-current={active(l.href) ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/account" onClick={close} aria-current={active('/account') ? 'page' : undefined}>My requests</Link>
              <form action={logoutUser} className="nav-form"><button className="nav-link">Log out</button></form>
            </>
          ) : (
            <>
              <Link href="/login" onClick={close} aria-current={active('/login') ? 'page' : undefined}>Log in</Link>
              <Link href="/signup" onClick={close} aria-current={active('/signup') ? 'page' : undefined}>Sign up</Link>
            </>
          )}
          <Link href="/request" className="btn btn-primary btn-sm" onClick={close}>Request a service</Link>
        </nav>
        <button className="menu-btn" onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
