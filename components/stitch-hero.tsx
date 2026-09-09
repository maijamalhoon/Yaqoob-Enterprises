import { MapPin } from "lucide-react";
import type { BusinessSettings, GalleryImage } from "@/lib/types";
import { StitchShopLoop } from "./stitch-shop-loop";

interface StitchHeroProps {
  settings: BusinessSettings;
  statusText: string;
  locationLabel: string;
  gallery: GalleryImage[];
}

export function StitchHero({ settings, statusText, locationLabel, gallery }: StitchHeroProps) {
  const whatsappLink = `https://wa.me/${(settings.whatsapp_e164 || "+923492568864").replace(/\+/g, "")}?text=${encodeURIComponent(
    `Hello ${settings.business_name}, I need help with: `
  )}`;

  return (
    <section id="hero-section" className="relative bg-white pt-6 sm:pt-12 pb-12 sm:pb-20 overflow-hidden border-b border-slate-100" data-purpose="hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-4 sm:space-y-6">
            {/* Neighborhood Location Pill */}
            <div
              id="hero-location-pill"
              className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200/90 shadow-sm"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-700 font-medium">{statusText || "Open now · until 11:00 PM"}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 flex items-center gap-1 truncate max-w-[220px] xs:max-w-none">
                <MapPin className="w-3 h-3 text-[#0E7490] inline shrink-0" />
                {locationLabel || "Sector B, Akhtar Colony, Karachi"}
              </span>
            </div>

            {/* Dynamic Focus Tag */}
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Local center for{" "}
              <span className="text-[#0E7490] border-b-2 border-[#0E7490]/40 pb-0.5">
                Biometrics, Printing &amp; Digital Services
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.14]">
              Everything you need, <br className="hidden sm:block" />
              handled locally.
            </h1>

            {/* Value Proposition */}
            <p className="text-sm sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              Check requirements, availability, and transparent charges on WhatsApp before you visit. Serving Akhtar Colony with verified NADRA e-Sahulat, legal documentation, printing, and ticketing.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-1">
              <a
                id="hero-whatsapp-cta"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-xl shadow-md transition group"
                href={whatsappLink}
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span className="font-bold text-white" style={{ color: "#ffffff" }}>Send your requirement</span>
                <span className="text-slate-300 group-hover:translate-x-0.5 transition-transform" style={{ color: "#cbd5e1" }}>→</span>
              </a>
              <a
                id="hero-browse-cta"
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 active:scale-[0.98] rounded-xl transition shadow-sm"
                href="#services"
              >
                Browse services
              </a>
            </div>

            {/* Trust Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-200/80 w-full">
              <div className="bg-slate-50 p-2.5 sm:p-0 sm:bg-transparent rounded-xl">
                <p className="text-[11px] text-slate-500 font-medium">NADRA</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">Verified e-Sahulat</p>
              </div>
              <div className="bg-slate-50 p-2.5 sm:p-0 sm:bg-transparent rounded-xl">
                <p className="text-[11px] text-slate-500 font-medium">Timing</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">Until 11:00 PM</p>
              </div>
              <div className="bg-slate-50 p-2.5 sm:p-0 sm:bg-transparent rounded-xl">
                <p className="text-[11px] text-slate-500 font-medium">WhatsApp</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">Fast Pre-Check</p>
              </div>
              <div className="bg-slate-50 p-2.5 sm:p-0 sm:bg-transparent rounded-xl">
                <p className="text-[11px] text-slate-500 font-medium">Location</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">Sector B Akhtar Col.</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Shop Photos Loop (Managed via /admin) */}
          <div className="lg:col-span-5 flex justify-center mt-4 lg:mt-0 w-full">
            <StitchShopLoop
              galleryImages={gallery}
              locationLabel={locationLabel}
              whatsappLink={whatsappLink}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
