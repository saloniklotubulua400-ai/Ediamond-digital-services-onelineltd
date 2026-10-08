import Link from 'next/link';

export function LogoMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#35d0ff" />
          <stop offset="1" stopColor="#1d62ff" />
        </linearGradient>
      </defs>
      <path d="M24 3 42 13.5v21L24 45 6 34.5v-21Z" fill="url(#lg)" />
      <path d="M16 17h17v4.5H21v3h10v4.5H21v3h12V32H16Z" fill="#fff" />
    </svg>
  );
}

export default function Logo({ dark = false }) {
  return (
    <Link href="/" className={`logo ${dark ? 'logo-dark' : ''}`} aria-label="Ediamond Ltd home">
      <LogoMark />
      <span className="logo-text">
        <strong>Ediamond</strong> <span>Ltd</span>
      </span>
    </Link>
  );
}
