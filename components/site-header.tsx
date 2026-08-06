import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { MobileNavigation } from "@/components/mobile-navigation";
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
          <div className="header-brand-cluster">
            <Logo />
            <span className="header-location"><MapPin size={13} /> Akhtar Colony</span>
          </div>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <Link href="/">Home</Link>
            <Link href="/#services">Services</Link>
            <Link href="/#coverage">Coverage</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="header-actions">
            <TrackedLink className="button button--ghost button--small desktop-only" href={`tel:${settings.phone_e164}`} eventName="call_click">
              <Phone size={16} aria-hidden="true" /> Call
            </TrackedLink>
            <TrackedLink className="button button--primary button--small desktop-only header-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
              <MessageCircle size={16} /> WhatsApp
            </TrackedLink>
            <MobileNavigation mapUrl={settings.map_url} />
          </div>
        </div>
      </header>
      <div className="mobile-action-bar" aria-label="Quick actions">
        <TrackedLink href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click"><MessageCircle size={17} /> WhatsApp</TrackedLink>
        <TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click"><Phone size={17} /> Call</TrackedLink>
        <TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click"><MapPin size={17} /> Directions</TrackedLink>
      </div>
    </>
  );
}
