import { MapPin, MessageCircle, Phone } from "lucide-react";
import { DesktopNavigation } from "@/components/desktop-navigation";
import { Logo } from "@/components/logo";
import { MobileNavigation } from "@/components/mobile-navigation";
import { TrackedLink } from "@/components/tracked-link";
import type { BusinessSettings } from "@/lib/types";
import { whatsappUrl } from "@/lib/data";

export function SiteHeader({ settings, statusText }: { settings: BusinessSettings; statusText?: string }) {
  const whatsapp = whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, I need help with a service.");
  const isOpen = statusText?.startsWith("Open now");

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <div className="container site-header__inner">
          <div className="header-brand-cluster">
            <Logo />
            <span className="header-location"><MapPin size={13} /> Akhtar Colony</span>
            {statusText && (
              <span className={`mobile-header-status ${isOpen ? "is-open" : ""}`} title={statusText}>
                <span aria-hidden="true" />
                {isOpen ? "Open now" : statusText.split(" · ")[0]}
              </span>
            )}
          </div>
          <DesktopNavigation />
          <div className="header-actions">
            <TrackedLink
              className="header-icon-action header-icon-action--phone desktop-only"
              href={`tel:${settings.phone_e164}`}
              eventName="call_click"
              aria-label="Call Yaqoob Enterprises"
              title="Call"
            >
              <Phone size={19} strokeWidth={1.9} aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              className="header-icon-action header-icon-action--whatsapp desktop-only"
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              eventName="whatsapp_click"
              aria-label="Message Yaqoob Enterprises on WhatsApp"
              title="WhatsApp"
            >
              <MessageCircle size={20} strokeWidth={1.9} aria-hidden="true" />
            </TrackedLink>
            <MobileNavigation
              mapUrl={settings.map_url}
              phone={settings.phone_e164}
              whatsappUrl={whatsapp}
              statusText={statusText}
            />
          </div>
        </div>
      </header>
      <div className="mobile-action-bar" aria-label="Quick actions">
        <TrackedLink className="mobile-action-bar__primary" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click"><MessageCircle size={17} /> WhatsApp</TrackedLink>
        <TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click"><Phone size={17} /> Call</TrackedLink>
        <TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click"><MapPin size={17} /> Directions</TrackedLink>
      </div>
    </>
  );
}
