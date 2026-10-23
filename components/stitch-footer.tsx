import Link from "next/link";
import { Clock, ExternalLink, Navigation, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { TrackedLink } from "@/components/tracked-link";
import type { BusinessSettings } from "@/lib/types";

interface StitchFooterProps {
  settings: BusinessSettings;
  statusText: string;
}

export function StitchFooter({ settings, statusText }: StitchFooterProps) {
  const phone = settings.phone_e164 || "+923492568864";
  const mapUrl = settings.map_url || "https://maps.app.goo.gl/uvWeMqEFYYPrEzw9A";
  const googleProfileUrl = settings.google_business_profile_url;

  return (
    <footer id="site-footer" className="public-footer" data-purpose="footer">
      <div className="public-footer__inner">
        <div className="public-footer__brand">
          <Logo inverse businessName={settings.business_name} />
          <p>{settings.address || "Akhtar Colony, Karachi"}</p>
          {googleProfileUrl && (
            <a href={googleProfileUrl} target="_blank" rel="noopener noreferrer" className="public-footer__external">
              Google Business Profile <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>

        <nav className="public-footer__links" aria-label="Footer">
          <Link href="/services">All services</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>

        <div className="public-footer__contact">
          <TrackedLink href={mapUrl} target="_blank" rel="noopener noreferrer" eventName="directions_click">
            <Navigation size={16} aria-hidden="true" /> Directions
          </TrackedLink>
          <TrackedLink href={`tel:${phone}`} eventName="call_click">
            <Phone size={16} aria-hidden="true" /> {settings.phone_display || "+92 349 2568864"}
          </TrackedLink>
          {statusText && <p><Clock size={16} aria-hidden="true" /> {statusText}</p>}
        </div>
      </div>

      <div className="public-footer__bottom">
        <span>© {new Date().getFullYear()} {settings.business_name}</span>
        <Link href="#page-top">Back to top</Link>
      </div>
    </footer>
  );
}
