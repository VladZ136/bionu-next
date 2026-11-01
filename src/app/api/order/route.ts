import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { BUNDLE_ID, computeTotals, formatPrice, getProduct, itemName, type CartItem } from '@/lib/catalog';

export const runtime = 'nodejs';

type Payload = Record<string, unknown>;

const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Простой лимит частоты запросов в памяти процесса */
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

function makeId(type: string) {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  const prefix = type === 'order' ? 'З' : type === 'wholesale' ? 'О' : 'В';
  return `${prefix}-${p(d.getDate())}${p(d.getMonth() + 1)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function buildMessage(type: string, id: string, b: Payload) {
  const lines: string[] = [];
  const row = (label: string, value: string) => value && lines.push(`<b>${label}:</b> ${esc(value)}`);

  if (type === 'order') {
    const rawItems = Array.isArray(b.items) ? b.items : [];
    const items: CartItem[] = rawItems
      .map((i) => ({ id: str((i as Payload).id, 64), qty: Math.min(99, Math.max(0, Math.floor(Number((i as Payload).qty) || 0))) }))
      .filter((i) => i.qty > 0 && (i.id === BUNDLE_ID || getProduct(i.id)));
    if (!items.length) throw new Error('Корзина пуста');
    // Пересчитываем сумму на сервере — не доверяем ценам с клиента
    const t = computeTotals(items);

    lines.push(`🛒 <b>Новый заказ ${id}</b> — Система АС · МА-1`, '');
    t.lines.forEach((l) => lines.push(`• ${esc(itemName(l.id))} × ${l.qty} = ${formatPrice(l.lineTotal)}`));
    lines.push('');
    if (t.discount > 0) lines.push(`Комплект-скидка (${t.autoBundles} шт.): −${formatPrice(t.discount)}`);
    lines.push(`<b>Итого: ${formatPrice(t.total)}</b>`, '');
    row('Покупатель', str(b.name, 120));
    row('Телефон', str(b.phone, 32));
    row('Email', str(b.email, 120));
    row('Доставка', str(b.delivery, 120));
    row('Адрес / ПВЗ', str(b.address, 300));
    row('Комментарий', str(b.comment, 1000));
    return { text: lines.join('\n'), subject: `Заказ ${id} на ${formatPrice(t.total)} — Система АС · МА-1` };
  }

  if (type === 'wholesale') {
    lines.push(`📦 <b>Оптовый запрос ${id}</b> — Система АС · МА-1`, '');
    row('Организация', str(b.company, 200));
    row('ИНН', str(b.inn, 12));
    row('Контакт', str(b.name, 120));
    row('Телефон', str(b.phone, 32));
    row('Email', str(b.email, 120));
    row('Регион', str(b.region, 200));
    row('Объём', str(b.volume, 300));
    lines.push(`<b>Образцы и декларации:</b> ${b.samples ? 'да' : 'нет'}`);
    row('Сообщение', str(b.message, 2000));
    return { text: lines.join('\n'), subject: `Оптовый запрос ${id}: ${str(b.company, 80)}` };
  }

  lines.push(`✉️ <b>Обращение ${id}</b> — Система АС · МА-1`, '');
  row('Тема', str(b.topic, 80) || 'Быстрая связь');
  row('Имя', str(b.name, 120));
  row('Телефон', str(b.phone, 32));
  row('Email', str(b.email, 120));
  row('Сообщение', str(b.message, 2000));
  return { text: lines.join('\n'), subject: `Обращение ${id}: ${str(b.topic, 80) || 'Быстрая связь'}` };
}

async function sendTelegram(html: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`Telegram API: ${res.status} ${await res.text()}`);
  return true;
}

async function sendEmail(subject: string, html: string, replyTo?: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return false;
  const port = Number(SMTP_PORT || 465);
  const transport = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  await transport.sendMail({
    from: `"Система АС · МА-1" <${SMTP_USER}>`,
    to: process.env.ORDER_EMAIL_TO || '555penta@bk.ru',
    subject,
    html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">${html.replace(/\n/g, '<br>')}</div>`,
    replyTo: replyTo || undefined,
  });
  return true;
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Некорректный запрос' }, { status: 400 });
  }

  // Ловушка для ботов: тихо «принимаем»
  if (str(body.company_site)) return NextResponse.json({ ok: true, id: '' });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: 'Слишком много запросов. Попробуйте позже или позвоните нам.' }, { status: 429 });

  const type = ['order', 'contact', 'wholesale'].includes(str(body.type)) ? str(body.type) : 'contact';
  if (body.consent !== true) return NextResponse.json({ ok: false, error: 'Нужно согласие на обработку персональных данных' }, { status: 400 });
  if (str(body.name).length < 2) return NextResponse.json({ ok: false, error: 'Укажите имя' }, { status: 400 });
  const phoneDigits = str(body.phone).replace(/\D/g, '');
  if (type === 'order' && phoneDigits.length !== 11) return NextResponse.json({ ok: false, error: 'Укажите телефон полностью' }, { status: 400 });
  if (type !== 'order' && phoneDigits.length !== 11 && !/\S+@\S+\.\S+/.test(str(body.email))) {
    return NextResponse.json({ ok: false, error: 'Укажите телефон или email' }, { status: 400 });
  }

  const id = makeId(type);
  let msg: { text: string; subject: string };
  try {
    msg = buildMessage(type, id, body);
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : 'Ошибка данных' }, { status: 400 });
  }

  const results = await Promise.allSettled([sendTelegram(msg.text), sendEmail(msg.subject, msg.text, str(body.email))]);
  const delivered = results.some((r) => r.status === 'fulfilled' && r.value === true);
  results.forEach((r) => r.status === 'rejected' && console.error('[api/order] канал доставки:', r.reason));

  if (!delivered) {
    const configured = Boolean(process.env.TELEGRAM_BOT_TOKEN || process.env.SMTP_HOST);
    if (process.env.NODE_ENV !== 'production' && !configured) {
      console.log(`\n[api/order] DEV: каналы не настроены (.env.local), заявка не отправлена наружу:\n${msg.text.replace(/<\/?b>/g, '')}\n`);
      return NextResponse.json({ ok: true, id, dev: true });
    }
    return NextResponse.json({ ok: false, error: 'Не удалось отправить. Позвоните нам: +7 926 900-88-85' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id });
}
