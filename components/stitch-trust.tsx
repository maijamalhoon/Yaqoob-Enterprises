import { Star, ExternalLink, ShieldCheck, CheckCircle2, FileCheck } from "lucide-react";
import type { BusinessSettings } from "@/lib/types";

interface StitchTrustProps {
  settings: BusinessSettings;
  statusText?: string;
}

export function StitchTrust({ settings }: StitchTrustProps) {
  const gbpUrl =
    settings.google_business_profile_url ||
    settings.map_url ||
    "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";

  return (
    <section
      id="trust-section"
      className="py-12 sm:py-16 bg-white border-b border-slate-200"
      data-purpose="trust-signals"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/90 border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#0E7490]" />
                <span>Local &amp; Reliable Business</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Established physical shop in Sector B, Akhtar Colony.
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Yaqoob Enterprises operates a real, walk-in counter equipped with high-speed digital laser printers, copiers, passport-photo equipment, and authorized NADRA e-Sahulat biometric machines. Customers can visit in person or send files ahead via WhatsApp.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Real shop counter near Jamia Masjid Muhammadi</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Transparent rates confirmed before starting</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Direct phone &amp; WhatsApp communication</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Open daily until 11:00 PM (Friday break)</span>
                </div>
              </div>
            </div>

            {/* Right Card: Google Profile & Reviews */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Google Business Profile</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  Verified Local Business Listing
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Search for Yaqoob Enterprises on Google Maps for genuine customer directions, photos, and public reviews.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={gbpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E7490] hover:text-[#0b5a6f] transition"
                  >
                    <span>Read our Google reviews</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={gbpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition"
                  >
                    Open on Maps
                  </a>
                </div>
              </div>

              {/* Document Safety Note */}
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 leading-relaxed">
                  <strong className="block font-bold mb-0.5">Document Privacy Guarantee</strong>
                  Customer files and WhatsApp attachments are used strictly for printing or form filling and are promptly deleted from our systems.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
