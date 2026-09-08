import { MapPin, Phone, Clock, Landmark, ShieldCheck } from "lucide-react";
import type { BusinessSettings } from "@/lib/types";

interface StitchVisitShopProps {
  settings: BusinessSettings;
  statusText: string;
}

export function StitchVisitShop({ settings, statusText }: StitchVisitShopProps) {
  const directionsUrl =
    settings.map_url ||
    "https://maps.google.com/?q=Jamia+Masjid+Muhammadi+Akhtar+Colony+Karachi";
  const phoneCallUrl = `tel:${settings.phone_e164 || "+923492568864"}`;

  return (
    <section
      id="visit-shop"
      className="py-12 sm:py-20 bg-white border-b border-slate-200"
      data-purpose="visit-shop"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Heading */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-[#0E7490] font-bold text-xs uppercase tracking-wider mb-2">
            <span className="w-4 h-0.5 bg-[#0E7490]"></span>
            <span>Visit The Shop</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Near Jamia Masjid Muhammadi <br />
            Akhtar Colony, Karachi.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            {settings.address ||
              "Plot No. 7, Street No. 1, Sector B, Near Jamia Masjid Muhammadi Akhtar Colony, Karachi, Pakistan"}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{statusText || "Open now · until 11:00 PM"}</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-3 mb-8 sm:mb-12">
          <a
            id="directions-action-btn"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 active:scale-95 rounded-xl transition shadow-sm"
            href={directionsUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <MapPin className="w-4 h-4 text-[#0E7490]" />
            <span>Directions</span>
          </a>
          <a
            id="call-shop-action-btn"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 active:scale-95 rounded-xl transition shadow-sm"
            href={phoneCallUrl}
          >
            <Phone className="w-4 h-4 text-slate-700" />
            <span>{settings.phone_display || "+92 349 2568864"}</span>
          </a>
        </div>

        {/* Schedule & Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div id="shop-card-working-hours" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0E7490]" />
              <span>Working Hours</span>
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Monday – Saturday:</span>
                <span className="text-slate-900 font-bold">9:00 AM – 11:00 PM</span>
              </div>
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Sunday:</span>
                <span className="text-slate-900 font-bold">4:00 PM – 10:30 PM</span>
              </div>
            </div>
          </div>

          <div id="shop-card-landmark" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#0E7490]" />
              <span>Prominent Landmark</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Located just steps from <span className="font-bold text-slate-900">Jamia Masjid Muhammadi</span> in Sector B, Street 1. Easy motorcycle and pedestrian access with street parking.
            </p>
          </div>

          <div id="shop-card-zero-wait" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0E7490]" />
              <span>Zero Wait Guarantee</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Send your documents on WhatsApp in advance. We will prepare your printouts or verify biometric servers before you walk into the shop.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
