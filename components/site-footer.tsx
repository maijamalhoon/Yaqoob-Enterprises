import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { TrackedLink } from "@/components/tracked-link";
import { whatsappUrl } from "@/lib/data";
import type { BusinessSettings, ServiceCategory } from "@/lib/types";

export function SiteFooter({ settings }: { settings: BusinessSettings; categories: ServiceCategory[] }) {
  const whatsapp = whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, I need help choosing the right service.");

  return (
    <footer className="site-footer site-footer--minimal">
      <div className="container minimal-footer__top">
        <div className="minimal-footer__brand">
          <Logo inverse />
          <p>Printing, documents, biometric and everyday digital services in Akhtar Colony, Karachi.</p>
        </div>

        <nav className="minimal-footer__nav" aria-label="Footer navigation">
          <Link href="/#services">Services</Link>
          <Link href="/contact">Guided request</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>

        <div className="minimal-footer__contact">
          <TrackedLink href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click"><MessageCircle size={15} /> WhatsApp</TrackedLink>
          <TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click"><Phone size={15} /> {settings.phone_display}</TrackedLink>
          <TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click"><MapPin size={15} /> Directions</TrackedLink>
        </div>
      </div>
      <div className="container minimal-footer__bottom">
        <span>© {new Date().getFullYear()} Yaqoob Enterprises.</span>
        <span>Akhtar Colony, Karachi.</span>
      </div>
    </footer>
  );
}
