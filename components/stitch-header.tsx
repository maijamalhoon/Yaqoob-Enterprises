"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import type { BusinessSettings } from "@/lib/types";

interface StitchHeaderProps {
  settings: BusinessSettings;
  statusText: string;
}

export function StitchHeader({ settings }: StitchHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [brandLead, ...brandRest] = settings.business_name.trim().split(/\s+/);
  const phoneLink = `tel:${settings.phone_e164 || "+923492568864"}`;
  const whatsappLink = `https://wa.me/${(settings.whatsapp_e164 || "+923492568864").replace(/\+/g, "")}?text=${encodeURIComponent(
    `Hello ${settings.business_name}, I need assistance with a service.`,
  )}`;

  useEffect(() => {
    if (!drawerOpen) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setDrawerOpen(false);
      menuButtonRef.current?.focus();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [drawerOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      {/* Main Sticky Header */}
      <header
        id="site-header"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            id="brand-logo-link"
            aria-label={`${settings.business_name} home`}
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
            href="/"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-9 w-9 flex-shrink-0 object-contain sm:h-11 sm:w-11"
              src="/brand/logo-icon.svg"
              width={1076}
              height={668}
              alt=""
              aria-hidden="true"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                {brandLead}
              </span>
              {brandRest.length > 0 && (
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#0E7490] mt-0.5">
                  {brandRest.join(" ")}
                </span>
              )}
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Call Button */}
            <a
              id="header-call-btn"
              aria-label="Call Yaqoob Enterprises"
              className="hidden md:inline-flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 sm:bg-white sm:border border-slate-200/90 rounded-full hover:bg-slate-100 active:scale-95 transition"
              href={phoneLink}
            >
              <Phone className="w-4 h-4 text-slate-800" />
              <span className="hidden sm:inline sm:ml-2">Call</span>
            </a>

            {/* Header WhatsApp Button */}
            <a
              id="header-whatsapp-btn"
              className="hidden md:inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 active:scale-95 transition shadow-sm"
              href={whatsappLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              <BrandIcon name="whatsapp" size={16} badge={false} />
              <span className="font-bold text-white" style={{ color: "#ffffff" }}>WhatsApp</span>
            </a>

            {/* Mobile Menu Trigger */}
            <button
              ref={menuButtonRef}
              id="mobileMenuBtn"
              aria-label={drawerOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={drawerOpen}
              aria-controls="mobileDrawer"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-95 transition"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Overlay */}
        {drawerOpen && (
          <nav
            id="mobileDrawer"
            aria-label="Mobile navigation"
            className="border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl transition-all"
          >
            <div className="grid grid-cols-2 gap-2 font-semibold text-slate-800 text-xs sm:text-sm">
              <Link className="rounded-lg bg-slate-50 px-3 py-2.5 font-bold hover:bg-slate-100" href="/" onClick={() => setDrawerOpen(false)}>Home</Link>
              <Link className="rounded-lg bg-slate-50 px-3 py-2.5 font-bold text-[#0E7490] hover:bg-slate-100" href="/services" onClick={() => setDrawerOpen(false)}>All services</Link>
              <Link className="rounded-lg bg-slate-50 px-3 py-2.5 hover:bg-slate-100" href="/printing" onClick={() => setDrawerOpen(false)}>Printing</Link>
              <Link className="rounded-lg bg-slate-50 px-3 py-2.5 hover:bg-slate-100" href="/photocopying" onClick={() => setDrawerOpen(false)}>Photocopying</Link>
              <Link className="rounded-lg bg-slate-50 px-3 py-2.5 hover:bg-slate-100" href="/nadra-esahulat" onClick={() => setDrawerOpen(false)}>NADRA e-Sahulat</Link>
              <Link className="rounded-lg bg-slate-50 px-3 py-2.5 hover:bg-slate-100" href="/about" onClick={() => setDrawerOpen(false)}>About</Link>
              <Link className="col-span-2 rounded-lg bg-slate-100 px-3 py-2.5 font-bold hover:bg-slate-200" href="/contact" onClick={() => setDrawerOpen(false)}>Contact &amp; directions</Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
