import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { siteContent } from '@/data/siteContent';
import { products, telHref } from '@/lib/catalog';

const { brand } = siteContent;

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Logo dark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{brand.tagline}</p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
            {brand.madeIn} · {brand.trTs}
          </p>
        </div>

        <div>
          <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">Продукция</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {products.map((p) => (
              <li key={p.id}>
                <Link href={`/produkt/${p.slug}`} className="text-slate-300 hover:text-white">
                  {p.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/dlya-vas#nabor" className="text-slate-300 hover:text-white">
                Комплект из 3 средств
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">Разделы</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ['/dlya-vas', 'Для вас · SOS-уход'],
              ['/opt', 'Опт и снабжение'],
              ['/zhurnal', 'Журнал'],
              ['/svyaz', 'Контакты'],
              ['/politika', 'Политика обработки ПДн'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-slate-300 hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">{brand.manufacturer}</h3>
          {brand.phones.map((p) => (
            <a key={p} href={telHref(p)} className="flex items-center gap-2 font-mono text-slate-200 hover:text-white">
              <Phone className="h-4 w-4 text-slate-500" /> {p}
            </a>
          ))}
          <a href={`mailto:${brand.email}`} className="flex items-center gap-2 text-slate-200 hover:text-white">
            <Mail className="h-4 w-4 text-slate-500" /> {brand.email}
          </a>
          <p className="flex gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /> {brand.legalAddress}
          </p>
          <p className="font-mono text-xs text-slate-500">
            ОГРН {brand.ogrn} · ИНН {brand.inn}
            <br />
            ТН ВЭД {brand.tnved}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800/80">
        <div className="container-x flex flex-col gap-4 py-6 text-xs leading-relaxed text-slate-500 md:flex-row md:items-start md:justify-between">
          <p className="max-w-4xl">{brand.disclaimer}</p>
          <p className="shrink-0 font-mono">© {new Date().getFullYear()} {brand.manufacturer}</p>
        </div>
      </div>
    </footer>
  );
}
