'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, CircleCheck, Gift, LoaderCircle, Package, ShoppingBag, Sparkles, Trash, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { BUNDLE_ID, BUNDLE_FULL_PRICE, accent, bundle, formatPrice, pluralItems } from '@/lib/catalog';
import { isPhoneComplete } from '@/lib/phone';
import { Consent, Honeypot, PhoneInput, QtyStepper } from './ui';

export const DELIVERY_OPTIONS = [
  'СДЭК (до пункта выдачи или курьером)',
  'Почта России',
  'Самовывоз со склада в Москве (ул. Рябиновая, 44)',
  'Оптовая партия (расчёт ТК)',
] as const;

type Step = 'cart' | 'checkout' | 'done';

export function CartDrawer() {
  const cart = useCart();
  const { isOpen, close, lines, count, subtotal, discount, total, autoBundles, missingForBundle } = cart;
  const [step, setStep] = useState<Step>('cart');
  const [orderNo, setOrderNo] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onTab);
    return () => window.removeEventListener('keydown', onTab);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && step === 'done') setStep('cart');
  }, [isOpen, step]);

  useEffect(() => {
    if (count === 0 && step === 'checkout') setStep('cart');
  }, [count, step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div className="absolute inset-0 animate-fade-in bg-slate-900/40 backdrop-blur-sm" onClick={close} />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-[460px] animate-slide-in flex-col bg-slate-50 shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button onClick={() => setStep('cart')} className="-ml-1 rounded-lg p-1 text-slate-500 hover:bg-slate-100" aria-label="Назад к корзине">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <h2 id="cart-title" className="text-lg font-bold">{step === 'checkout' ? 'Оформление заказа' : step === 'done' ? 'Заказ принят' : 'Корзина'}</h2>
              {step !== 'done' && (
                <p className="font-mono text-xs text-slate-500">
                  {count} {pluralItems(count)} · {formatPrice(total)}
                </p>
              )}
            </div>
          </div>
          <button onClick={close} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Закрыть корзину">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 'done' ? (
          <DoneView orderNo={orderNo} onClose={close} />
        ) : count === 0 ? (
          <EmptyView onClose={close} />
        ) : step === 'cart' ? (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {lines.map((l) => (
                <div key={l.id} className="card flex gap-3 p-3">
                  <div className={`flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl ${l.accent ? accent[l.accent].soft : 'bg-slate-100'}`}>
                    {l.isBundle ? <Package className="h-7 w-7 text-slate-500" /> : l.image && <Image src={l.image} alt="" width={40} height={76} className="h-16 w-auto object-contain" />}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-snug text-slate-900">{l.name}</p>
                      <button onClick={() => cart.remove(l.id)} className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Удалить ${l.name}`}>
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 font-mono text-xs text-slate-500">
                      {formatPrice(l.unitPrice)} / шт.
                      {l.isBundle && <span className="ml-1.5 text-slate-400 line-through">{formatPrice(bundle.oldPrice)}</span>}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QtyStepper size="sm" value={l.qty} min={0} onChange={(v) => cart.setQty(l.id, v)} />
                      <span className="font-mono text-sm font-semibold text-slate-900">{formatPrice(l.lineTotal)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {autoBundles > 0 && (
                <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <p>
                    В корзине собран{autoBundles > 1 ? 'о' : ''} <b>{autoBundles} полн{autoBundles > 1 ? 'ых комплекта' : 'ый комплект'}</b> из 3 средств —
                    применена спеццена {formatPrice(bundle.price)} вместо {formatPrice(BUNDLE_FULL_PRICE)}.
                  </p>
                </div>
              )}

              {missingForBundle.length === 1 && (
                <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <Gift className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <p>
                      Добавьте <b>{missingForBundle[0].name}</b> — и три средства посчитаются по цене комплекта{' '}
                      <span className="font-mono">{formatPrice(bundle.price)}</span>. Выгода {formatPrice(BUNDLE_FULL_PRICE - bundle.price)}.
                    </p>
                    <button onClick={() => cart.add(missingForBundle[0].id, 1, { open: false })} className="mt-2 font-semibold underline underline-offset-2 hover:no-underline">
                      Добавить за {formatPrice(missingForBundle[0].price)}
                    </button>
                  </div>
                </div>
              )}

              {!cart.qtyOf(BUNDLE_ID) && autoBundles === 0 && missingForBundle.length === 0 && (
                <button onClick={() => cart.add(BUNDLE_ID, 1, { open: false })} className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-left text-sm transition hover:border-slate-400">
                  <Package className="h-5 w-5 shrink-0 text-slate-500" />
                  <span>
                    <span className="block font-semibold text-slate-900">Комплект из 3 средств за {formatPrice(bundle.price)}</span>
                    <span className="text-slate-500">вместо {formatPrice(bundle.oldPrice)} — спрей + оба геля</span>
                  </span>
                </button>
              )}
            </div>

            <div className="border-t border-slate-200/80 bg-white p-5">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-500">
                  <dt>Товары</dt>
                  <dd className="font-mono">{formatPrice(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <dt>Цена комплекта</dt>
                    <dd className="font-mono">−{formatPrice(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <dt>Доставка</dt>
                  <dd>по тарифу службы</dd>
                </div>
                <div className="flex justify-between pt-2 text-base font-bold text-slate-900">
                  <dt>Итого</dt>
                  <dd className="font-mono">{formatPrice(total)}</dd>
                </div>
              </dl>
              <button onClick={() => setStep('checkout')} className="btn-dark mt-4 h-12 w-full">
                Перейти к оформлению
              </button>
            </div>
          </>
        ) : (
          <CheckoutForm
            onDone={(no) => {
              setOrderNo(no);
              setStep('done');
              cart.clear();
            }}
          />
        )}
      </div>
    </div>
  );
}

function EmptyView({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-soft">
        <ShoppingBag className="h-7 w-7 text-slate-400" />
      </div>
      <p className="mt-5 font-display text-lg font-bold text-slate-900">В корзине пока пусто</p>
      <p className="mt-1 max-w-xs text-sm text-slate-500">Добавьте средства линейки МА-1 и АС или готовый комплект из 3 средств.</p>
      <Link href="/#catalog" onClick={onClose} className="btn-dark mt-6">
        Перейти к витрине
      </Link>
    </div>
  );
}

function DoneView({ orderNo, onClose }: { orderNo: string; onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <CircleCheck className="h-14 w-14 text-emerald-500" />
      <p className="mt-5 font-display text-xl font-bold text-slate-900">Спасибо! Заказ принят</p>
      {orderNo && <p className="mt-2 font-mono text-sm text-slate-500">№ {orderNo}</p>}
      <p className="mt-3 max-w-xs text-sm text-slate-500">Менеджер ООО «РУСПЕНТА» свяжется с вами для подтверждения состава, стоимости доставки и способа оплаты.</p>
      <button onClick={onClose} className="btn-light mt-6">
        Вернуться на сайт
      </button>
    </div>
  );
}

function CheckoutForm({ onDone }: { onDone: (orderNo: string) => void }) {
  const { lines, total, subtotal, discount, autoBundles } = useCart();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    delivery: DELIVERY_OPTIONS[0] as string,
    address: '',
    comment: '',
  });
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const pickup = form.delivery.startsWith('Самовывоз');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2) return setError('Укажите имя и фамилию.');
    if (!isPhoneComplete(form.phone)) return setError('Укажите телефон полностью в формате +7 (XXX) XXX-XX-XX.');
    if (!pickup && !form.address.trim()) return setError('Укажите город и адрес доставки или пункт выдачи.');
    if (!consent) return setError('Необходимо согласие на обработку персональных данных.');
    setStatus('sending');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order',
          ...form,
          consent,
          company_site: hp,
          items: lines.map((l) => ({ id: l.id, name: l.name, qty: l.qty, price: l.unitPrice, total: l.lineTotal })),
          subtotal,
          discount,
          autoBundles,
          total,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Не удалось отправить заказ');
      onDone(data.id ?? '');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Ошибка отправки. Позвоните нам: +7 926 900-88-85');
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden" noValidate>
      <div className="relative flex-1 space-y-4 overflow-y-auto p-5">
        <Honeypot value={hp} onChange={setHp} />
        <div>
          <label className="label" htmlFor="co-name">Имя и фамилия *</label>
          <input id="co-name" name="name" className="input" autoComplete="name" value={form.name} onChange={(e) => set('name')(e.target.value)} required aria-required="true" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="co-phone">Телефон *</label>
            <PhoneInput id="co-phone" name="phone" value={form.phone} onChange={set('phone')} required />
          </div>
          <div>
            <label className="label" htmlFor="co-email">Email</label>
            <input id="co-email" name="email" type="email" className="input" autoComplete="email" value={form.email} onChange={(e) => set('email')(e.target.value)} />
          </div>
        </div>

        <fieldset>
          <legend className="label">Способ доставки</legend>
          <div className="space-y-2">
            {DELIVERY_OPTIONS.map((opt) => (
              <label
                key={opt}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-3.5 py-3 text-sm transition ${
                  form.delivery === opt ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input type="radio" name="delivery" value={opt} checked={form.delivery === opt} onChange={() => set('delivery')(opt)} className="h-4 w-4 accent-slate-900" />
                <span className="text-slate-800">{opt}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {!pickup && (
          <div>
            <label className="label" htmlFor="co-address">Город и адрес доставки / ПВЗ *</label>
            <input id="co-address" name="address" className="input" autoComplete="street-address" placeholder="Например: Москва, ПВЗ СДЭК на ул. …" value={form.address} onChange={(e) => set('address')(e.target.value)} required aria-required="true" />
          </div>
        )}
        <div>
          <label className="label" htmlFor="co-comment">Комментарий к заказу</label>
          <textarea id="co-comment" name="comment" rows={3} className="input resize-none" value={form.comment} onChange={(e) => set('comment')(e.target.value)} />
        </div>
        <Consent checked={consent} onChange={setConsent} />
      </div>

      <div className="border-t border-slate-200/80 bg-white p-5">
        {error && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{error}</p>}
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm text-slate-500">К оплате</span>
          <span className="font-mono text-xl font-bold text-slate-900">{formatPrice(total)}</span>
        </div>
        <button type="submit" disabled={status === 'sending'} className="btn-dark h-12 w-full">
          {status === 'sending' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {status === 'sending' ? 'Отправляем…' : 'Подтвердить заказ'}
        </button>
        <p className="mt-2 text-center text-[11px] text-slate-400">Оплата после подтверждения заказа менеджером</p>
      </div>
    </form>
  );
}
