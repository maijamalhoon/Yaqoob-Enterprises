"use client";

import Link from "next/link";
import { Clock3, Home, MapPin, Menu, MessageCircle, Phone, Send, Store, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TrackedLink } from "@/components/tracked-link";

export function MobileNavigation({
  mapUrl,
  phone,
  whatsappUrl,
  statusText,
}: {
  mapUrl: string;
  phone: string;
  whatsappUrl: string;
  statusText?: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(({ restoreFocus = false }: { restoreFocus?: boolean } = {}) => {
    if (detailsRef.current) detailsRef.current.open = false;
    setOpen(false);
    if (restoreFocus) summaryRef.current?.focus();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("mobile-menu-open", open);
    return () => document.documentElement.classList.remove("mobile-menu-open");
  }, [open]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (open && detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) closeMenu({ restoreFocus: true });
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, open]);

  return (
    <details
      className="mobile-nav"
      ref={detailsRef}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary
        ref={summaryRef}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-primary-navigation"
      >
        <Menu className="menu-open-icon" aria-hidden="true" />
        <X className="menu-close-icon" aria-hidden="true" />
      </summary>

      <button className="mobile-nav__backdrop" type="button" aria-label="Close navigation" onClick={() => closeMenu()} />
      <div
        className="mobile-nav__panel"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) closeMenu();
        }}
      >
        <div className="mobile-menu-head">
          <span className="mobile-menu-head__eyebrow">Yaqoob Enterprises</span>
          <strong>What do you need today?</strong>
          {statusText && <span className="mobile-menu-status"><Clock3 size={15} /> {statusText}</span>}
        </div>

        <nav id="mobile-primary-navigation" aria-label="Mobile navigation">
          <Link href="/"><Home size={19} /> <span><strong>Home</strong><small>Start here</small></span></Link>
          <Link href="/#services"><Store size={19} /> <span><strong>Services</strong><small>Find the right category</small></span></Link>
          <Link href="/#coverage"><MapPin size={19} /> <span><strong>Coverage</strong><small>Delivery &amp; home visits</small></span></Link>
          <Link href="/contact"><Send size={19} /> <span><strong>Send a request</strong><small>Build a clear WhatsApp message</small></span></Link>
        </nav>

        <div className="mobile-menu-actions">
          <TrackedLink className="mobile-menu-action mobile-menu-action--primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
            <MessageCircle size={18} /> WhatsApp
          </TrackedLink>
          <TrackedLink className="mobile-menu-action" href={`tel:${phone}`} eventName="call_click">
            <Phone size={18} /> Call
          </TrackedLink>
          <TrackedLink className="mobile-menu-action" href={mapUrl} target="_blank" rel="noopener noreferrer" eventName="directions_click">
            <MapPin size={18} /> Directions
          </TrackedLink>
        </div>
      </div>
    </details>
  );
}
