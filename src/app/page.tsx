import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Layers, ShieldCheck } from 'lucide-react';
import { siteContent } from '@/data/siteContent';
import { bundle, formatPrice, products } from '@/lib/catalog';
import { BundleCard, HeroMiniCard, ProductCard } from '@/components/Catalog';
import { MechanismSection } from '@/components/MechanismSection';
import { ScenarioNavigator } from '@/components/ScenarioNavigator';
import { DeclarationsSection } from '@/components/Declarations';
import { JournalPreview, Marquee, QuickContact, SectionHead } from '@/components/Sections';
import { AddToCart, BundleVisual } from '@/components/ui';
import { absoluteUrl } from '@/lib/site';

const { hero } = siteContent;

export const metadata: Metadata = {
  title: siteContent.seo.home.title,
  description: siteContent.seo.home.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteContent.brand.manufacturer,
    url: absoluteUrl('/'),
    email: siteContent.brand.email,
    telephone: siteContent.brand.phones[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Рябиновая, д. 44, пом. I, комн. 33',
      addressLocality: 'Москва',
      postalCode: '121471',
      addressCountry: 'RU',
    },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteContent.brand.name,
    url: absoluteUrl('/'),
    inLanguage: 'ru-RU',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,#000_30%,transparent_75%)]" />
        <div className="absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -left-40 top-40 h-[28rem] w-[28rem] rounded-full bg-rose-200/30 blur-3xl" />

        <div className="container-x relative grid gap-12 pb-16 pt-10 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 py-1.5 pl-2 pr-3.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900">
                <ShieldCheck className="h-3 w-3 text-white" />
              </span>
              {hero.badge}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-[3.6rem]">{hero.headline}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">{hero.subheadline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#catalog" className="btn-dark h-12 px-6">
                {hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/opt" className="btn-light h-12 px-6">
                <Layers className="h-4 w-4" /> {hero.ctaSecondary}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              {products.map((p) => (
                <HeroMiniCard key={p.id} product={p} />
              ))}
            </div>
            <div className="card grid overflow-hidden sm:grid-cols-[180px_1fr]">
              <BundleVisual className="h-40 sm:h-full" />
              <div className="p-5">
                <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{bundle.badge}</span>
                <p className="mt-2.5 font-display text-lg font-bold leading-snug text-slate-900">Выгодный комплект: 3 средства</p>
                <p className="mt-1 text-sm text-slate-500">Лосьон-спрей + Крем-гель МА-1 + Гель водный МА-1</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-slate-900">{formatPrice(bundle.price)}</span>
                  <span className="font-mono text-sm text-slate-400 line-through">{formatPrice(bundle.oldPrice)}</span>
                </div>
                <AddToCart id={bundle.id} withQty={false} label="Комплект в корзину" className="mt-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Ключевые факты о системе" className="border-y border-slate-200/80 bg-white">
        <div className="container-x grid gap-3 py-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['01', '3 формы ухода', 'Спрей, водный гель и крем-гель'],
            ['02', 'Документы открыты', 'Декларации ЕАЭС доступны в PDF'],
            ['03', 'Сделано в России', 'Производитель — ООО «РУСПЕНТА»'],
            ['04', 'Подбор по ситуации', 'Готовые протоколы ухода'],
          ].map(([num, title, text]) => (
            <div key={num} className="rounded-xl bg-slate-50 px-4 py-3">
              <span className="font-mono text-[10px] font-bold text-sky-600">{num}</span>
              <p className="mt-1 font-semibold text-slate-900">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <Marquee />

      {/* ───────── ВИТРИНА ───────── */}
      <section id="catalog" className="section scroll-mt-20">
        <div className="container-x">
          <SectionHead
            kicker="Линейка · 3 формы ухода"
            title="Спрей готовит — гель закрывает"
            lead={siteContent.brand.tagline}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            <BundleCard />
          </div>
        </div>
      </section>

      <MechanismSection />

      {/* ───────── СЦЕНАРИИ ───────── */}
      <section id="scenarios" className="section scroll-mt-20">
        <div className="container-x">
          <SectionHead kicker="Навигатор ухода" title="Сценарии применения" lead="Выберите ситуацию — покажем протокол ухода и рекомендуемую связку средств.">
            <Link href="/dlya-vas" className="btn-light shrink-0">
              Протокол SOS-ухода <ArrowRight className="h-4 w-4" />
            </Link>
          </SectionHead>
          <div className="mt-10">
            <ScenarioNavigator />
          </div>
        </div>
      </section>

      <div className="border-y border-slate-200/80 bg-white">
        <DeclarationsSection />
      </div>

      <JournalPreview />
      <QuickContact />
    </>
  );
}
