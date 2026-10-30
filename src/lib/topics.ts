export const CONTACT_TOPICS = ['Подбор средства', 'Оптовая поставка', 'Документы и декларации', 'Применение', 'Другое'] as const;

const TOPIC_ALIASES: Record<string, (typeof CONTACT_TOPICS)[number]> = {
  podbor: 'Подбор средства',
  opt: 'Оптовая поставка',
  docs: 'Документы и декларации',
  primenenie: 'Применение',
};

/** ?tema=docs → «Документы и декларации» */
export function topicFromParam(param?: string | null) {
  return (param && TOPIC_ALIASES[param]) || CONTACT_TOPICS[0];
}
