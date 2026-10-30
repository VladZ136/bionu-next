import Link from 'next/link';

export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0F172A" />
          <stop offset="1" stopColor="#334155" />
        </linearGradient>
      </defs>
      <path d="M20 2.5 35.2 11.25v17.5L20 37.5 4.8 28.75v-17.5Z" fill="url(#lm-g)" />
      <path d="M20 11 27.8 15.5v9L20 29l-7.8-4.5v-9Z" fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="1.4" />
      <g stroke="#fff" strokeOpacity=".35" strokeWidth="1">
        <path d="M20 11V2.5M27.8 15.5l7.4-4.25M27.8 24.5l7.4 4.25M20 29v8.5M12.2 24.5l-7.4 4.25M12.2 15.5 4.8 11.25" />
      </g>
      <circle cx="20" cy="11" r="1.9" fill="#E11D48" />
      <circle cx="27.8" cy="24.5" r="1.9" fill="#0284C7" />
      <circle cx="12.2" cy="24.5" r="1.9" fill="#0D9488" />
    </svg>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Система АС · МА-1 — на главную">
      <LogoMark />
      <span className="leading-none">
        <span className={`block font-display text-[15px] font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
          Система АС · МА-1
        </span>
        <span className={`mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          ООО «РУСПЕНТА»
        </span>
      </span>
    </Link>
  );
}
