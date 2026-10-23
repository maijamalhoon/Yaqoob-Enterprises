import { Navigation, Phone } from "lucide-react";
import { TrackedLink } from "@/components/tracked-link";
import { BrandIcon } from "@/components/brand-icon";
import type { BusinessSettings } from "@/lib/types";

interface StitchFloatingActionsProps {
  settings: BusinessSettings;
  whatsappMessage?: string;
}

export function StitchFloatingActions({ settings, whatsappMessage }: StitchFloatingActionsProps) {
  const phone = settings.phone_e164 || "+923492568864";
  const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encodeURIComponent(
    whatsappMessage || `Hello ${settings.business_name}, I need assistance with a service.`,
  )}`;
  const directionsUrl = settings.map_url || "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";

  return (
    <nav className="mobile-action-bar" aria-label="Quick contact actions">
      <TrackedLink className="mobile-action-bar__secondary" href={`tel:${phone}`} eventName="call_click">
        <Phone size={16} aria-hidden="true" />
        <span>Call</span>
      </TrackedLink>
      <TrackedLink
        className="mobile-action-bar__primary"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        eventName="whatsapp_click"
      >
        <BrandIcon name="whatsapp" size={16} badge={false} />
        <span>WhatsApp</span>
      </TrackedLink>
      <TrackedLink
        className="mobile-action-bar__secondary"
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        eventName="directions_click"
      >
        <Navigation size={16} aria-hidden="true" />
        <span>Directions</span>
      </TrackedLink>
    </nav>
  );
}
