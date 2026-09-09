"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import type { BusinessSettings } from "@/lib/types";

interface StitchHeaderProps {
  settings: BusinessSettings;
  statusText: string;
}

export function StitchHeader({ settings, statusText }: StitchHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const phoneLink = `tel:${settings.phone_e164 || "+923492568864"}`;
  const whatsappLink = `https://wa.me/${(settings.whatsapp_e164 || "+923492568864").replace(/\+/g, "")}?text=${encodeURIComponent(
    `Hello ${settings.business_name}, I need assistance with a service.`
  )}`;

  return (
    <>
      {/* Top Status Banner */}
      <aside
        id="top-operating-banner"
        aria-label="Operating status"
        className="bg-[#0B192C] text-slate-300 text-xs py-2 px-3 sm:px-4 border-b border-slate-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 text-[11px] sm:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>{statusText || "Open Now · Until 11:00 PM"}</span>
            </span>
            <span className="text-slate-600 hidden xs:inline">|</span>
            <span className="hidden sm:inline text-slate-400 truncate text-xs">
              {settings.address || "Sector B, Near Jamia Masjid Muhammadi, Akhtar Colony, Karachi"}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-slate-300 text-[11px] sm:text-xs">
            <a
              id="topbar-phone-link"
              className="hover:text-white font-medium flex items-center gap-1.5 transition"
              href={phoneLink}
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{settings.phone_display || "+92 349 2568864"}</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Sticky Header */}
      <header
        id="site-header"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            id="brand-logo-link"
            aria-label="Yaqoob Enterprises Home"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
            href="/"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 bg-slate-50 p-1.5 rounded-xl border border-slate-200/70 flex items-center justify-center transition group-hover:border-slate-300">
              <svg className="w-full h-full" fill="none" viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 0 L 66 78 L 66 145 L 155 34 L 193 34 L 214 0 L 136 0 L 94 45 L 56 0 Z" fill="#0B192C"/>
                <path d="M 234 51 L 162 51 L 86 145 L 231 145 L 211 112 L 149 112 L 149 88 L 211 87 Z" fill="#0E7490" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                Yaqoob
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#0E7490] mt-0.5">
                Enterprises
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav
            id="desktop-nav-menu"
            className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700"
          >
            <a className="hover:text-[#0E7490] transition-colors py-1" href="#services">
              Services
            </a>
            <a className="hover:text-[#0E7490] transition-colors py-1" href="#how-it-works">
              How It Works
            </a>
            <a className="hover:text-[#0E7490] transition-colors py-1" href="#quick-request">
              Quick Request
            </a>
            <a className="hover:text-[#0E7490] transition-colors py-1" href="#visit-shop">
              Visit Shop
            </a>
            <a className="hover:text-[#0E7490] transition-colors py-1" href="#faq">
              FAQ
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Call Button */}
            <a
              id="header-call-btn"
              aria-label="Call Yaqoob Enterprises"
              className="inline-flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 text-sm font-semibold text-slate-800 bg-slate-100 sm:bg-white sm:border border-slate-200/90 rounded-full hover:bg-slate-100 active:scale-95 transition"
              href={phoneLink}
            >
              <Phone className="w-4 h-4 text-slate-800" />
              <span className="hidden sm:inline sm:ml-2">Call</span>
            </a>

            {/* Header WhatsApp Button */}
            <a
              id="header-whatsapp-btn"
              className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 active:scale-95 transition shadow-sm"
              href={whatsappLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span className="font-bold text-white" style={{ color: "#ffffff" }}>WhatsApp</span>
            </a>

            {/* Mobile Menu Trigger */}
            <button
              id="mobileMenuBtn"
              aria-label="Toggle navigation drawer"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-95 transition"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Overlay */}
        {drawerOpen && (
          <div
            id="mobileDrawer"
            className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 shadow-xl transition-all"
          >
            <div className="flex flex-col space-y-3 font-semibold text-slate-800 text-sm">
              <a
                className="py-2 px-3 rounded-lg hover:bg-slate-100"
                href="#services"
                onClick={() => setDrawerOpen(false)}
              >
                Services Catalog
              </a>
              <a
                className="py-2 px-3 rounded-lg hover:bg-slate-100"
                href="#how-it-works"
                onClick={() => setDrawerOpen(false)}
              >
                How It Works
              </a>
              <a
                className="py-2 px-3 rounded-lg hover:bg-slate-100"
                href="#quick-request"
                onClick={() => setDrawerOpen(false)}
              >
                Send Fast WhatsApp Request
              </a>
              <a
                className="py-2 px-3 rounded-lg hover:bg-slate-100"
                href="#visit-shop"
                onClick={() => setDrawerOpen(false)}
              >
                Shop Address &amp; Timings
              </a>
              <a
                className="py-2 px-3 rounded-lg hover:bg-slate-100"
                href="#faq"
                onClick={() => setDrawerOpen(false)}
              >
                Frequently Asked Questions
              </a>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate pr-2">{settings.address || "Sector B, Akhtar Colony"}</span>
              <span className="text-emerald-600 font-bold shrink-0">{statusText || "Open till 11 PM"}</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
