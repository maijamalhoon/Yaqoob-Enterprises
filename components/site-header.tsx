import { MessageCircle, Phone } from "lucide-react";
import { DesktopNavigation } from "@/components/desktop-navigation";
import { Logo } from "@/components/logo";
import { MobileNavigation } from "@/components/mobile-navigation";
import { TrackedLink } from "@/components/tracked-link";
import type { BusinessSettings } from "@/lib/types";
import { whatsappUrl } from "@/lib/data";

export function SiteHeader({
  settings,
  statusText,
  showMobileQuickActions = true,
}: {
  settings: BusinessSettings;
  statusText?: string;
  showMobileQuickActions?: boolean;
}) {
  const whatsapp = whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, I need help with a service.");
  const isOpen = statusText?.startsWith("Open now");

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <div className="container site-header__inner">
          <div className="header-brand-cluster">
            <Logo />
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
              className="header-text-action desktop-only"
              href={`tel:${settings.phone_e164}`}
              eventName="call_click"
              aria-label={`Call Yaqoob Enterprises at ${settings.phone_display}`}
            >
              <Phone size={16} strokeWidth={1.9} aria-hidden="true" />
              <span>Call</span>
            </TrackedLink>
            <TrackedLink
              className="header-text-action header-text-action--primary desktop-only"
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              eventName="whatsapp_click"
              aria-label="Message Yaqoob Enterprises on WhatsApp"
            >
              <MessageCircle size={17} strokeWidth={1.9} aria-hidden="true" />
              <span>WhatsApp</span>
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
      {showMobileQuickActions && (
        <div
          className="mobile-action-bar"
          aria-label="Quick actions"
          style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
        >
          <TrackedLink className="mobile-action-bar__primary" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click"><MessageCircle size={17} /> WhatsApp</TrackedLink>
          <TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click"><Phone size={17} /> Call</TrackedLink>
        </div>
      )}
    </>
  );
}
