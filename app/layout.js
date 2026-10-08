import '@fontsource-variable/sora';
import '@fontsource-variable/dm-sans';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCurrentUser } from '@/lib/auth';

export const metadata = {
  title: { default: 'Ediamond Ltd | Websites, apps, software, AI and automation', template: '%s | Ediamond Ltd' },
  description:
    'Ediamond Ltd builds websites, mobile apps, business software, AI and automation. Browse our services and send a request in two minutes.',
};

export const viewport = { themeColor: '#060e26' };

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <Header user={user ? { name: user.name } : null} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
