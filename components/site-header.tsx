import { BrandIcon } from "@/components/brand-icon";
import { MapPin } from "lucide-react";
import { StitchHeader } from "@/components/stitch-header";
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
  const whatsapp = whatsappUrl(settings.whatsapp_e164, `Hello ${settings.business_name}, I need help with a service.`);
  const directions = settings.map_url || "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";

  return (
    <>
      <StitchHeader settings={settings} statusText={statusText || ""} />
      {showMobileQuickActions && (
        <div
          className="mobile-action-bar"
          aria-label="Quick actions"
          style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
        >
          <TrackedLink className="mobile-action-bar__primary" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
            <BrandIcon name="whatsapp" size={16} /> WhatsApp
          </TrackedLink>
          <TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click">
            <BrandIcon name="phone" size={16} /> Call
          </TrackedLink>
          <TrackedLink href={directions} target="_blank" rel="noopener noreferrer" eventName="directions_click">
            <MapPin size={16} aria-hidden="true" /> Directions
          </TrackedLink>
        </div>
      )}
    </>
  );
}
