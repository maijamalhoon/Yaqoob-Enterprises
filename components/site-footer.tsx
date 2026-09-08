import Link from "next/link";
import { BrandIcon } from "@/components/brand-icon";
import { Logo } from "@/components/logo";
import { TrackedLink } from "@/components/tracked-link";
import { businessLocationLabel } from "@/lib/business-display";
import { whatsappUrl } from "@/lib/data";
import type { BusinessSettings, ServiceCategory } from "@/lib/types";

export function SiteFooter({ settings }: { settings: BusinessSettings; categories: ServiceCategory[] }) {
  const whatsapp = whatsappUrl(settings.whatsapp_e164, `Hello ${settings.business_name}, I need help choosing the right service.`);
  const locationLabel = businessLocationLabel(settings.address);

  return (
    <footer className="site-footer site-footer--minimal">
      <div className="container minimal-footer__top">
        <div className="minimal-footer__brand">
          <Logo inverse businessName={settings.business_name} />
          <p>{settings.tagline} · {locationLabel}.</p>
        </div>

        <nav className="minimal-footer__nav" aria-label="Footer navigation">
          <Link href="/#services">Services</Link>
          <Link href="/contact">Guided request</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>

        <div className="minimal-footer__contact">
          <TrackedLink href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
            <BrandIcon name="whatsapp" size={15} /> WhatsApp
          </TrackedLink>
          <TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click">
            <BrandIcon name="phone" size={15} /> {settings.phone_display}
          </TrackedLink>
          <TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click">
            <BrandIcon name="location" size={15} /> Directions
          </TrackedLink>
        </div>
      </div>
      <div className="container minimal-footer__bottom">
        <span>© {new Date().getFullYear()} {settings.business_name}.</span>
        <span>{locationLabel}.</span>
      </div>
    </footer>
  );
}
