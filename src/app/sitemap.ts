import type { MetadataRoute } from 'next';
import { siteContent } from '@/data/siteContent';
import { SITE_URL } from '@/lib/site';

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/dlya-vas', '/opt', '/zhurnal', '/svyaz'];
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}`, changeFrequency: 'weekly' as const, priority: p ? 0.8 : 1 })),
    ...siteContent.products.map((p) => ({ url: `${BASE}/produkt/${p.slug}`, changeFrequency: 'weekly' as const, priority: 0.9 })),
    ...siteContent.journalArticles.map((a) => ({ url: `${BASE}/zhurnal/${a.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
