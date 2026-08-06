import Link from "next/link";
import { Logo } from "@/components/logo";
import { TrackedLink } from "@/components/tracked-link";
import type { BusinessSettings, ServiceCategory } from "@/lib/types";

export function SiteFooter({ settings, categories }: { settings: BusinessSettings; categories: ServiceCategory[] }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p className="footer-summary">One local service centre for printing, documentation, biometric, payments, tickets, online work and everyday supplies.</p>
        </div>
        <div>
          <h2>Services</h2>
          <div className="footer-links">
            {categories.slice(0, 6).map((category) => <Link key={category.id} href={`/services/${category.slug}`}>{category.title}</Link>)}
          </div>
        </div>
        <div>
          <h2>Contact</h2>
          <div className="footer-links">
            <TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click">{settings.phone_display}</TrackedLink>
            <TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click">Get directions</TrackedLink>
            <Link href="/privacy">Privacy</Link>
            <Link href="/admin/login">Admin</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Yaqoob Enterprises.</span>
        <span>Akhtar Colony, Karachi</span>
      </div>
    </footer>
  );
}
