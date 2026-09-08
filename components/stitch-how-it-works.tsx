export function StitchHowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Send the requirement",
      desc: "Tell us the service, quantity, deadline, or any detail that matters via quick WhatsApp message or the form below.",
    },
    {
      step: "02",
      title: "Get a clear confirmation",
      desc: "We confirm what is required, server availability, expected timing, and exact transparent charges with no surprises.",
    },
    {
      step: "03",
      title: "Use the right service option",
      desc: "Visit the shop with zero queue time, collect documents, request digital delivery to your phone, or arrange an appointment.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-20 bg-white border-b border-slate-200"
      data-purpose="how-it-works"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
            <span className="w-4 h-0.5 bg-[#0E7490]"></span>
            <span>How It Works</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Know the next step <br className="hidden sm:inline" />
            before you travel.
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
            No waiting in line just to find out a portal is offline or a prerequisite document is missing.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((item) => (
            <div
              id={`how-step-${item.step}`}
              key={item.step}
              className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 sm:p-7 relative transition-all duration-200 hover:border-slate-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  {item.step}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E7490] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                  Step {item.step}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
