'use client';

import { useState } from 'react';
import { siteContent } from '@/data/siteContent';

const { mechanism } = siteContent;

const LAYERS = [
  {
    key: 'env',
    label: 'Защита от внешней среды',
    tag: 'Слой 03 · снаружи',
    color: '#94A3B8',
    title: mechanism.points[0].title,
    text: mechanism.points[0].text,
  },
  {
    key: 'film',
    label: 'Дышащая полимерная микроплёнка МА-1',
    tag: 'Слой 02 · до 48 ч',
    color: '#38BDF8',
    title: siteContent.protocolSteps[2].title,
    text: siteContent.protocolSteps[2].text,
  },
  {
    key: 'skin',
    label: 'Эпидермис',
    tag: 'Слой 01 · роговой слой',
    color: '#FB7185',
    title: mechanism.points[2].title,
    text: mechanism.points[2].text,
  },
] as const;

export function MechanismSection() {
  const [active, setActive] = useState(1);
  const layer = LAYERS[active];

  return (
    <section id="mechanism" className="relative overflow-hidden bg-slate-900 text-slate-100">
      <div className="bg-grid-dark absolute inset-0" />
      <div className="absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="container-x section relative">
        <div className="max-w-3xl">
          <p className="kicker text-sky-400">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" /> {mechanism.kicker}
          </p>
          <h2 className="h2 mt-4 text-white">{mechanism.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">{mechanism.lead}</p>
        </div>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1.25fr_1fr]">
          {/* SVG-схема */}
          <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4 sm:p-6">
            <svg viewBox="0 0 640 380" className="h-auto w-full" role="img" aria-label="Схема трёхслойной защиты: эпидермис, полимерная микроплёнка, внешняя среда">
              <defs>
                <linearGradient id="film" x1="0" x2="1">
                  <stop offset="0" stopColor="#0EA5E9" stopOpacity=".55" />
                  <stop offset=".5" stopColor="#38BDF8" stopOpacity=".9" />
                  <stop offset="1" stopColor="#0EA5E9" stopOpacity=".55" />
                </linearGradient>
                <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FDA4AF" stopOpacity=".55" />
                  <stop offset="1" stopColor="#9F1239" stopOpacity=".35" />
                </linearGradient>
                <pattern id="cells" width="48" height="26" patternUnits="userSpaceOnUse">
                  <path d="M0 13h48M24 0v13M0 26V13M48 26V13" stroke="#FECDD3" strokeOpacity=".28" fill="none" />
                </pattern>
              </defs>

              {/* Слой 03: внешняя среда */}
              <g className="cursor-pointer" onClick={() => setActive(0)} onMouseEnter={() => setActive(0)} opacity={active === 0 ? 1 : 0.55}>
                <rect x="0" y="0" width="640" height="150" fill="transparent" />
                {[
                  [70, 40], [150, 85], [235, 30], [310, 95], [395, 45], [470, 80], [555, 35], [600, 100], [110, 120], [520, 125],
                ].map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r={i % 3 === 0 ? 5 : 3.5} fill="#CBD5E1" opacity=".8">
                      <animate attributeName="cy" values={`${y};${y + 26};${y}`} dur={`${3 + (i % 4)}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                ))}
                {[120, 280, 440].map((x) => (
                  <path key={x} d={`M${x} 60 l0 70 m-8 -10 l8 10 l8 -10`} stroke="#94A3B8" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
                ))}
                <text x="20" y="28" fill="#94A3B8" fontSize="12" fontFamily="var(--font-mono)" letterSpacing="1.5">ВНЕШНЯЯ СРЕДА · ПЫЛЬ · ТРЕНИЕ</text>
              </g>

              {/* Слой 02: микроплёнка */}
              <g className="cursor-pointer" onClick={() => setActive(1)} onMouseEnter={() => setActive(1)}>
                <path d="M0 158 Q 80 146 160 158 T 320 158 T 480 158 T 640 158 V 186 Q 560 198 480 186 T 320 186 T 160 186 T 0 186 Z" fill="url(#film)" opacity={active === 1 ? 1 : 0.6}>
                  <animate attributeName="opacity" values={active === 1 ? '0.85;1;0.85' : '0.55;0.65;0.55'} dur="3s" repeatCount="indefinite" />
                </path>
                {Array.from({ length: 21 }).map((_, i) => (
                  <g key={i}>
                    <circle cx={16 + i * 30.5} cy={172} r="3" fill="#E0F2FE" opacity=".9" />
                    {i < 20 && <line x1={19 + i * 30.5} y1={172} x2={44 + i * 30.5} y2={172} stroke="#E0F2FE" strokeOpacity=".5" />}
                  </g>
                ))}
                {/* «Дыхание» — пар сквозь плёнку */}
                {[90, 250, 410, 570].map((x, i) => (
                  <path key={x} d={`M${x} 196 q -6 -14 0 -26 q 6 -12 0 -26`} stroke="#7DD3FC" strokeWidth="1.5" fill="none" opacity=".7">
                    <animate attributeName="opacity" values="0;.8;0" dur="2.6s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
                  </path>
                ))}
                <rect x="410" y="128" width="216" height="22" rx="11" fill="#0C4A6E" stroke="#38BDF8" strokeOpacity=".6" />
                <text x="518" y="143" textAnchor="middle" fill="#BAE6FD" fontSize="11" fontFamily="var(--font-mono)">МИКРОПЛЁНКА МА-1 · ДО 48 Ч</text>
              </g>

              {/* Слой 01: эпидермис */}
              <g className="cursor-pointer" onClick={() => setActive(2)} onMouseEnter={() => setActive(2)} opacity={active === 2 ? 1 : 0.6}>
                <rect x="0" y="192" width="640" height="188" fill="url(#skin)" />
                <rect x="0" y="192" width="640" height="188" fill="url(#cells)" />
                {Array.from({ length: 9 }).map((_, i) => (
                  <ellipse key={i} cx={40 + i * 72} cy={300 + (i % 2) * 30} rx="22" ry="11" fill="#FB7185" opacity=".22" />
                ))}
                <text x="20" y="366" fill="#FECDD3" fontSize="12" fontFamily="var(--font-mono)" letterSpacing="1.5">ЭПИДЕРМИС · РОГОВОЙ СЛОЙ</text>
              </g>
            </svg>

            <div className="mt-4 grid grid-cols-3 gap-2" role="tablist" aria-label="Слои защиты">
              {[2, 1, 0].map((i) => (
                <button
                  key={LAYERS[i].key}
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => setActive(i)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                    active === i ? 'border-sky-400/60 bg-sky-400/10 text-white' : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'
                  }`}
                >
                  <span className="block font-mono text-[10px] uppercase tracking-wider opacity-70">{LAYERS[i].tag}</span>
                  <span className="mt-0.5 block font-semibold leading-snug">{LAYERS[i].label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Описание выбранного слоя */}
          <div key={layer.key} className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ background: layer.color }} />
              {layer.tag}
            </span>
            <h3 className="mt-4 text-2xl font-bold text-white">{layer.label}</h3>
            <p className="mt-2 text-sm font-semibold text-sky-300">{layer.title}</p>
            <p className="mt-3 leading-relaxed text-slate-400">{layer.text}</p>
            <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6">
              {siteContent.effectsList.map((e) => (
                <li key={e} className="flex gap-3 text-sm text-slate-300">
                  <span className="mt-2 h-1 w-3 shrink-0 rounded-full bg-sky-400" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {mechanism.points.map((p) => (
            <div key={p.num} className="bg-slate-900 p-6 transition hover:bg-slate-800/80 sm:p-7">
              <span className="font-mono text-sm text-sky-400">{p.num}</span>
              <h3 className="mt-3 text-lg font-bold leading-snug text-white">{p.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
