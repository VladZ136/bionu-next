import type { Metadata } from 'next';
import Image from 'next/image';
import { Boxes, Package, Scale, Truck, Warehouse } from 'lucide-react';
import { siteContent } from '@/data/siteContent';
import { accent, products, telHref } from '@/lib/catalog';
import { ContactForm } from '@/components/ContactForm';
import { DeclarationButton } from '@/components/Declarations';

export const metadata: Metadata = {
  title: siteContent.seo.b2b.title,
  description: siteContent.seo.b2b.description,
};

export default function OptPage() {
  const { b2b, brand } = siteContent;
  return (
    <>
      {/* ───────── Герой (тёмный) ───────── */}
      <section className="relative overflow-hidden bg-slate-900 text-slate-100">
        <div className="bg-grid-dark absolute inset-0" />
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="container-x relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="kicker text-sky-400">
              <Warehouse className="h-3.5 w-3.5" /> Опт и снабжение · B2B-логистика
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl">
              Один унифицированный короб <span className="font-mono text-sky-300">420 × 310 × 320</span> мм — три SKU
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-400">{siteContent.seo.b2b.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#zapros" className="btn h-12 bg-white px-6 text-slate-900 hover:bg-slate-100">
                Запросить прайс и образцы
              </a>
              <a href={telHref(brand.phones[0])} className="btn h-12 border border-white/15 px-6 font-mono text-white hover:bg-white/10">
                {brand.phones[0]}
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
              <Image src="/images/b2b-box.jpg" alt="Унифицированный гофрокороб 420×310×320 мм для продукции МА-1 и АС" fill priority sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-slate-900/90 p-3 font-mono text-xs backdrop-blur sm:left-auto sm:w-[360px]">
              {[
                ['Д', '420 мм'],
                ['Ш', '310 мм'],
                ['В', '320 мм'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-white/5 px-2 py-2 text-center">
                  <span className="block text-[10px] text-slate-500">{k}</span>
                  <span className="text-white">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Логистика: 3 SKU в одном коробе ───────── */}
      <section id="specs" className="container-x scroll-mt-20 py-16 sm:py-24">
        <p className="kicker">
          <Boxes className="h-3.5 w-3.5" /> Фасовка
        </p>
        <h2 className="h2 mt-4">Фасовка по изделиям</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          {b2b.boxType}. Габариты: <span className="font-mono">{b2b.boxDimensions}</span>.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {products.map((p) => {
            const a = accent[p.accentColor];
            return (
              <div key={p.id} className="card overflow-hidden">
                <div className={`h-1.5 ${a.bg}`} />
                <div className="p-6">
                  <p className="text-lg font-bold text-slate-900">{p.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{p.packaging}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <dt className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Package className="h-3.5 w-3.5" /> В коробе
                      </dt>
                      <dd className="mt-1 font-mono text-2xl font-bold text-slate-900">{p.b2bSpec.unitsPerBox} шт.</dd>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <dt className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Scale className="h-3.5 w-3.5" /> Вес
                      </dt>
                      <dd className="mt-1 font-mono text-2xl font-bold text-slate-900">{p.b2bSpec.boxWeight}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm text-slate-600">{p.b2bSpec.packInfo}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Таблица фасовки */}
        <div className="card mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5 font-medium">Изделие</th>
                <th className="px-5 py-3.5 font-medium">Укладка</th>
                <th className="px-5 py-3.5 font-medium">Штук в коробе</th>
                <th className="px-5 py-3.5 font-medium">Вес короба</th>
                <th className="px-5 py-3.5 font-medium">Габариты</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    <span className={`mr-2 inline-block h-2 w-2 rounded-full ${accent[p.accentColor].dot}`} />
                    {p.name}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{p.b2bSpec.packInfo}</td>
                  <td className="px-5 py-4 font-mono text-slate-900">{p.b2bSpec.unitsPerBox} шт.</td>
                  <td className="px-5 py-4 font-mono text-slate-900">{p.b2bSpec.boxWeight}</td>
                  <td className="px-5 py-4 font-mono text-slate-600">420×310×320 мм</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Таблица деклараций */}
        <h2 className="mt-16 text-2xl font-bold sm:text-3xl">Декларации ЕАЭС и ГОСТ</h2>
        <p className="mt-2 font-mono text-sm text-slate-500">
          {brand.trTs} · схема {brand.scheme} · ТН ВЭД {brand.tnved}
        </p>
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5 font-medium">Изделие</th>
                <th className="px-5 py-3.5 font-medium">Номер декларации</th>
                <th className="px-5 py-3.5 font-medium">Срок действия</th>
                <th className="px-5 py-3.5 font-medium">ГОСТ</th>
                <th className="px-5 py-3.5 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-4 font-semibold text-slate-900">{p.name}</td>
                  <td className="px-5 py-4 font-mono text-[13px] text-slate-700">{p.declaration.number}</td>
                  <td className="px-5 py-4 font-mono text-[13px] text-slate-600">
                    {p.declaration.dateFrom} — {p.declaration.dateTo}
                  </td>
                  <td className="px-5 py-4 font-mono text-[13px] text-slate-600">{p.declaration.gost}</td>
                  <td className="px-5 py-3 text-right">
                    <DeclarationButton product={p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ───────── Этапы + форма ───────── */}
      <section id="zapros" className="scroll-mt-20 bg-slate-900 text-slate-100">
        <div className="container-x grid gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <p className="kicker text-sky-400">
              <Truck className="h-3.5 w-3.5" /> Как начать работу
            </p>
            <h2 className="h2 mt-4 text-white">Прямые поставки от производителя</h2>
            <ol className="mt-8 space-y-6">
              {b2b.steps.map((s) => (
                <li key={s.num} className="flex gap-5">
                  <span className="font-mono text-2xl font-bold text-sky-400">{s.num}</span>
                  <div>
                    <p className="font-semibold text-white">{s.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-xs leading-relaxed text-slate-500">{brand.storage}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white">Запрос оптового прайса и образцов</h3>
            <p className="mb-6 mt-1.5 text-sm text-slate-400">Направим прайс-лист, копии деклараций ЕАЭС и проект договора поставки</p>
            <ContactForm variant="wholesale" dark />
          </div>
        </div>
      </section>
    </>
  );
}
