import { siteContent, type Product } from '@/data/siteContent';

export const products = siteContent.products;
export const bundle = siteContent.bundle;

export const BUNDLE_ID = bundle.id;
export const BUNDLE_PARTS = products.map((p) => p.id);
export const BUNDLE_FULL_PRICE = products.reduce((s, p) => s + p.price, 0);

export type Accent = Product['accentColor'];

/** Полные имена классов — чтобы Tailwind JIT их видел. */
export const accent: Record<
  Accent,
  {
    hex: string;
    text: string;
    bg: string;
    bgHover: string;
    soft: string;
    border: string;
    ring: string;
    gradient: string;
    dot: string;
  }
> = {
  red: {
    hex: '#E11D48',
    text: 'text-rose-600',
    bg: 'bg-rose-600',
    bgHover: 'hover:bg-rose-700',
    soft: 'bg-rose-50',
    border: 'border-rose-200',
    ring: 'ring-rose-600/20',
    gradient: 'from-rose-50 via-white to-rose-100/60',
    dot: 'bg-rose-500',
  },
  blue: {
    hex: '#0284C7',
    text: 'text-sky-600',
    bg: 'bg-sky-600',
    bgHover: 'hover:bg-sky-700',
    soft: 'bg-sky-50',
    border: 'border-sky-200',
    ring: 'ring-sky-600/20',
    gradient: 'from-sky-50 via-white to-sky-100/60',
    dot: 'bg-sky-500',
  },
  teal: {
    hex: '#0D9488',
    text: 'text-teal-600',
    bg: 'bg-teal-600',
    bgHover: 'hover:bg-teal-700',
    soft: 'bg-teal-50',
    border: 'border-teal-200',
    ring: 'ring-teal-600/20',
    gradient: 'from-teal-50 via-white to-teal-100/60',
    dot: 'bg-teal-500',
  },
};

export function getProduct(idOrSlug: string): Product | undefined {
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export function formatPrice(value: number): string {
  // неразрывные пробелы: цена никогда не переносится на две строки
  return `${new Intl.NumberFormat('ru-RU').format(value).replace(/\s/g, '\u00a0')}\u00a0₽`;
}

export type CartItem = { id: string; qty: number };

export type CartLine = {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  image?: string;
  accent?: Accent;
  isBundle: boolean;
};

export type CartTotals = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  /** Сколько полных комплектов собрано из отдельных позиций */
  autoBundles: number;
  discount: number;
  total: number;
  /** Чего не хватает до комплекта, если в корзине 2 из 3 средств */
  missingForBundle: Product[];
};

export function itemName(id: string): string {
  if (id === BUNDLE_ID) return bundle.name;
  return getProduct(id)?.name ?? id;
}

/**
 * Если в корзине одновременно лежат Спрей, Крем-гель и Водный гель по отдельности,
 * каждая полная тройка автоматически считается по спеццене комплекта (2 200 ₽ вместо 2 400 ₽).
 */
export function computeTotals(items: CartItem[]): CartTotals {
  const lines: CartLine[] = items
    .filter((i) => i.qty > 0)
    .map((i) => {
      if (i.id === BUNDLE_ID) {
        return {
          id: i.id,
          name: bundle.name,
          qty: i.qty,
          unitPrice: bundle.price,
          lineTotal: bundle.price * i.qty,
          isBundle: true,
        };
      }
      const p = getProduct(i.id);
      return {
        id: i.id,
        name: p?.name ?? i.id,
        qty: i.qty,
        unitPrice: p?.price ?? 0,
        lineTotal: (p?.price ?? 0) * i.qty,
        image: p?.image,
        accent: p?.accentColor,
        isBundle: false,
      };
    });

  const qtyOf = (id: string) => items.find((i) => i.id === id)?.qty ?? 0;
  const partQty = BUNDLE_PARTS.map(qtyOf);
  const autoBundles = Math.min(...partQty);
  const discount = autoBundles * (BUNDLE_FULL_PRICE - bundle.price);
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const present = BUNDLE_PARTS.filter((id) => qtyOf(id) > autoBundles);
  const missingForBundle =
    present.length === 2
      ? BUNDLE_PARTS.filter((id) => qtyOf(id) <= autoBundles).map((id) => getProduct(id)!)
      : [];

  return { lines, count, subtotal, autoBundles, discount, total: subtotal - discount, missingForBundle };
}

export function pluralItems(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'товар';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'товара';
  return 'товаров';
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
