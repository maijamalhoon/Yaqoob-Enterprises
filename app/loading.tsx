export default function RootLoading() {
  return (
    <div className="public-site min-h-screen bg-white text-slate-900" aria-busy="true" aria-label="Loading website">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-xl font-bold tracking-tight text-[#203c60]">Yaqoob Enterprises</span>
          <span className="motion-safe:animate-pulse h-10 w-20 rounded-xl bg-slate-100" aria-hidden="true" />
        </div>
      </div>
      <div aria-hidden="true" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div aria-hidden="true" className="max-w-3xl space-y-5">
          <div className="motion-safe:animate-pulse h-5 w-48 rounded-md bg-slate-100" />
          <div className="motion-safe:animate-pulse h-12 w-full rounded-lg bg-slate-100 sm:w-2/3" />
          <div className="motion-safe:animate-pulse h-12 w-52 rounded-xl bg-slate-100" />
        </div>
        <div aria-hidden="true" className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="motion-safe:animate-pulse h-16 rounded-xl border border-slate-100 bg-slate-50" />
          ))}
        </div>
      </div>
    </div>
  );
}
