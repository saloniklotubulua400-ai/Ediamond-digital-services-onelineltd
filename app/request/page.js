import RequestForm from '@/components/RequestForm';
import { SERVICES } from '@/lib/services';
import { getCurrentUser } from '@/lib/auth';

export const metadata = {
  title: 'Request a service',
  description: 'Tell Ediamond Ltd what you need. We reply with questions, a timeline and a quote.',
};

export default async function RequestPage({ searchParams }) {
  const { service } = await searchParams;
  const user = await getCurrentUser();
  const initial = SERVICES.some((s) => s.slug === service) ? service : '';
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Request a service</h1>
          <p className="lead">Tell us what you need. We will contact you with questions, a timeline and a quote.</p>
        </div>
      </section>
      <section className="section tight">
        <div className="wrap narrow">
          <RequestForm services={SERVICES.map(({ slug, title }) => ({ slug, title }))} initialService={initial} user={user} />
        </div>
      </section>
    </>
  );
}
