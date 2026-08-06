import type { Metadata } from "next";
import { Clock3, MapPin, Phone, ShieldCheck } from "lucide-react";
import { RequestForm } from "@/components/request-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackedLink } from "@/components/tracked-link";
import { formatBusinessHours, getSiteData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact & Service Request",
  description: "Contact Yaqoob Enterprises by WhatsApp, phone or in person in Akhtar Colony, Karachi.",
};

export default async function ContactPage() {
  const { settings, hours, categories } = await getSiteData();

  return (
    <>
      <SiteHeader settings={settings} />
      <main id="main-content">
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow">Contact</span>
            <h1>Prepare a clear service request.</h1>
            <p>Choose the service first. The form will only show delivery modes that make sense for that service.</p>
          </div>
        </section>
        <section className="section">
          <div className="container contact-layout">
            <div className="contact-details-card">
              <h2>Business details</h2>
              <div className="contact-detail"><Phone /><div><strong>Phone & WhatsApp</strong><TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click">{settings.phone_display}</TrackedLink></div></div>
              <div className="contact-detail"><MapPin /><div><strong>Address</strong><TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click">{settings.address}</TrackedLink></div></div>
              <div className="contact-detail"><Clock3 /><div><strong>Opening hours</strong>{hours.map((hour) => <span key={hour.id}>{hour.label}: {formatBusinessHours(hour)}</span>)}</div></div>
              <div className="contact-detail"><ShieldCheck /><div><strong>Before work starts</strong><span>Requirements, availability and charges are confirmed first.</span></div></div>
            </div>
            <div className="form-card">
              <span className="eyebrow">WhatsApp request</span>
              <h2>Tell us what you need</h2>
              <RequestForm categories={categories} whatsappNumber={settings.whatsapp_e164} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} categories={categories} />
    </>
  );
}
