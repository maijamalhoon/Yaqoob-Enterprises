import type { Metadata } from "next";
import { Clock3, MapPin, Phone, Store } from "lucide-react";
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
          <div className="container page-hero__grid page-hero__grid--contact">
            <div className="page-hero__content">
              <span className="eyebrow">Guided request</span>
              <h1>Tell us what you need.</h1>
            </div>
          </div>
        </section>

        <section className="section contact-section">
          <div className="container contact-layout contact-layout--premium">
            <div className="contact-details-card contact-details-card--premium">
              <div className="contact-card-heading">
                <span className="contact-card-heading__icon"><Store size={21} /></span>
                <h2>Shop details</h2>
              </div>
              <div className="contact-detail contact-detail--status"><Clock3 /><div><strong>Open now</strong><span>{statusText.replace("Open now · ", "")}</span></div></div>
              <div className="contact-detail contact-detail--phone"><Phone /><div><strong>Call or WhatsApp</strong><TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click">{settings.phone_display}</TrackedLink></div></div>
              <div className="contact-detail contact-detail--address"><MapPin /><div><strong>Visit the shop</strong><TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click">{settings.address}</TrackedLink></div></div>
              <div className="contact-detail contact-detail--schedule">
                <Clock3 />
                <div>
                  <strong>Opening hours</strong>
                  <details className="contact-hours-disclosure" style={{ display: "block" }}>
                    <summary>Weekly schedule</summary>
                    <div className="contact-hours">
                      {hours.map((hour) => (
                        <div className="contact-hours__row" key={hour.id}>
                          <span>{hour.label}</span>
                          <span>{formatBusinessHours(hour)}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div className="form-card form-card--premium">
              <div className="form-card__heading">
                <h2>Build your request</h2>
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
