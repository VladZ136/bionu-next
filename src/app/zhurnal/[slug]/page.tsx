import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight, Clock } from 'lucide-react';
import { siteContent } from '@/data/siteContent';
import { articleBodies, articleProducts, type ArticleSection } from '@/lib/articles';
import { accent, bundle, formatPrice, getProduct, products } from '@/lib/catalog';
import { AddToCart } from '@/components/ui';
import { ArticleCard, Disclaimer } from '@/components/Sections';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

const articles = siteContent.journalArticles;
const find = (slug: string) => articles.find((a) => a.slug === slug);

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = find((await params).slug);
  if (!a) return {};
  return { title: `${a.title} | Журнал ООО «РУСПЕНТА»`, description: a.excerpt, alternates: { canonical: `/zhurnal/${a.slug}` } };
}

function Section({ s }: { s: ArticleSection }) {
  return (
    <section className="mt-10 first:mt-0">
      {s.heading && <h2 className="text-2xl font-bold leading-snug">{s.heading}</h2>}
      {s.paragraphs?.map((p, i) => (
        <p key={i} className={`mt-4 text-[17px] leading-[1.75] text-slate-700 ${p.startsWith('INCI') ? 'rounded-xl bg-slate-100 p-4 font-mono text-sm' : ''}`}>
          {p}
        </p>
      ))}
      {s.list && (
        <ul className="mt-4 space-y-2.5">
          {s.list.map((li) => (
            <li key={li} className="flex gap-3 text-[17px] leading-relaxed text-slate-700">
              <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
              {li}
            </li>
          ))}
        </ul>
      )}
      {s.steps && (
        <ol className="mt-5 space-y-3">
          {s.steps.map((st) => (
            <li key={st.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-semibold text-slate-900">{st.title}</p>
              <p className="mt-1.5 leading-relaxed text-slate-600">{st.text}</p>
            </li>
          ))}
        </ol>
      )}
      {s.table && (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                {s.table.head.map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {s.table.rows.map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={i} className={`px-4 py-3 ${i === 0 ? 'font-semibold text-slate-900' : 'font-mono text-[13px] text-slate-600'}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = find(slug);
  if (!article) notFound();
  const body = articleBodies[slug] ?? [];
  const sideProducts = (articleProducts[slug] ?? products.map((p) => p.id)).map((id) => getProduct(id)!);
  const idx = articles.findIndex((a) => a.slug === slug);
  const next = [articles[(idx + 1) % articles.length], articles[(idx + 2) % articles.length]];

  return (
    <>
      <div className="container-x pt-6">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500" aria-label="Хлебные крошки">
          <Link href="/zhurnal" className="flex items-center gap-1 hover:text-slate-900">
            <ArrowLeft className="h-3.5 w-3.5" /> Журнал
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-800">{article.category}</span>
        </nav>
      </div>

      <article className="container-x grid grid-cols-[minmax(0,1fr)] gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-slate-500">
            <span className="rounded-md bg-slate-900 px-2 py-1 text-white">{article.num}</span>
            <span>{article.category}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {article.readTime}
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-[2.6rem]">{article.title}</h1>
          <p className="mt-5 border-l-2 border-sky-500 pl-5 text-xl leading-relaxed text-slate-600">{article.excerpt}</p>

          <div className="mt-12">
            {body.map((s, i) => (
              <Section key={i} s={s} />
            ))}
          </div>

          <div className="mt-12">
            <Disclaimer />
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Средства из статьи</p>
          {sideProducts.map((p) => {
            const a = accent[p.accentColor];
            return (
              <div key={p.id} className="card p-4">
                <Link href={`/produkt/${p.slug}`} className="flex items-center gap-3">
                  <span className={`flex h-16 w-14 shrink-0 items-center justify-center rounded-xl ${a.soft}`}>
                    <Image src={p.image} alt="" width={32} height={60} className="h-14 w-auto object-contain" />
                  </span>
                  <span>
                    <span className={`block text-[11px] font-semibold ${a.text}`}>{p.badge}</span>
                    <span className="block font-semibold leading-tight text-slate-900 hover:underline">{p.name}</span>
                    <span className="font-mono text-sm text-slate-600">{formatPrice(p.price)}</span>
                  </span>
                </Link>
                <AddToCart id={p.id} color={p.accentColor} withQty={false} className="mt-3 [&_button]:h-10" />
              </div>
            );
          })}
          <div className="rounded-2xl bg-slate-900 p-5 text-slate-300">
            <p className="text-sm font-semibold text-white">Комплект из 3 средств</p>
            <p className="mt-1 font-mono text-sm">
              <span className="text-lg font-bold text-white">{formatPrice(bundle.price)}</span>{' '}
              <span className="text-slate-500 line-through">{formatPrice(bundle.oldPrice)}</span>
            </p>
            <AddToCart id={bundle.id} withQty={false} label="В корзину" className="mt-3 [&_button]:h-10 [&_button]:bg-white [&_button]:text-slate-900 [&_button:hover]:bg-slate-100" />
          </div>
        </aside>
      </article>

      <section className="border-t border-slate-200/80 bg-white py-14">
        <div className="container-x">
          <h2 className="text-2xl font-bold">Читать дальше</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {next.map((a) => (
              <ArticleCard key={a.slug} a={a} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
