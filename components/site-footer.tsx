import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { TrackedLink } from "@/components/tracked-link";
import { whatsappUrl } from "@/lib/data";
import type { BusinessSettings, ServiceCategory } from "@/lib/types";

export function SiteFooter({ settings, categories }: { settings: BusinessSettings; categories: ServiceCategory[] }) {
  const whatsapp = whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, I need help choosing the right service.");

  return (
    <footer className="site-footer site-footer--compact">
      <div className="container footer-grid footer-grid--compact">
        <div className="footer-brand-column">
          <Logo inverse />
          <p className="footer-summary">Printing, documents, biometric, online work and everyday digital help from one local shop.</p>
          <TrackedLink className="footer-location" href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click"><MapPin size={15} /> Akhtar Colony, Karachi</TrackedLink>
        </div>

        <div className="footer-services-column">
          <h2>Services</h2>
          <div className="footer-links footer-links--services">
            {categories.map((category) => <Link key={category.id} href={`/services/${category.slug}`}>{category.title}</Link>)}
          </div>
        </div>

        <div className="footer-contact-column">
          <h2>Talk to us</h2>
          <div className="footer-links footer-links--contact">
            <TrackedLink href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click"><MessageCircle size={15} /> WhatsApp</TrackedLink>
            <TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click"><Phone size={15} /> {settings.phone_display}</TrackedLink>
            <TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click"><MapPin size={15} /> Directions</TrackedLink>
            <Link href="/contact">Guided request</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Yaqoob Enterprises.</span>
        <span>Clear help. Fewer wasted trips.</span>
      </div>
    </footer>
  );
}
