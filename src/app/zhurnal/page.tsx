import type { Metadata } from 'next';
import { siteContent } from '@/data/siteContent';
import { ArticleCard } from '@/components/Sections';

export const metadata: Metadata = {
  title: siteContent.seo.journal.title,
  description: siteContent.seo.journal.description,
};

export default function JournalPage() {
  const [first, ...rest] = siteContent.journalArticles;
  return (
    <section className="container-x py-12 sm:py-20">
      <p className="kicker">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> Экспертный журнал
      </p>
      <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] sm:text-5xl">Технология полимерной микроплёнки и состав МА-1</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">{siteContent.seo.journal.description}</p>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-1 lg:row-span-2 [&>a]:h-full [&>a]:bg-slate-900 [&>a]:text-slate-300 [&_h3]:text-2xl [&_h3]:text-white [&_span]:text-white [&_p]:text-slate-400">
          <ArticleCard a={first} />
        </div>
        {rest.map((a) => (
          <ArticleCard key={a.slug} a={a} />
        ))}
      </div>
    </section>
  );
}
