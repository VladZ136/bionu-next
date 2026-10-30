import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-sm text-slate-400">404</p>
      <h1 className="mt-3 text-3xl font-extrabold">Страница не найдена</h1>
      <p className="mt-3 text-slate-600">Возможно, она была перемещена. Перейдите на главную или к витрине средств.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-dark">На главную</Link>
        <Link href="/#catalog" className="btn-light">К витрине</Link>
      </div>
    </section>
  );
}
