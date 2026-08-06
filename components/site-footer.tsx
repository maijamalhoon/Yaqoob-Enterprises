import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { TrackedLink } from "@/components/tracked-link";
import { whatsappUrl } from "@/lib/data";
import type { BusinessSettings, ServiceCategory } from "@/lib/types";

export function SiteFooter({ settings, categories }: { settings: BusinessSettings; categories: ServiceCategory[] }) {
  const whatsapp = whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, I need help with a service.");

  return (
    <footer className="site-footer">
      <div className="container footer-cta">
        <div>
          <span>Need help choosing the right service?</span>
          <h2>Send the requirement. We will guide the next step.</h2>
        </div>
        <TrackedLink className="button button--light" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
          <MessageCircle size={18} /> Start on WhatsApp <ArrowRight size={16} />
        </TrackedLink>
      </div>
      <div className="container footer-grid">
        <div className="footer-brand-column">
          <Logo inverse />
          <p className="footer-summary">One local service centre for printing, documentation, biometric, payments, tickets, online work and everyday supplies.</p>
          <span className="footer-location"><MapPin size={15} /> Akhtar Colony, Karachi</span>
        </div>
        <div>
          <h2>Services</h2>
          <div className="footer-links footer-links--services">
            {categories.map((category) => <Link key={category.id} href={`/services/${category.slug}`}>{category.title}</Link>)}
          </div>
        </div>
        <div>
          <h2>Contact</h2>
          <div className="footer-links footer-links--contact">
            <TrackedLink href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click"><MessageCircle size={15} /> WhatsApp us</TrackedLink>
            <TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click"><Phone size={15} /> {settings.phone_display}</TrackedLink>
            <TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click"><MapPin size={15} /> Get directions</TrackedLink>
            <Link href="/contact">Prepare a request</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Yaqoob Enterprises.</span>
        <span>Clear service. Practical next step.</span>
      </div>
    </footer>
  );
}
