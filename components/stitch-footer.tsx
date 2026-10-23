import Link from "next/link";
import { Clock, ExternalLink, MapPin, Phone, ArrowUp } from "lucide-react";
import { Logo } from "@/components/logo";
import { BrandIcon } from "@/components/brand-icon";
import type { BusinessSettings } from "@/lib/types";

interface StitchFooterProps {
  settings: BusinessSettings;
  statusText: string;
}

const SERVICE_LINKS = [
  ["/printing", "Printing"],
  ["/photocopying", "Photocopying"],
  ["/color-printing", "Color printing"],
  ["/notes-printing", "Notes and assignments"],
  ["/bulk-printing", "Bulk printing"],
  ["/office-printing", "Office printing"],
  ["/photo-printing", "Passport photos"],
  ["/nadra-esahulat", "NADRA e-Sahulat"],
];

export function StitchFooter({ settings, statusText }: StitchFooterProps) {
  const phone = settings.phone_e164 || "+923492568864";
  const whatsappUrl =
    "https://wa.me/" +
    phone.replace(/[^0-9]/g, "") +
    "?text=" +
    encodeURIComponent("Hello " + settings.business_name + ", I have an inquiry.");
  const locationLabel = settings.address;
  const googleProfileUrl = settings.google_business_profile_url;

  return (
    <footer id="site-footer" className="public-footer" data-purpose="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="public-footer__main">
          <div className="public-footer__brand">
            <Logo inverse businessName={settings.business_name} />
            <p>Printing, photocopying and e-Sahulat services in Akhtar Colony, Karachi.</p>
            {googleProfileUrl && (
              <a
                href={googleProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="public-footer__external"
              >
                Google Business Profile
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            )}
          </div>

          <nav className="public-footer__services" aria-label="Services">
            <h2>Services</h2>
            <ul>
              {SERVICE_LINKS.map(([href, label]) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
              <li>
                <Link href="/services">All services</Link>
              </li>
            </ul>
          </nav>

          <div className="public-footer__contact">
            <h2>Visit or contact</h2>
            <address>
              <MapPin size={17} aria-hidden="true" />
              <span>{locationLabel}</span>
            </address>
            <a href={"tel:" + phone}>
              <Phone size={17} aria-hidden="true" />
              <span>Call {settings.phone_display || "+92 349 2568864"}</span>
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <BrandIcon name="whatsapp" size={17} />
              <span>WhatsApp</span>
              <ExternalLink size={13} aria-hidden="true" />
            </a>
            <p>
              <Clock size={16} aria-hidden="true" />
              <span>{statusText || "Confirm today's hours before visiting"}</span>
            </p>
          </div>
        </div>

        <div className="public-footer__bottom">
          <span>© {new Date().getFullYear()} {settings.business_name}</span>
          <nav aria-label="More links">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/#visit">Hours and directions</Link>
          </nav>
          <a href="#site-header" aria-label="Back to top">
            Top <ArrowUp size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
