'use client';

import { useState, type FormEvent } from 'react';
import { CircleCheck, LoaderCircle, Send } from 'lucide-react';
import { isPhoneComplete } from '@/lib/phone';
import { CONTACT_TOPICS } from '@/lib/topics';
import { Consent, Honeypot, PhoneInput } from './ui';

type Variant = 'contact' | 'wholesale' | 'quick';

export function ContactForm({
  variant = 'contact',
  defaultTopic = CONTACT_TOPICS[0],
  dark = false,
}: {
  variant?: Variant;
  defaultTopic?: string;
  dark?: boolean;
}) {
  const [f, setF] = useState({
    name: '',
    phone: '',
    email: '',
    topic: variant === 'wholesale' ? 'Оптовая поставка' : defaultTopic,
    company: '',
    inn: '',
    region: '',
    volume: '',
    samples: true,
    message: '',
  });
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));
  const input = dark ? 'input border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400' : 'input';
  const label = dark ? 'label text-slate-400' : 'label';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (f.name.trim().length < 2) return setError('Укажите, как к вам обращаться.');
    if (!isPhoneComplete(f.phone) && !/\S+@\S+\.\S+/.test(f.email)) return setError('Укажите телефон или email для ответа.');
    if (variant === 'wholesale' && !f.company.trim()) return setError('Укажите название организации.');
    if (!consent) return setError('Необходимо согласие на обработку персональных данных.');
    setStatus('sending');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: variant === 'wholesale' ? 'wholesale' : 'contact', ...f, consent, company_site: hp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Не удалось отправить заявку');
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Ошибка отправки');
    }
  };

  if (status === 'done') {
    return (
      <div className={`flex flex-col items-center justify-center rounded-2xl p-10 text-center ${dark ? 'bg-white/5' : 'bg-emerald-50/60'}`}>
        <CircleCheck className="h-12 w-12 text-emerald-500" />
        <p className={`mt-4 font-display text-xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Заявка отправлена</p>
        <p className={`mt-2 max-w-sm text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          {variant === 'wholesale'
            ? 'Направим оптовый прайс-лист, копии деклараций ЕАЭС и условия получения образцов.'
            : 'Мы ответим в рабочее время по указанным контактам.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative space-y-4" noValidate>
      <Honeypot value={hp} onChange={setHp} />

      {variant === 'wholesale' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="w-company">Организация *</label>
            <input id="w-company" className={input} autoComplete="organization" value={f.company} onChange={(e) => set('company', e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="w-inn">ИНН</label>
            <input id="w-inn" className={`${input} font-mono`} inputMode="numeric" maxLength={12} value={f.inn} onChange={(e) => set('inn', e.target.value.replace(/\D/g, ''))} />
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor={`${variant}-name`}>{variant === 'wholesale' ? 'Контактное лицо *' : 'Имя *'}</label>
          <input id={`${variant}-name`} className={input} autoComplete="name" value={f.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label className={label} htmlFor={`${variant}-phone`}>Телефон</label>
          <div className={dark ? '[&_input]:border-white/10 [&_input]:bg-white/5 [&_input]:text-white' : ''}>
            <PhoneInput id={`${variant}-phone`} value={f.phone} onChange={(v) => set('phone', v)} />
          </div>
        </div>
      </div>

      {variant !== 'quick' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor={`${variant}-email`}>Email</label>
            <input id={`${variant}-email`} type="email" className={input} autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          {variant === 'contact' ? (
            <div>
              <label className={label} htmlFor="c-topic">Тема обращения</label>
              <select id="c-topic" className={input} value={f.topic} onChange={(e) => set('topic', e.target.value)}>
                {CONTACT_TOPICS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className={label} htmlFor="w-region">Регион поставки</label>
              <input id="w-region" className={input} value={f.region} onChange={(e) => set('region', e.target.value)} />
            </div>
          )}
        </div>
      )}

      {variant === 'wholesale' && (
        <>
          <div>
            <label className={label} htmlFor="w-volume">Интересующий объём</label>
            <input id="w-volume" className={input} placeholder="Например: 2 короба Крем-геля, 1 короб Лосьон-спрея" value={f.volume} onChange={(e) => set('volume', e.target.value)} />
          </div>
          <label className={`flex cursor-pointer items-center gap-2.5 text-sm ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
            <input type="checkbox" checked={f.samples} onChange={(e) => set('samples', e.target.checked)} className="h-4 w-4 accent-slate-900" />
            Нужны тестовые образцы и копии деклараций
          </label>
        </>
      )}

      <div>
        <label className={label} htmlFor={`${variant}-msg`}>{variant === 'quick' ? 'Вопрос' : 'Сообщение'}</label>
        <textarea id={`${variant}-msg`} rows={variant === 'quick' ? 3 : 4} className={`${input} resize-none`} value={f.message} onChange={(e) => set('message', e.target.value)} />
      </div>

      <Consent checked={consent} onChange={setConsent} dark={dark} />

      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === 'sending'} className={`btn h-12 w-full sm:w-auto ${dark ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
        {status === 'sending' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {variant === 'wholesale' ? 'Запросить прайс и образцы' : 'Отправить'}
      </button>
    </form>
  );
}
