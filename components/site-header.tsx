import Link from "next/link";
import { MapPin, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { TrackedLink } from "@/components/tracked-link";
import type { BusinessSettings } from "@/lib/types";
import { whatsappUrl } from "@/lib/data";

export function SiteHeader({ settings }: { settings: BusinessSettings }) {
  const whatsapp = whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, I need help with a service.");

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <div className="container site-header__inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Primary navigation">
            <Link href="/">Home</Link>
            <Link href="/#services">Services</Link>
            <Link href="/#coverage">Coverage</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="header-actions">
            <TrackedLink className="button button--ghost button--small desktop-only" href={`tel:${settings.phone_e164}`} eventName="call_click">
              <Phone size={17} /> Call
            </TrackedLink>
            <TrackedLink className="button button--primary button--small desktop-only" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
              WhatsApp
            </TrackedLink>
            <details className="mobile-nav">
              <summary aria-label="Open navigation"><Menu className="menu-open-icon" /><X className="menu-close-icon" /></summary>
              <nav aria-label="Mobile navigation">
                <Link href="/">Home</Link>
                <Link href="/#services">Services</Link>
                <Link href="/#coverage">Coverage</Link>
                <Link href="/contact">Contact</Link>
                <TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click"><MapPin size={18} /> Directions</TrackedLink>
              </nav>
            </details>
          </div>
        </div>
      </header>
      <div className="mobile-action-bar" aria-label="Quick actions">
        <TrackedLink href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">WhatsApp</TrackedLink>
        <TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click">Call</TrackedLink>
        <TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click">Directions</TrackedLink>
      </div>
    </>
  );
}
