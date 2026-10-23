import { MapPin, Phone, Clock } from "lucide-react";
import { TrackedLink } from "@/components/tracked-link";
import { formatBusinessHours } from "@/lib/data";
import type { BusinessHour, BusinessSettings } from "@/lib/types";

interface StitchVisitShopProps {
  settings: BusinessSettings;
  statusText: string;
  hours?: BusinessHour[];
}

export function StitchVisitShop({ settings, statusText, hours = [] }: StitchVisitShopProps) {
  const directionsUrl =
    settings.map_url || "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";
  const phoneCallUrl = "tel:" + (settings.phone_e164 || "+923492568864");

  return (
    <section
      id="visit-shop"
      className="relative py-12 sm:py-20 bg-white border-b border-slate-200"
      data-purpose="visit-shop"
    >
      <div id="visit" className="absolute -top-24" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-7 sm:mb-9">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Visit our shop
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            {settings.address ||
              "Plot No. 7, Street No. 1, Sector B, near Jamia Masjid Muhammadi, Akhtar Colony, Karachi"}
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-600" aria-hidden="true" />
            <span>{statusText || "Confirm today's hours on WhatsApp"}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0E7490]" aria-hidden="true" />
              Directions and contact
            </h3>
            <div className="flex flex-wrap gap-3">
              <TrackedLink
                id="directions-action-btn"
                eventName="directions_click"
                className="inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition"
                href={directionsUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <MapPin className="w-4 h-4 text-[#0E7490]" aria-hidden="true" />
                Directions
              </TrackedLink>
              <TrackedLink
                id="call-shop-action-btn"
                eventName="call_click"
                className="inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition"
                href={phoneCallUrl}
              >
                <Phone className="w-4 h-4 text-[#0E7490]" aria-hidden="true" />
                {settings.phone_display || "+92 349 2568864"}
              </TrackedLink>
            </div>
          </div>

          <div id="shop-card-working-hours" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0E7490]" aria-hidden="true" />
              Opening hours
            </h3>
            {hours.length > 0 ? (
              <dl className="space-y-2 text-sm">
                {hours.map((hour) => (
                  <div key={hour.id} className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                    <dt className="font-medium text-slate-700">{hour.label}</dt>
                    <dd className="font-semibold text-slate-900">{formatBusinessHours(hour)}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-slate-600">
                Confirm today&apos;s hours before visiting.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
