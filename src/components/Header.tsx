'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Phone, ShoppingBag, X } from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '@/context/CartContext';
import { formatPrice, telHref } from '@/lib/catalog';
import { siteContent } from '@/data/siteContent';

const NAV = [
  { href: '/#catalog', label: 'Продукты' },
  { href: '/dlya-vas', label: 'Для вас · SOS-уход' },
  { href: '/opt', label: 'Опт и снабжение' },
  { href: '/zhurnal', label: 'Журнал' },
  { href: '/svyaz', label: 'Контакты' },
];

const PHONE = siteContent.brand.phones[0];

export function Header() {
  const pathname = usePathname();
  const { count, total, hydrated, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => !href.startsWith('/#') && pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        scrolled ? 'border-slate-200/80 bg-white/85 backdrop-blur-xl' : 'border-transparent bg-slate-50/70 backdrop-blur'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive(n.href) ? 'bg-slate-900/5 text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={telHref(PHONE)}
            className="hidden items-center gap-2 rounded-lg px-2 py-2 font-mono text-sm font-medium text-slate-800 hover:text-slate-950 xl:flex"
          >
            <Phone className="h-4 w-4 text-slate-400" />
            {PHONE}
          </a>
          <button
            type="button"
            onClick={open}
            className="relative flex items-center gap-2.5 rounded-xl bg-slate-900 py-2 pl-3 pr-3.5 text-white shadow-lift transition hover:bg-slate-800"
            aria-label={`Открыть корзину, товаров: ${count}`}
          >
            <span className="relative">
              <ShoppingBag className="h-5 w-5" />
              {hydrated && count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-600 px-1 font-mono text-[10px] font-bold ring-2 ring-slate-900">
                  {count}
                </span>
              )}
            </span>
            <span className="hidden text-left leading-none sm:block">
              <span className="block text-[11px] text-slate-400">Корзина</span>
              <span className="mt-0.5 block font-mono text-sm font-semibold">
                {hydrated ? formatPrice(total) : '0 ₽'}
              </span>
            </span>
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Меню"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200/80 bg-white lg:hidden">
          <nav className="container-x flex flex-col py-3" aria-label="Мобильная навигация">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-2 py-3 text-base font-medium text-slate-800 hover:bg-slate-50">
                {n.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-1 border-t border-slate-100 pt-3">
              {siteContent.brand.phones.map((p) => (
                <a key={p} href={telHref(p)} className="flex items-center gap-2 px-2 py-2 font-mono text-sm text-slate-700">
                  <Phone className="h-4 w-4 text-slate-400" /> {p}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
