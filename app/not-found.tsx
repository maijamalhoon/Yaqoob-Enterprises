import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20 text-slate-900">
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-7 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">404 · Yaqoob Enterprises</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600">This page may have moved. Find what you need below.</p>
        <nav aria-label="Helpful pages" className="mt-7 flex flex-wrap gap-3">
          <Link className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white" href="/">Home</Link>
          <Link className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold" href="/services">Services</Link>
          <Link className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold" href="/rates">Rate list</Link>
          <Link className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold" href="/contact">Contact</Link>
        </nav>
      </div>
    </main>
  );
}
