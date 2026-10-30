import type { Metadata } from 'next';
import { Building, Factory, Mail, MapPin, Phone } from 'lucide-react';
import { siteContent } from '@/data/siteContent';
import { telHref } from '@/lib/catalog';
import { ContactForm } from '@/components/ContactForm';
import { topicFromParam } from '@/lib/topics';

export const metadata: Metadata = {
  title: siteContent.seo.contacts.title,
  description: siteContent.seo.contacts.description,
};

type Props = { searchParams: Promise<{ tema?: string }> };

export default async function ContactsPage({ searchParams }: Props) {
  const { tema } = await searchParams;
  const { brand } = siteContent;

  return (
    <section className="container-x py-12 sm:py-20">
      <p className="kicker">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Контакты
      </p>
      <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] sm:text-5xl">Связь с производителем {brand.manufacturer}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">{siteContent.seo.contacts.description}</p>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl font-bold">Форма обратной связи</h2>
          <p className="mb-6 mt-1 text-sm text-slate-500">Выберите тему — так мы быстрее направим вопрос нужному специалисту.</p>
          <ContactForm variant="contact" defaultTopic={topicFromParam(tema)} />
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900">Телефоны</h2>
            <div className="mt-3 space-y-2">
              {brand.phones.map((p) => (
                <a key={p} href={telHref(p)} className="flex items-center gap-3 font-mono text-lg font-semibold text-slate-900 hover:text-sky-700">
                  <Phone className="h-5 w-5 text-slate-400" /> {p}
                </a>
              ))}
            </div>
            <a href={`mailto:${brand.email}`} className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4 font-medium text-slate-900 hover:text-sky-700">
              <Mail className="h-5 w-5 text-slate-400" /> {brand.email}
            </a>
          </div>

          <div className="card space-y-4 p-6 text-sm">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
              <div>
                <p className="font-semibold text-slate-900">Юридический адрес</p>
                <p className="mt-0.5 text-slate-600">{brand.legalAddress}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Factory className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
              <div>
                <p className="font-semibold text-slate-900">Адрес производства</p>
                <p className="mt-0.5 text-slate-600">{brand.productionAddress}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Building className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
              <div>
                <p className="font-semibold text-slate-900">{brand.manufacturer}</p>
                <p className="mt-0.5 font-mono text-xs leading-relaxed text-slate-600">
                  ОГРН {brand.ogrn}
                  <br />
                  ИНН {brand.inn}
                  <br />
                  ТН ВЭД {brand.tnved}
                </p>
                <p className="mt-2 text-xs text-slate-500">Разработчик: {brand.developer}</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80">
            <iframe
              title="Карта: Москва, ул. Рябиновая, 44"
              src="https://yandex.ru/map-widget/v1/?text=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D1%83%D0%BB.%20%D0%A0%D1%8F%D0%B1%D0%B8%D0%BD%D0%BE%D0%B2%D0%B0%D1%8F%2C%2044&z=15"
              className="h-64 w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
