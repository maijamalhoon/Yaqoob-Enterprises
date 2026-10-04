import Link from "next/link";
import { Phone, MapPin, Clock, ArrowUp, MessageCircle, ExternalLink } from "lucide-react";
import type { BusinessSettings } from "@/lib/types";

interface StitchFooterProps {
  settings: BusinessSettings;
}

export function StitchFooter({ settings }: StitchFooterProps) {
  const phone = settings.phone_e164 || "+923492568864";
  const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encodeURIComponent(
    `Hello ${settings.business_name}, I have an inquiry.`
  )}`;
  const gbpUrl =
    settings.google_business_profile_url ||
    settings.map_url ||
    "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";

  return (
    <footer
      id="site-footer"
      className="bg-[#07111E] text-slate-300 pt-16 pb-12 border-t border-slate-800/80"
      data-purpose="footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 pb-12 border-b border-slate-800/80">
          {/* Brand & Credibility */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group focus:outline-none"
              aria-label="Yaqoob Enterprises Home"
            >
              <div className="w-10 h-10 shrink-0 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/80 flex items-center justify-center transition group-hover:border-teal-500/50">
                <svg
                  className="w-full h-full"
                  fill="none"
                  viewBox="0 0 240 150"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="YE Monogram"
                >
                  <path
                    d="M 0 0 L 66 78 L 66 145 L 155 34 L 193 34 L 214 0 L 136 0 L 94 45 L 56 0 Z"
                    fill="#FFFFFF"
                  />
                  <path
                    d="M 234 51 L 162 51 L 86 145 L 231 145 L 211 112 L 149 112 L 149 88 L 211 87 Z"
                    fill="#2DD4BF"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white leading-none">
                  Yaqoob
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 mt-1">
                  Enterprises
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Printing, Photocopying &amp; NADRA e-Sahulat Services in Akhtar Colony, Karachi. Serving local residents, students, and businesses with fast, reliable counter and WhatsApp service.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified e-Sahulat Center</span>
              </span>
              <a
                href={gbpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                <span>Google Profile</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Major Print Services */}
          <div className="lg:col-span-3 space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-widest text-white/90">
              Print &amp; Copy Services
            </p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link className="hover:text-teal-400 transition-colors inline-block" href="/printing">
                  Laser Printing (B&amp;W &amp; Color)
                </Link>
              </li>
              <li>
                <Link className="hover:text-teal-400 transition-colors inline-block" href="/photocopying">
                  Photocopying Services
                </Link>
              </li>
              <li>
                <Link className="hover:text-teal-400 transition-colors inline-block" href="/color-printing">
                  Color Printing &amp; Copy
                </Link>
              </li>
              <li>
                <Link className="hover:text-teal-400 transition-colors inline-block" href="/notes-printing">
                  Notes &amp; Assignment Printing
                </Link>
              </li>
              <li>
                <Link className="hover:text-teal-400 transition-colors inline-block" href="/bulk-printing">
                  Bulk Printing &amp; Copying
                </Link>
              </li>
              <li>
                <Link className="hover:text-teal-400 transition-colors inline-block" href="/office-printing">
                  Office &amp; Org Printing
                </Link>
              </li>
              <li>
                <Link className="hover:text-teal-400 transition-colors inline-block" href="/photo-printing">
                  Passport Photos (5 Min)
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification & Navigation */}
          <div className="lg:col-span-2 space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-widest text-white/90">
              Quick Links
            </p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link className="hover:text-teal-400 transition-colors font-medium text-emerald-400" href="/nadra-esahulat">
                  NADRA e-Sahulat
                </Link>
              </li>
              <li>
                <Link className="hover:text-teal-400 transition-colors" href="/about">
                  About Our Shop
                </Link>
              </li>
              <li>
                <Link className="hover:text-teal-400 transition-colors" href="/contact">
                  Contact &amp; Map
                </Link>
              </li>
              <li>
                <Link className="hover:text-teal-400 transition-colors" href="/services">
                  All Services Directory
                </Link>
              </li>
              <li>
                <Link className="hover:text-teal-400 transition-colors" href="/#quick-request">
                  WhatsApp Fast Request
                </Link>
              </li>
              <li>
                <Link className="hover:text-teal-400 transition-colors" href="/privacy">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="lg:col-span-3 space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-widest text-white/90">
              Shop Contact
            </p>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a
                  className="inline-flex items-center gap-2.5 text-slate-200 hover:text-emerald-400 transition group"
                  href={whatsappUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                    <MessageCircle className="w-4 h-4" />
                  </span>
                  <span>WhatsApp: {settings.phone_display || "+92 349 2568864"}</span>
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center gap-2.5 text-slate-200 hover:text-teal-400 transition group"
                  href={`tel:${phone}`}
                >
                  <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:scale-105 transition">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <span>Call: {settings.phone_display || "+92 349 2568864"}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-slate-400 pt-1">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  Plot No. 7, Street No. 1, Sector B, Near Jamia Masjid Muhammadi, Akhtar Colony, Karachi, Pakistan.
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Mon – Sat: 9:00 AM – 11:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Yaqoob Enterprises. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Sector B, Near Jamia Masjid Muhammadi, Akhtar Colony, Karachi</span>
            <a
              href="#site-header"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-teal-400 transition"
              aria-label="Back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
