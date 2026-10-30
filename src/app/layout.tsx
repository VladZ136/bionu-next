import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Manrope } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { siteContent } from '@/data/siteContent';

const manrope = Manrope({ subsets: ['latin', 'cyrillic'], weight: ['500', '600', '700', '800'], variable: '--font-manrope', display: 'swap' });
const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600', '700'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://bionu.online'),
  title: { default: siteContent.seo.home.title, template: '%s' },
  description: siteContent.seo.home.description,
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: siteContent.brand.name,
    title: siteContent.seo.home.title,
    description: siteContent.seo.home.description,
  },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = { themeColor: '#F8FAFC' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
