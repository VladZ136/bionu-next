import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Droplets, Layers, Sparkles } from 'lucide-react';
import { siteContent } from '@/data/siteContent';
import { products } from '@/lib/catalog';
import { ScenarioNavigator } from '@/components/ScenarioNavigator';
import { BundleCard } from '@/components/Catalog';
import { Disclaimer, SectionHead } from '@/components/Sections';

export const metadata: Metadata = {
  title: siteContent.seo.forYou.title,
  description: siteContent.seo.forYou.description,
};

const STEP_ICONS = [Droplets, Layers, Sparkles];
const STEP_COLORS = ['text-teal-600 bg-teal-50', 'text-sky-600 bg-sky-50', 'text-rose-600 bg-rose-50'];

export default function ForYouPage() {
  const { protocolSteps } = siteContent;
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,#000_25%,transparent_70%)]" />
        <div className="container-x relative pb-12 pt-12 sm:pt-20">
          <p className="kicker">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Для вас · SOS-уход
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.08] sm:text-5xl">Домашний и дорожный SOS-уход: три шага вместо десятка средств</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">{siteContent.seo.forYou.description}</p>
        </div>
      </section>

      {/* ───────── Протокол 3 шагов ───────── */}
      <section className="container-x pb-16">
        <div className="relative grid gap-5 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-[52px] hidden h-px border-t-2 border-dashed border-slate-300 md:block" />
          {protocolSteps.map((s, i) => {
            const Icon = STEP_ICONS[i];
            const p = [products[2], products[1], products[0]][i];
            return (
              <div key={s.step} className="card relative p-6">
                <div className="flex items-center justify-between">
                  <span className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl ring-8 ring-slate-50 ${STEP_COLORS[i]}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-4xl font-bold text-slate-200">{s.step}</span>
                </div>
                <h2 className="mt-5 text-xl font-bold">
                  {s.step}. {s.title}
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{s.text}</p>
                {i < 2 && (
                  <Link href={`/produkt/${p.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-900 hover:underline">
                    {i === 0 ? p.name : 'Гели МА-1'} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────── Гид по 8 ситуациям ───────── */}
      <section id="guide" className="scroll-mt-20 border-y border-slate-200/80 bg-white py-16 sm:py-20">
        <div className="container-x">
          <SectionHead kicker="Интерактивный гид" title="8 ситуаций — 8 готовых протоколов" lead="Выберите ситуацию, чтобы увидеть порядок ухода и добавить рекомендованную связку средств в корзину одним нажатием." />
          <div className="mt-10">
            <ScenarioNavigator />
          </div>
        </div>
      </section>

      {/* ───────── Набор ───────── */}
      <section id="nabor" className="container-x scroll-mt-20 py-16 sm:py-20">
        <SectionHead kicker="Готовое решение" title="Набор из 3 средств — на все сценарии сразу" />
        <div className="mt-10">
          <BundleCard variant="wide" />
        </div>
        <div className="mt-8">
          <Disclaimer />
        </div>
      </section>
    </>
  );
}
