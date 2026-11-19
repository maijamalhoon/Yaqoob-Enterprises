"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PublicError({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[public-site] Render failed", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 text-slate-900 sm:py-24">
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">Yaqoob Enterprises</span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Page temporarily unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">You can still call or message us about your work.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button type="button" onClick={() => reset()} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800">Try again</button>
          <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold hover:bg-slate-50">Contact us</Link>
          <a href="tel:+923492568864" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold hover:bg-slate-50">Call shop</a>
        </div>
        {error.digest && <p className="mt-5 text-xs text-slate-500">Reference: {error.digest}</p>}
      </div>
    </main>
  );
}
