import type { Metadata } from "next";
import { CheckCircle2, Clock3, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles } from "lucide-react";
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
        <section className="page-hero page-hero--contact">
          <div className="page-hero__pattern" aria-hidden="true" />
          <div className="container page-hero__grid page-hero__grid--contact">
            <div className="page-hero__content">
              <span className="eyebrow">Contact &amp; request</span>
              <h1>Prepare a clear request before you visit.</h1>
              <p>Choose the service, explain the requirement and send a structured WhatsApp message. The form only offers service modes that actually apply.</p>
              <div className="contact-assurance-pills">
                <span><CheckCircle2 size={16} /> Clear requirements</span>
                <span><CheckCircle2 size={16} /> Exact charges first</span>
                <span><CheckCircle2 size={16} /> Practical next step</span>
              </div>
            </div>
            <aside className="page-hero__summary page-hero__summary--contact">
              <span className="page-hero__summary-icon"><MessageCircle size={22} /></span>
              <strong>WhatsApp-first</strong>
              <span>Prepare the details once</span>
              <small>Your message opens in WhatsApp for review before you send it.</small>
            </aside>
          </div>
        </section>

        <section className="section contact-section">
          <div className="container contact-layout contact-layout--premium">
            <div className="contact-details-card contact-details-card--premium">
              <div className="contact-card-heading">
                <span className="contact-card-heading__icon"><Sparkles size={21} /></span>
                <div><span className="eyebrow eyebrow--light">Business details</span><h2>Contact with confidence.</h2></div>
              </div>
              <div className="contact-detail"><Phone /><div><strong>Phone &amp; WhatsApp</strong><TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click">{settings.phone_display}</TrackedLink></div></div>
              <div className="contact-detail"><MapPin /><div><strong>Address</strong><TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click">{settings.address}</TrackedLink></div></div>
              <div className="contact-detail"><Clock3 /><div><strong>Opening hours</strong>{hours.map((hour) => <span key={hour.id}>{hour.label}: {formatBusinessHours(hour)}</span>)}</div></div>
              <div className="contact-detail"><ShieldCheck /><div><strong>Before work starts</strong><span>Requirements, availability and charges are confirmed first.</span></div></div>
            </div>

            <div className="form-card form-card--premium">
              <div className="form-card__heading">
                <span className="eyebrow">Structured WhatsApp request</span>
                <h2>Tell us exactly what you need.</h2>
                <p>Complete the short form below. Nothing is submitted to a database—the final message opens in WhatsApp for your approval.</p>
              </div>
              <div className="contact-flow" aria-label="Request process">
                <span><small>01</small> Choose service</span>
                <span><small>02</small> Add details</span>
                <span><small>03</small> Review in WhatsApp</span>
              </div>
              <RequestForm categories={categories} whatsappNumber={settings.whatsapp_e164} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} categories={categories} />
    </>
  );
}
