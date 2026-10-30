import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, ChevronRight, FlaskConical, ShieldCheck } from 'lucide-react';
import { siteContent } from '@/data/siteContent';
import { accent, bundle, formatPrice, getProduct, products } from '@/lib/catalog';
import { AddToCart, BundleVisual, MarketplaceMenu, ProductVisual } from '@/components/ui';
import { DeclarationButton } from '@/components/Declarations';
import { Disclaimer } from '@/components/Sections';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.badge.toLowerCase()} · ${formatPrice(p.price)} | ООО «РУСПЕНТА»`,
    description: p.shortDesc,
    openGraph: { images: [p.image] },
  };
}

function splitSteps(text: string): string[] {
  return text
    .split(/(?<=\.)\s+(?=[А-ЯЁA-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const a = accent[product.accentColor];
  const others = products.filter((p) => p.id !== product.id);
  const d = product.declaration;
  const relatedScenarios = siteContent.scenarios.filter((s) => s.recommendedProducts.includes(product.id));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDesc,
    image: `https://bionu.online${product.image}`,
    brand: { '@type': 'Brand', name: siteContent.brand.name },
    manufacturer: { '@type': 'Organization', name: siteContent.brand.manufacturer },
    offers: { '@type': 'Offer', price: product.price, priceCurrency: 'RUB', availability: 'https://schema.org/InStock' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-x pt-6">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500" aria-label="Хлебные крошки">
          <Link href="/" className="hover:text-slate-900">Главная</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/#catalog" className="hover:text-slate-900">Продукция</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-800">{product.name}</span>
        </nav>
      </div>

      {/* ───────── Первый экран ───────── */}
      <section className="container-x grid gap-10 py-8 lg:grid-cols-2 lg:gap-14 lg:py-12">
        <div className="card overflow-hidden lg:sticky lg:top-24 lg:self-start">
          <ProductVisual product={product} size="lg" priority />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${a.bg}`}>{product.badge}</span>
            <span className="font-mono text-xs text-slate-400">{product.num}</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">{product.name}</h1>
          <p className={`mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium ${a.border} ${a.soft} ${a.text}`}>
            <FlaskConical className="h-4 w-4" /> {product.baseType}
          </p>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">{product.shortDesc}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <dt className="text-xs text-slate-500">Упаковка</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{product.packaging}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <dt className="text-xs text-slate-500">Объём</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{product.volume}</dd>
            </div>
          </dl>

          <div className="card mt-6 p-5">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-3xl font-bold text-slate-900">{formatPrice(product.price)}</span>
              <span className="text-xs text-slate-500">отгрузка со склада в Москве</span>
            </div>
            <AddToCart id={product.id} color={product.accentColor} label="Добавить в корзину" className="mt-4" />
            <div className="mt-2.5">
              <MarketplaceMenu />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">Ключевые косметические свойства</h2>
            <ul className="mt-4 space-y-3">
              {product.keyBenefits.map((b) => (
                <li key={b} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${a.soft}`}>
                    <Check className={`h-3.5 w-3.5 ${a.text}`} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 leading-relaxed text-slate-600">{product.fullDesc}</p>
        </div>
      </section>

      {/* ───────── Состав и применение ───────── */}
      <section className="border-y border-slate-200/80 bg-white">
        <div className="container-x grid gap-10 py-14 lg:grid-cols-2">
          <div>
            <p className="kicker">Состав</p>
            <h2 className="mt-3 text-2xl font-bold">Активные компоненты</h2>
            <ul className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200">
              {product.activeComponents.map((c, i) => (
                <li key={c} className="flex gap-4 p-4 text-sm text-slate-700">
                  <span className="font-mono text-xs text-slate-400">{String(i + 1).padStart(2, '0')}</span>
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">INCI</p>
              <p className="mt-1.5 font-mono text-sm leading-relaxed text-slate-700">{product.inci}</p>
            </div>
          </div>

          <div>
            <p className="kicker">Способ применения</p>
            <h2 className="mt-3 text-2xl font-bold">Пошагово</h2>
            <ol className="mt-5 space-y-3">
              {splitSteps(product.applicationMethod).map((s, i) => (
                <li key={i} className="flex gap-4 rounded-2xl border border-slate-200 p-4">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold text-white ${a.bg}`}>{i + 1}</span>
                  <p className="pt-1 text-sm leading-relaxed text-slate-700">{s}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">{siteContent.brand.storage}</p>

            {relatedScenarios.length > 0 && (
              <div className="mt-6">
                <p className="label">Подходит для сценариев</p>
                <div className="flex flex-wrap gap-2">
                  {relatedScenarios.map((s) => (
                    <Link key={s.id} href="/dlya-vas#guide" className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 hover:border-slate-300 hover:text-slate-900">
                      {s.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───────── Декларация ───────── */}
      <section className="container-x py-14">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-slate-300 sm:p-10">
          <div className="bg-grid-dark absolute inset-0" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <ShieldCheck className="h-10 w-10 shrink-0 text-sky-400" />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Декларация о соответствии · {siteContent.brand.trTs}</p>
                <p className="mt-1.5 break-words font-mono text-lg font-semibold text-white sm:text-xl">{d.number}</p>
                <p className="mt-1 font-mono text-sm text-slate-400">
                  Действует {d.dateFrom} — {d.dateTo} · {d.gost}
                </p>
              </div>
            </div>
            <DeclarationButton product={product} dark />
          </div>
        </div>
      </section>

      {/* ───────── Кросс-сейл ───────── */}
      <section className="container-x pb-16">
        <h2 className="text-2xl font-bold sm:text-3xl">Идеально работает в паре с…</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {others.map((p) => {
            const pa = accent[p.accentColor];
            return (
              <div key={p.id} className="card flex flex-col overflow-hidden">
                <Link href={`/produkt/${p.slug}`}>
                  <ProductVisual product={p} className="h-48" />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <p className={`text-xs font-semibold ${pa.text}`}>{p.badge}</p>
                  <Link href={`/produkt/${p.slug}`} className="mt-1 text-lg font-bold text-slate-900 hover:underline">{p.name}</Link>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{p.shortDesc}</p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="font-mono text-lg font-bold">{formatPrice(p.price)}</span>
                  </div>
                  <AddToCart id={p.id} color={p.accentColor} withQty={false} className="mt-3" />
                </div>
              </div>
            );
          })}
          <div className="card flex flex-col overflow-hidden ring-2 ring-slate-900">
            <BundleVisual className="h-48" />
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-semibold text-emerald-700">{bundle.badge}</p>
              <p className="mt-1 text-lg font-bold text-slate-900">Вся система: 3 средства</p>
              <p className="mt-2 text-sm text-slate-600">{bundle.shortDesc}</p>
              <div className="mt-auto flex items-baseline gap-2 pt-4">
                <span className="font-mono text-lg font-bold">{formatPrice(bundle.price)}</span>
                <span className="font-mono text-sm text-slate-400 line-through">{formatPrice(bundle.oldPrice)}</span>
              </div>
              <AddToCart id={bundle.id} withQty={false} label="Комплект в корзину" className="mt-3" />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <Disclaimer />
        </div>
        <Link href="/dlya-vas" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:underline">
          Протокол SOS-ухода из 3 шагов <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </>
  );
}
