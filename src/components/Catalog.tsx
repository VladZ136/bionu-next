'use client';

import Link from 'next/link';
import { ArrowRight, Check, Package, Plus } from 'lucide-react';
import type { Product } from '@/data/siteContent';
import { BUNDLE_ID, accent, bundle, formatPrice, products } from '@/lib/catalog';
import { useCart } from '@/context/CartContext';
import { AddToCart, BundleVisual, MarketplaceMenu, ProductVisual } from './ui';

/** Мини-карточка в Hero: фото, цена, быстрое добавление */
export function HeroMiniCard({ product }: { product: Product }) {
  const a = accent[product.accentColor];
  const { add, qtyOf, hydrated } = useCart();
  const inCart = hydrated ? qtyOf(product.id) : 0;
  return (
    <div className="card group relative overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lift">
      <Link href={`/produkt/${product.slug}`} className="block" aria-label={product.name}>
        <ProductVisual product={product} size="sm" priority className="h-32 sm:h-36" />
      </Link>
      <div className="p-3.5">
        <span className={`font-mono text-[10px] font-semibold uppercase tracking-wider ${a.text}`}>{product.num}</span>
        <Link href={`/produkt/${product.slug}`} className="mt-0.5 block text-sm font-semibold leading-tight text-slate-900 hover:underline">
          {product.shortName}
        </Link>
        <div className="mt-2 font-mono text-base font-bold text-slate-900">{formatPrice(product.price)}</div>
        <button
          type="button"
          onClick={() => add(product.id)}
          className={`mt-2.5 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-white transition ${a.bg} ${a.bgHover}`}
          aria-label={`Добавить ${product.name} в корзину`}
        >
          {inCart > 0 ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {inCart > 0 ? `В корзине: ${inCart}` : 'В корзину'}
        </button>
      </div>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const a = accent[product.accentColor];
  return (
    <article className="card group flex flex-col overflow-hidden transition hover:shadow-lift">
      <Link href={`/produkt/${product.slug}`} className="relative block">
        <ProductVisual product={product} className="h-64" />
        <span className="absolute left-4 top-4 z-20 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600 shadow-sm backdrop-blur">
          {product.num}
        </span>
        <span className={`absolute right-4 top-4 z-20 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white ${a.bg}`}>{product.volume === '100 мл' ? '100 мл' : 'Дой-пак'}</span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className={`text-xs font-semibold ${a.text}`}>{product.badge}</p>
        <h3 className="mt-1.5 text-xl font-bold">
          <Link href={`/produkt/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-slate-500">{product.baseType}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{product.shortDesc}</p>
        <div className="mt-auto pt-5">
          <div className="mb-3 flex items-end justify-between">
            <span className="font-mono text-2xl font-bold text-slate-900">{formatPrice(product.price)}</span>
            <Link href={`/produkt/${product.slug}`} className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900">
              Подробнее <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <AddToCart id={product.id} color={product.accentColor} />
          <div className="mt-2.5">
            <MarketplaceMenu />
          </div>
        </div>
      </div>
    </article>
  );
}

export function BundleCard({ variant = 'card' }: { variant?: 'card' | 'wide' }) {
  if (variant === 'wide') {
    return (
      <div className="card grid overflow-hidden md:grid-cols-[1.1fr_1fr]">
        <BundleVisual className="h-64 md:h-full md:min-h-[320px]" />
        <BundleBody />
      </div>
    );
  }
  return (
    <article className="card relative flex flex-col overflow-hidden ring-2 ring-slate-900">
      <div className="relative">
        <BundleVisual className="h-64" />
        <span className="absolute left-4 top-4 z-30 rounded-full bg-slate-900 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
          3-в-1
        </span>
      </div>
      <BundleBody compact />
    </article>
  );
}

function BundleBody({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-1 flex-col p-5 sm:p-6">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <Package className="h-3.5 w-3.5" /> {bundle.badge}
      </span>
      <h3 className={`mt-3 font-bold ${compact ? 'text-xl' : 'text-2xl'}`}>{bundle.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{bundle.shortDesc}</p>
      <ul className="mt-4 space-y-1.5">
        {products.map((p) => (
          <li key={p.id} className="flex items-center gap-2 text-sm text-slate-700">
            <span className={`h-2 w-2 rounded-full ${accent[p.accentColor].dot}`} />
            {p.name}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-5">
        <div className="mb-3 flex items-baseline gap-2.5">
          <span className="font-mono text-2xl font-bold text-slate-900">{formatPrice(bundle.price)}</span>
          <span className="font-mono text-sm text-slate-400 line-through">{formatPrice(bundle.oldPrice)}</span>
        </div>
        <AddToCart id={BUNDLE_ID} label="Комплект в корзину" />
        {compact && (
          <div className="mt-2.5">
            <MarketplaceMenu />
          </div>
        )}
      </div>
    </div>
  );
}
