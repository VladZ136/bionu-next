/**
 * Тела статей журнала собираются ИСКЛЮЧИТЕЛЬНО из выверенных текстов siteContent.ts —
 * без добавления новых формулировок о действии средств.
 */
import { siteContent } from '@/data/siteContent';
import { getProduct, products } from './catalog';

export type ArticleSection = {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
  steps?: { title: string; text: string }[];
  table?: { head: string[]; rows: string[][] };
};

const { mechanism, protocolSteps, scenarios, effectsList, brand, b2b } = siteContent;
const point = (n: string) => mechanism.points.find((p) => p.num === n)!;
const pt = (n: string): ArticleSection => ({ heading: point(n).title, paragraphs: [point(n).text] });
const sc = (id: string): ArticleSection => {
  const s = scenarios.find((x) => x.id === id)!;
  return { heading: s.title, paragraphs: [s.protocol, s.benefit] };
};
const spray = getProduct('loson-sprey')!;

const declTable = {
  head: ['Изделие', 'Декларация ЕАЭС', 'Срок действия', 'Стандарт'],
  rows: products.map((p) => [p.name, p.declaration.number, `${p.declaration.dateFrom} — ${p.declaration.dateTo}`, p.declaration.gost]),
};

export const articleBodies: Record<string, ArticleSection[]> = {
  mikroplenka: [
    { paragraphs: [mechanism.lead, siteContent.hero.subheadline] },
    pt('01'),
    pt('02'),
    { heading: 'Что даёт микроплёнка', list: effectsList },
    pt('06'),
  ],
  'aktivnye-komponenty': [
    pt('03'),
    pt('04'),
    ...products.map((p) => ({
      heading: `${p.name}: активные компоненты`,
      list: p.activeComponents,
      paragraphs: [`INCI: ${p.inci}`],
    })),
    pt('05'),
  ],
  'tri-formy': [
    ...products.map((p) => ({ heading: `${p.name} — ${p.badge.toLowerCase()}`, paragraphs: [p.baseType + '.', p.fullDesc] })),
    { heading: 'Как комбинировать', steps: protocolSteps.map((s) => ({ title: `${s.step}. ${s.title}`, text: s.text })) },
  ],
  'kak-primenyat': [
    { heading: 'Двухэтапная система', steps: protocolSteps.map((s) => ({ title: `${s.step}. ${s.title}`, text: s.text })) },
    ...scenarios.map((s) => ({ heading: `${s.num}. ${s.title}`, paragraphs: [s.protocol, s.benefit] })),
  ],
  'pochemu-as': [
    pt('05'),
    pt('06'),
    { heading: 'Свойства системы', list: effectsList },
    { heading: `${spray.name}: ключевые свойства`, list: spray.keyBenefits },
  ],
  deklaracii: [
    { paragraphs: [brand.disclaimer] },
    { heading: 'Реестр деклараций', table: declTable },
    {
      heading: 'Реквизиты изготовителя',
      list: [
        `Изготовитель: ${brand.manufacturer}`,
        `Разработчик: ${brand.developer}`,
        `ОГРН ${brand.ogrn}, ИНН ${brand.inn}`,
        `Код ТН ВЭД ЕАЭС: ${brand.tnved}`,
        `Схема декларирования: ${brand.scheme}`,
        `Адрес производства: ${brand.productionAddress}`,
      ],
    },
    pt('05'),
  ],
  'optovaya-fasovka': [
    { paragraphs: [`${b2b.boxType}. Габариты: ${b2b.boxDimensions}.`] },
    {
      heading: 'Фасовка по изделиям',
      table: {
        head: ['Изделие', 'Укладка', 'Штук в коробе', 'Вес короба'],
        rows: products.map((p) => [p.name, p.b2bSpec.packInfo, String(p.b2bSpec.unitsPerBox), p.b2bSpec.boxWeight]),
      },
    },
    { heading: 'Как начать сотрудничество', steps: b2b.steps.map((s) => ({ title: `${s.num}. ${s.title}`, text: s.text })) },
    { paragraphs: [brand.storage] },
  ],
  'sprey-ekstremalnye': [
    { paragraphs: [spray.shortDesc, spray.fullDesc] },
    { heading: 'Ключевые свойства', list: spray.keyBenefits },
    { heading: 'Способ применения', paragraphs: [spray.applicationMethod] },
    sc('foot-hygiene-extreme'),
    sc('everyday-microdamage'),
    sc('insect-bites-outdoors'),
  ],
};

/** Какие товары показывать в боковом блоке статьи */
export const articleProducts: Record<string, string[]> = {
  'sprey-ekstremalnye': ['loson-sprey'],
  'tri-formy': ['krem-gel-ma-1', 'gel-vodny-ma-1', 'loson-sprey'],
};
