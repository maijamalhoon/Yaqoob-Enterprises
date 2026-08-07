import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { TrackedLink } from "@/components/tracked-link";
import { whatsappUrl } from "@/lib/data";
import type { BusinessSettings, ServiceCategory } from "@/lib/types";

export function SiteFooter({ settings, categories }: { settings: BusinessSettings; categories: ServiceCategory[] }) {
  const whatsapp = whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, I need help choosing the right service.");

  return (
    <footer className="site-footer">
      <div className="container footer-cta">
        <div>
          <span>Not sure which service fits?</span>
          <h2>Send the task. We’ll guide you to the right next step.</h2>
        </div>
        <TrackedLink className="button button--light" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
          <MessageCircle size={18} /> Ask on WhatsApp <ArrowRight size={16} />
        </TrackedLink>
      </div>
      <div className="container footer-grid">
        <div className="footer-brand-column">
          <Logo inverse />
          <p className="footer-summary">A trusted local shop for printing, documents, biometric, online work, payments, tickets and everyday digital help.</p>
          <span className="footer-location"><MapPin size={15} /> Akhtar Colony, Karachi</span>
        </div>
        <div>
          <h2>Find a service</h2>
          <div className="footer-links footer-links--services">
            {categories.map((category) => <Link key={category.id} href={`/services/${category.slug}`}>{category.title}</Link>)}
          </div>
        </div>
        <div>
          <h2>Talk to us</h2>
          <div className="footer-links footer-links--contact">
            <TrackedLink href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click"><MessageCircle size={15} /> Ask on WhatsApp</TrackedLink>
            <TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click"><Phone size={15} /> Call {settings.phone_display}</TrackedLink>
            <TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click"><MapPin size={15} /> Visit the shop</TrackedLink>
            <Link href="/contact">Build a guided request</Link>
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
