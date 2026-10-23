export function StitchHowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Send your request",
      description: "Tell us the service, quantity and any deadline by WhatsApp or the form.",
    },
    {
      number: "02",
      title: "Confirm the details",
      description: "We confirm what is needed, availability, charges and timing.",
    },
    {
      number: "03",
      title: "Visit or collect",
      description: "Come to the shop or arrange another available service option.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-20 bg-white border-b border-slate-200"
      data-purpose="how-it-works"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-7 sm:mb-9">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Before you visit
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
            Check what you need and confirm availability first.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {steps.map((item) => (
            <li
              id={"how-step-" + item.number}
              key={item.number}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6"
            >
              <span
                className="inline-flex w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs items-center justify-center mb-3"
                aria-hidden="true"
              >
                {item.number}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
