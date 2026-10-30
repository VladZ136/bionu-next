import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Mail, Phone } from 'lucide-react';
import { siteContent } from '@/data/siteContent';
import { telHref } from '@/lib/catalog';
import { ContactForm } from './ContactForm';

export function Marquee() {
  const tags = siteContent.marqueeTags;
  return (
    <div className="mask-fade-x overflow-hidden border-y border-slate-200/80 bg-white py-4" aria-label="Сценарии ухода">
      <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
        {[...tags, ...tags].map((t, i) => (
          <span key={i} aria-hidden={i >= tags.length} className="flex shrink-0 items-center gap-3 whitespace-nowrap text-sm font-medium text-slate-600">
            <span className="text-slate-300">❖</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SectionHead({ kicker, title, lead, children }: { kicker: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <p className="kicker">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> {kicker}
        </p>
        <h2 className="h2 mt-4">{title}</h2>
        {lead && <p className="mt-4 leading-relaxed text-slate-600">{lead}</p>}
      </div>
      {children}
    </div>
  );
}

export function ArticleCard({ a }: { a: (typeof siteContent.journalArticles)[number] }) {
  return (
    <Link href={`/zhurnal/${a.slug}`} className="card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-slate-400">
        <span>
          {a.num} · {a.category}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {a.readTime}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold leading-snug group-hover:underline">{a.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{a.excerpt}</p>
      <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
        Читать <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function JournalPreview() {
  return (
    <section className="section">
      <div className="container-x">
        <SectionHead kicker="Экспертный журнал" title="Наука о микроплёнке — простым языком">
          <Link href="/zhurnal" className="btn-light shrink-0">
            <BookOpen className="h-4 w-4" /> Все статьи
          </Link>
        </SectionHead>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {siteContent.journalArticles.slice(0, 3).map((a) => (
            <ArticleCard key={a.slug} a={a} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function QuickContact() {
  const { brand } = siteContent;
  return (
    <section className="pb-16 sm:pb-24">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-10 lg:p-14">
          <div className="bg-grid-dark absolute inset-0" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="kicker text-sky-400">Быстрая связь</p>
              <h2 className="h2 mt-4 text-white">Поможем подобрать средство под вашу ситуацию</h2>
              <p className="mt-4 leading-relaxed text-slate-400">
                Напишите или позвоните производителю — {brand.manufacturer}. Ответим на вопросы о составе, применении, документах и оптовых поставках.
              </p>
              <div className="mt-8 space-y-3">
                {brand.phones.map((p) => (
                  <a key={p} href={telHref(p)} className="flex items-center gap-3 font-mono text-lg text-white hover:text-sky-300">
                    <Phone className="h-5 w-5 text-slate-500" /> {p}
                  </a>
                ))}
                <a href={`mailto:${brand.email}`} className="flex items-center gap-3 text-white hover:text-sky-300">
                  <Mail className="h-5 w-5 text-slate-500" /> {brand.email}
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <ContactForm variant="quick" dark />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Disclaimer() {
  return (
    <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs leading-relaxed text-slate-500">{siteContent.brand.disclaimer}</p>
  );
}
