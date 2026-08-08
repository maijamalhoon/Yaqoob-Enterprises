"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock3, Home, MapPin, Menu, MessageCircle, Phone, Store, X } from "lucide-react";
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
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");

  const active = pathname.startsWith("/services")
    ? "services"
    : pathname === "/contact"
      ? "contact"
      : pathname === "/" && hash === "#services"
        ? "services"
        : pathname === "/" && hash === "#get-in-touch"
          ? "contact"
          : pathname === "/"
            ? "home"
            : "";

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
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

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
          <Link className={active === "home" ? "is-active" : undefined} aria-current={active === "home" ? "page" : undefined} href="/"><Home size={19} /> <span><strong>Home</strong><small>Start here</small></span></Link>
          <Link className={active === "services" ? "is-active" : undefined} aria-current={active === "services" ? (pathname.startsWith("/services") ? "page" : "location") : undefined} href="/#services"><Store size={19} /> <span><strong>Services</strong><small>Browse all categories</small></span></Link>
          <Link className={active === "contact" ? "is-active" : undefined} aria-current={active === "contact" ? (pathname === "/contact" ? "page" : "location") : undefined} href="/#get-in-touch"><MessageCircle size={19} /> <span><strong>Get in touch</strong><small>Send a quick request</small></span></Link>
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
