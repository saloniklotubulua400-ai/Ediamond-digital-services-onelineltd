import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="page-head">
      <div className="wrap">
        <h1>Page not found</h1>
        <p className="lead">That page does not exist or has moved.</p>
        <div className="cta-row">
          <Link href="/" className="btn btn-primary">Go home</Link>
          <Link href="/services" className="btn btn-ghost-dark">Browse services</Link>
        </div>
      </div>
    </section>
  );
}
