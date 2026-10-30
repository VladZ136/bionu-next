'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Check, ChevronDown, ShoppingBag } from 'lucide-react';
import { siteContent } from '@/data/siteContent';
import { accent, formatPrice, getProduct } from '@/lib/catalog';
import { useCart } from '@/context/CartContext';

type Scenario = (typeof siteContent.scenarios)[number];
const { scenarios } = siteContent;

/** «Шаг 1: … Шаг 2: …» → массив шагов */
function splitProtocol(text: string): string[] {
  const parts = text.split(/Шаг\s*\d+:\s*/).map((s) => s.trim()).filter(Boolean);
  return parts.length > 1 ? parts : [text];
}

function ScenarioPanel({ s }: { s: Scenario }) {
  const { addMany } = useCart();
  const [added, setAdded] = useState(false);
  const recs = s.recommendedProducts.map((id) => getProduct(id)!).filter(Boolean);
  const steps = splitProtocol(s.protocol);
  const sum = recs.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="animate-fade-in">
      <p className="font-mono text-xs uppercase tracking-wider text-slate-400">Сценарий {s.num}</p>
      <h3 className="mt-2 text-xl font-bold leading-snug sm:text-2xl">{s.title}</h3>

      <div className="mt-5">
        <p className="label">Протокол ухода</p>
        <ol className="space-y-2.5">
          {steps.map((st, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-700">
              {steps.length > 1 && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 font-mono text-[11px] font-bold text-white">{i + 1}</span>
              )}
              <span>{st}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-5 rounded-xl border border-emerald-200/70 bg-emerald-50/60 p-4 text-sm leading-relaxed text-emerald-900">{s.benefit}</div>

      <div className="mt-6">
        <p className="label">Рекомендуемая связка</p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {recs.map((p, i) => {
            const a = accent[p.accentColor];
            return (
              <Link key={p.id} href={`/produkt/${p.slug}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 transition hover:border-slate-300">
                <span className={`flex h-14 w-12 shrink-0 items-center justify-center rounded-lg ${a.soft}`}>
                  <Image src={p.image} alt="" width={30} height={56} className="h-12 w-auto object-contain" />
                </span>
                <span className="min-w-0">
                  <span className={`block font-mono text-[10px] uppercase tracking-wider ${a.text}`}>Шаг {i + 1}</span>
                  <span className="block text-sm font-semibold leading-tight text-slate-900">{p.name}</span>
                  <span className="font-mono text-xs text-slate-500">{formatPrice(p.price)}</span>
                </span>
              </Link>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => {
            addMany(recs.map((p) => p.id));
            setAdded(true);
            setTimeout(() => setAdded(false), 1800);
          }}
          className="btn-dark mt-4 h-12 w-full sm:w-auto"
        >
          {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          {added ? 'Набор добавлен' : 'Добавить рекомендованный набор в корзину'}
          <span className="ml-1 rounded-md bg-white/15 px-2 py-0.5 font-mono text-xs">{formatPrice(sum)}</span>
        </button>
      </div>
    </div>
  );
}

export function ScenarioNavigator() {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);

  return (
    <>
      {/* Десктоп: вертикальные табы */}
      <div className="hidden gap-6 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
        <div className="space-y-1.5" role="tablist" aria-orientation="vertical" aria-label="Сценарии применения">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                active === i ? 'bg-slate-900 text-white shadow-lift' : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <span className={`mt-px font-mono text-xs ${active === i ? 'text-sky-300' : 'text-slate-400'}`}>{s.num}</span>
              <span className="font-medium leading-snug">{s.title}</span>
            </button>
          ))}
        </div>
        <div className="card p-7" role="tabpanel">
          <ScenarioPanel key={scenarios[active].id} s={scenarios[active]} />
        </div>
      </div>

      {/* Мобильные: аккордеон */}
      <div className="space-y-2 lg:hidden">
        {scenarios.map((s, i) => {
          const isOpen = openMobile === i;
          return (
            <div key={s.id} className={`card overflow-hidden ${isOpen ? 'ring-1 ring-slate-900' : ''}`}>
              <button
                type="button"
                className="flex w-full items-start gap-3 p-4 text-left"
                onClick={() => setOpenMobile(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="mt-px font-mono text-xs text-slate-400">{s.num}</span>
                <span className="flex-1 text-sm font-semibold leading-snug text-slate-900">{s.title}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="border-t border-slate-100 p-4 pt-2">
                  <ScenarioPanel s={s} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
