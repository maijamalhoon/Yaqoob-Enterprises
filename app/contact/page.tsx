import type { Metadata } from "next";
import { CheckCircle2, Clock3, MapPin, MessageCircle, Phone, ShieldCheck, Store } from "lucide-react";
import { RequestForm } from "@/components/request-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackedLink } from "@/components/tracked-link";
import { formatBusinessHours, getCurrentBusinessStatus, getSiteData } from "@/lib/data";

const description = "Contact Yaqoob Enterprises by WhatsApp, phone or in person in Akhtar Colony, Karachi.";

export const metadata: Metadata = {
  title: "Contact & Service Request",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "Yaqoob Enterprises",
    url: "/contact",
    title: "Contact & Service Request | Yaqoob Enterprises",
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Contact Yaqoob Enterprises" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Service Request | Yaqoob Enterprises",
    description,
    images: ["/opengraph-image"],
  },
};

export default async function ContactPage() {
  const { settings, hours, categories } = await getSiteData();
  const statusText = getCurrentBusinessStatus(hours);

  return (
    <>
      <SiteHeader settings={settings} statusText={statusText} />
      <main id="main-content">
        <section className="page-hero page-hero--contact">
          <div className="page-hero__pattern" aria-hidden="true" />
          <div className="container page-hero__grid page-hero__grid--contact">
            <div className="page-hero__content">
              <span className="eyebrow">Send a clear request</span>
              <h1>Ek clear message. Behtar aur faster answer.</h1>
              <p>Service choose karein aur useful details add karein. WhatsApp mein ready-to-read message khulega, phir aap review karke send karenge.</p>
              <div className="contact-assurance-pills">
                <span><CheckCircle2 size={16} /> Faster reply</span>
                <span><CheckCircle2 size={16} /> Correct requirements</span>
                <span><CheckCircle2 size={16} /> Charges confirmed</span>
              </div>
            </div>
            <aside className="page-hero__summary page-hero__summary--contact">
              <span className="page-hero__summary-icon"><ShieldCheck size={22} /></span>
              <strong>You stay in control</strong>
              <span>Review before sending</span>
              <small>Nothing is submitted until WhatsApp opens and you press Send.</small>
            </aside>
          </div>
        </section>

        <section className="section contact-section">
          <div className="container contact-layout contact-layout--premium">
            <div className="contact-details-card contact-details-card--premium">
              <div className="contact-card-heading">
                <span className="contact-card-heading__icon"><Store size={21} /></span>
                <div><span className="eyebrow eyebrow--light">Real local support</span><h2>Talk to a real shop.</h2></div>
              </div>
              <div className="contact-detail"><Clock3 /><div><strong>Right now</strong><span>{statusText}</span></div></div>
              <div className="contact-detail"><Phone /><div><strong>Call or WhatsApp</strong><TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click">{settings.phone_display}</TrackedLink></div></div>
              <div className="contact-detail"><MapPin /><div><strong>Visit the shop</strong><TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click">{settings.address}</TrackedLink></div></div>
              <div className="contact-detail"><Clock3 /><div><strong>Opening hours</strong>{hours.map((hour) => <span key={hour.id}>{hour.label}: {formatBusinessHours(hour)}</span>)}</div></div>
              <div className="contact-detail"><ShieldCheck /><div><strong>Before work begins</strong><span>We confirm the requirement, expected time and total charges first.</span></div></div>
            </div>

            <div className="form-card form-card--premium">
              <div className="form-card__heading">
                <span className="eyebrow">Guided WhatsApp request</span>
                <h2>Apna message about a minute mein ready karein.</h2>
                <p>The form creates a clear message on your device. It does not upload your details or send anything automatically.</p>
              </div>
              <div className="contact-flow" aria-label="Request process">
                <span><small>01</small> Choose</span>
                <span><small>02</small> Describe</span>
                <span><small>03</small> Review &amp; send</span>
              </div>
              <RequestForm categories={categories} whatsappNumber={settings.whatsapp_e164} />
              <p className="contact-human-note"><MessageCircle size={16} /> Exact service ka naam nahi pata? “I’m not sure — please guide me” choose karein aur task apne words mein describe kar dein.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} categories={categories} />
    </>
  );
}
