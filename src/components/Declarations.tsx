import Image from 'next/image';
import Link from 'next/link';
import { Download, FileText, ShieldCheck } from 'lucide-react';
import type { Product } from '@/data/siteContent';
import { siteContent } from '@/data/siteContent';
import { accent, products } from '@/lib/catalog';
import { publicFileExists } from '@/lib/files';

export function DeclarationButton({ product, dark = false }: { product: Product; dark?: boolean }) {
  const exists = publicFileExists(product.declaration.pdfUrl);
  const cls = dark
    ? 'border-white/15 text-white hover:bg-white/10'
    : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50';
  if (exists) {
    return (
      <a href={product.declaration.pdfUrl} download className={`btn border px-4 py-2.5 ${cls}`} aria-label={`Скачать декларацию о соответствии для ${product.name} в формате PDF`}>
        <Download className="h-4 w-4" /> Скачать декларацию
      </a>
    );
  }
  return (
        <Link href="/svyaz?tema=docs" className={`btn border px-4 py-2.5 ${cls}`} title="PDF-копия высылается по запросу">
      <FileText className="h-4 w-4" /> Запросить PDF
    </Link>
  );
}

export function DeclarationCard({ product }: { product: Product }) {
  const d = product.declaration;
  const a = accent[product.accentColor];
  return (
    <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${a.soft}`}>
        <ShieldCheck className={`h-6 w-6 ${a.text}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{product.name}</p>
        <p className="mt-1 break-words font-mono text-[13px] text-slate-700">{d.number}</p>
        <p className="mt-1 font-mono text-xs text-slate-500">
          {d.dateFrom} — {d.dateTo} · {d.gost}
        </p>
      </div>
      <DeclarationButton product={product} />
    </div>
  );
}

/** Иллюстрация «стена документов» — используется, если нет /images/decls-wall.jpg */
function DeclsWallFallback() {
  return (
    <div className="relative flex h-full min-h-[320px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200/70">
      <div className="bg-grid absolute inset-0" />
      {products.map((p, i) => (
        <div
          key={p.id}
          className="absolute w-44 rounded-lg border border-slate-200 bg-white p-4 shadow-lift"
          style={{ transform: `translate(${(i - 1) * 70}px, ${(i - 1) * 16}px) rotate(${(i - 1) * 6}deg)`, zIndex: i === 1 ? 3 : 1 }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">ЕАЭС</span>
            <ShieldCheck className={`h-4 w-4 ${accent[p.accentColor].text}`} />
          </div>
          <p className="mt-2 text-[10px] font-semibold leading-tight text-slate-800">Декларация о соответствии</p>
          <p className="mt-1 font-mono text-[8px] leading-tight text-slate-500">{p.declaration.number}</p>
          <div className="mt-3 space-y-1">
            {[100, 85, 92, 70, 80].map((w, j) => (
              <div key={j} className="h-1 rounded bg-slate-100" style={{ width: `${w}%` }} />
            ))}
          </div>
          <p className="mt-3 font-mono text-[8px] text-slate-400">{p.declaration.gost}</p>
        </div>
      ))}
    </div>
  );
}

export function DeclarationsSection() {
  const { brand } = siteContent;
  const hasWall = publicFileExists('/images/decls-wall.jpg');
  return (
    <section id="docs" className="section">
      <div className="container-x grid items-stretch gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="kicker">
            <ShieldCheck className="h-3.5 w-3.5" /> Стандарты и право
          </p>
          <h2 className="h2 mt-4">Декларации ЕАЭС и лабораторный контроль</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-slate-600">{brand.disclaimer.split('.').slice(0, 3).join('.')}.</p>
          <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
            {[brand.trTs, `Схема ${brand.scheme}`, `ТН ВЭД ${brand.tnved}`, `ОГРН ${brand.ogrn}`].map((t) => (
              <span key={t} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-600">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-8 space-y-3">
            {products.map((p) => (
              <DeclarationCard key={p.id} product={p} />
            ))}
          </div>
        </div>
        <div className="relative min-h-[320px]">
          {hasWall ? (
            <Image src="/images/decls-wall.jpg" alt="Декларации о соответствии ЕАЭС на продукцию ООО «РУСПЕНТА»" fill sizes="(min-width:1024px) 40vw, 100vw" className="rounded-3xl object-cover shadow-lift" />
          ) : (
            <DeclsWallFallback />
          )}
        </div>
      </div>
    </section>
  );
}
