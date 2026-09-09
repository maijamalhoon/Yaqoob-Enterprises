import { Phone } from "lucide-react";
import type { BusinessSettings } from "@/lib/types";

interface StitchFloatingActionsProps {
  settings: BusinessSettings;
}

export function StitchFloatingActions({ settings }: StitchFloatingActionsProps) {
  const phone = settings.phone_e164 || "+923492568864";
  const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encodeURIComponent(
    `Hello ${settings.business_name}, I have an inquiry regarding a service.`
  )}`;
  const callUrl = `tel:${phone}`;

  return (
    <>
      {/* Persistent Mobile Bottom Action Bar */}
      <div
        id="mobile-bottom-action-bar"
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 flex md:hidden items-center justify-between gap-2.5 shadow-2xl"
      >
        {/* Call button */}
        <a
          id="mobile-bottom-call-btn"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50 active:bg-slate-100 active:scale-95 text-xs font-bold text-slate-800 transition"
          href={callUrl}
        >
          <Phone className="w-4 h-4 text-slate-700 shrink-0" />
          <span>Call Shop</span>
        </a>

        {/* Primary WhatsApp Button */}
        <a
          id="mobile-bottom-whatsapp-btn"
          className="flex-[1.4] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 active:bg-slate-800 active:scale-95 text-xs font-bold text-white shadow-md transition"
          href={whatsappUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <svg className="w-4 h-4 text-emerald-400 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span className="font-bold text-white" style={{ color: "#ffffff" }}>WhatsApp Us</span>
        </a>
      </div>

      {/* Desktop Floating Action */}
      <aside
        id="desktop-floating-contact"
        aria-label="WhatsApp fast contact"
        className="hidden md:block fixed bottom-6 right-6 z-40"
      >
        <a
          id="desktop-floating-whatsapp-btn"
          aria-label="Direct WhatsApp message"
          className="flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-full shadow-xl hover:bg-slate-800 transition transform hover:-translate-y-0.5 border border-slate-700 active:scale-95"
          href={whatsappUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <svg className="w-5 h-5 text-emerald-400 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span className="text-xs font-bold tracking-wide pr-1 text-white" style={{ color: "#ffffff" }}>WhatsApp Us</span>
        </a>
      </aside>
    </>
  );
}
