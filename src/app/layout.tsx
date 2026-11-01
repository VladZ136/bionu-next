import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Manrope } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { siteContent } from '@/data/siteContent';
import { absoluteUrl, SITE_URL } from '@/lib/site';

const manrope = Manrope({ subsets: ['latin', 'cyrillic'], weight: ['500', '600', '700', '800'], variable: '--font-manrope', display: 'swap' });
const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600', '700'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: siteContent.seo.home.title, template: '%s' },
  description: siteContent.seo.home.description,
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: siteContent.brand.name,
    title: siteContent.seo.home.title,
    description: siteContent.seo.home.description,
    url: SITE_URL,
    images: [{ url: absoluteUrl('/images/og-cover.svg'), width: 1200, height: 630, alt: siteContent.seo.home.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteContent.seo.home.title,
    description: siteContent.seo.home.description,
    images: [absoluteUrl('/images/og-cover.svg')],
  },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = { themeColor: '#F8FAFC' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white">
          К основному содержимому
        </a>
        <CartProvider>
          <Header />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
