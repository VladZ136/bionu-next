'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Check, ChevronDown, Minus, Plus, ShoppingBag, Store } from 'lucide-react';
import type { Product } from '@/data/siteContent';
import { accent, products } from '@/lib/catalog';
import { useCart } from '@/context/CartContext';
import { formatPhone } from '@/lib/phone';

/* ───────────────────────── Визуал товара ───────────────────────── */

export function ProductVisual({
  product,
  size = 'md',
  priority = false,
  className = '',
}: {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  priority?: boolean;
  className?: string;
}) {
  const a = accent[product.accentColor];
  const h = { sm: 'h-28', md: 'h-56', lg: 'h-[420px] sm:h-[520px]' }[size];
  const imgH = { sm: 96, md: 200, lg: 420 }[size];
  return (
    <div className={`relative flex ${h} items-end justify-center overflow-hidden bg-gradient-to-br ${a.gradient} ${className}`}>
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl" style={{ background: a.hex }} />
      <Image
        src={product.image}
        alt={product.name}
        width={Math.round((imgH * (product.id === 'loson-sprey' ? 80 : 224)) / 423)}
        height={imgH}
        priority={priority}
        className="relative z-10 mb-[6%] h-[86%] w-auto object-contain drop-shadow-[0_18px_24px_rgba(15,23,42,0.22)]"
      />
    </div>
  );
}

export function BundleVisual({ className = 'h-56' }: { className?: string }) {
  return (
    <div className={`relative flex items-end justify-center gap-1 overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200/70 ${className}`}>
      <div className="bg-grid absolute inset-0 opacity-70" />
      <div className="absolute -left-10 top-6 h-32 w-32 rounded-full bg-rose-400/20 blur-3xl" />
      <div className="absolute left-1/2 top-2 h-32 w-32 -translate-x-1/2 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="absolute -right-10 top-8 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl" />
      {[products[0], products[2], products[1]].map((p, i) => (
        <Image
          key={p.id}
          src={p.image}
          alt={p.name}
          width={p.id === 'loson-sprey' ? 80 : 224}
          height={423}
          className={`relative z-10 mb-[6%] w-auto object-contain drop-shadow-[0_16px_20px_rgba(15,23,42,0.2)] ${
            i === 1 ? 'z-20 h-[84%]' : 'h-[72%]'
          } ${i === 0 ? '-mr-3' : ''} ${i === 2 ? '-ml-3' : ''}`}
        />
      ))}
    </div>
  );
}

/* ───────────────────────── Количество и корзина ───────────────────────── */

export function QtyStepper({
  value,
  onChange,
  min = 1,
  size = 'md',
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  size?: 'sm' | 'md';
}) {
  const s = size === 'sm' ? 'h-8 w-8' : 'h-11 w-10';
  return (
    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white">
      <button type="button" className={`${s} flex items-center justify-center text-slate-500 hover:text-slate-900 disabled:opacity-30`} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Уменьшить количество">
        <Minus className="h-4 w-4" />
      </button>
      <span className={`min-w-[2ch] text-center font-mono font-semibold text-slate-900 ${size === 'sm' ? 'text-sm' : ''}`} aria-live="polite">
        {value}
      </span>
      <button type="button" className={`${s} flex items-center justify-center text-slate-500 hover:text-slate-900 disabled:opacity-30`} onClick={() => onChange(value + 1)} disabled={value >= 99} aria-label="Увеличить количество">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function AddToCart({
  id,
  withQty = true,
  label = 'В корзину',
  className = '',
  color,
}: {
  id: string;
  withQty?: boolean;
  label?: string;
  className?: string;
  color?: Product['accentColor'];
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const bg = color ? `${accent[color].bg} ${accent[color].bgHover}` : 'bg-slate-900 hover:bg-slate-800';

  const onAdd = () => {
    add(id, qty);
    setAdded(true);
    setQty(1);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {withQty && <QtyStepper value={qty} onChange={setQty} />}
      <button type="button" onClick={onAdd} className={`btn h-11 flex-1 text-white ${bg}`}>
        {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
        {added ? 'Добавлено' : label}
      </button>
    </div>
  );
}

/* ───────────────────────── Маркетплейсы (заглушки) ───────────────────────── */

const MARKETPLACES = [
  { name: 'Ozon', color: 'bg-[#005BFF]' },
  { name: 'Wildberries', color: 'bg-[#CB11AB]' },
  { name: 'Яндекс Маркет', color: 'bg-[#FFCC00]' },
];

export function MarketplaceMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-dashed border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
        aria-expanded={open}
        aria-label="Показать варианты покупки на Ozon, Wildberries и Яндекс Маркете"
      >
        <span className="flex items-center gap-2">
          <Store className="h-4 w-4" /> Купить на маркетплейсах
        </span>
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute inset-x-0 bottom-full z-20 mb-2 animate-fade-in rounded-xl border border-slate-200 bg-white p-1.5 shadow-lift">
          {MARKETPLACES.map((m) => (
            <div
              key={m.name}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm"
            >
              <span className="flex items-center gap-2.5 font-medium text-slate-800">
                <span className={`h-2.5 w-2.5 rounded-full ${m.color}`} />
                {m.name}
              </span>
              <span className="rounded-md bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                Ссылка уточняется
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Формы ───────────────────────── */

export function PhoneInput({
  value,
  onChange,
  id,
  name,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
  name?: string;
  required?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const national = (v: string) => v.replace(/\D/g, '').slice(1); // цифры после «7»

  // Каретка всегда в конце: маска вставляет символы, и браузер иначе теряет позицию
  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement === el) el.setSelectionRange(el.value.length, el.value.length);
  }, [value]);

  const emit = (digits: string) => onChange(digits ? formatPhone('7' + digits.slice(0, 10)) : '+7');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let d = e.target.value.replace(/\D/g, '');
    // Вставка «8 999…» / «+7 999…» поверх префикса «+7»
    if (d.length > 11 && /^7[78]/.test(d)) d = d.slice(1);
    if (/^[78]/.test(d)) d = d.slice(1);
    emit(d);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    if (e.key === 'Backspace' && el.selectionStart === el.selectionEnd) {
      e.preventDefault();
      emit(national(value).slice(0, -1));
    }
  };

  return (
    <input
      ref={ref}
      id={id}
      name={name}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder="+7 (___) ___-__-__"
      className="input font-mono"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={() => !value && onChange('+7')}
      onBlur={() => national(value) === '' && onChange('')}
      required={required}
    />
  );
}

export function Consent({ checked, onChange, dark = false }: { checked: boolean; onChange: (v: boolean) => void; dark?: boolean }) {
  return (
    <label className={`flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
      <input
        type="checkbox"
        name="consent"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-slate-900"
        required
      />
      <span>
        Я даю согласие на обработку персональных данных в соответствии с Федеральным законом № 152-ФЗ и{' '}
        <Link href="/politika" target="_blank" rel="noopener noreferrer" className={`underline underline-offset-2 ${dark ? 'hover:text-white' : 'hover:text-slate-900'}`}>
          Политикой обработки персональных данных
        </Link>
        .
      </span>
    </label>
  );
}

/** Невидимое поле-ловушка для ботов */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      name="company_site"
      tabIndex={-1}
      autoComplete="off"
      className="absolute left-[-9999px] h-0 w-0 opacity-0"
      aria-hidden="true"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
