# bionu.online — Система АС · МА-1

Next.js 15 (App Router) + TypeScript + Tailwind CSS. Весь контент — в `src/data/siteContent.ts`.

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Заявки и заказы

`POST /api/order` принимает заказы из корзины, обращения и оптовые запросы.
Скопируйте `.env.example` в `.env.local` и заполните:

- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — уведомления в Telegram;
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — дубль на `555penta@bk.ru`.

Без настроек в dev-режиме заявка печатается в консоль сервера; в production без каналов API вернёт ошибку (чтобы заказы не терялись молча).
Сумма заказа пересчитывается на сервере, а не берётся у клиента.

## Файлы, которые нужно добавить

- `public/docs/ds-krem-gel.pdf`, `ds-gel-vodny.pdf`, `ds-loson-sprey.pdf` — PDF деклараций. Пока файла нет, вместо «Скачать PDF» показывается «Запросить PDF» (ведёт на форму с темой «Документы и декларации»).
- `public/images/decls-wall.jpg` — фото деклараций. Пока его нет, рисуется векторная заглушка.

Обе проверки выполняются при сборке — после добавления файлов пересоберите проект.

## Ссылки на маркетплейсы

Заглушки с бейджем «Скоро» — массив `MARKETPLACES` в `src/components/ui.tsx`.
