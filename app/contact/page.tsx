import type { Metadata } from "next";
import { Clock3, MapPin, Phone, Store } from "lucide-react";
import { RequestForm } from "@/components/request-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackedLink } from "@/components/tracked-link";
import { businessLocationLabel } from "@/lib/business-display";
import { formatBusinessHours, getCurrentBusinessStatus, getSiteData } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const location = businessLocationLabel(settings.address);
  const description = `Contact ${settings.business_name} by WhatsApp, phone or in person in ${location}.`;
  const socialTitle = `Contact & Service Request | ${settings.business_name}`;

  return {
    title: "Contact & Service Request",
    description,
    alternates: { canonical: "/contact" },
    openGraph: {
      type: "website",
      locale: "en_PK",
      siteName: settings.business_name,
      url: "/contact",
      title: socialTitle,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `Contact ${settings.business_name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function ContactPage() {
  const { settings, hours, categories } = await getSiteData();
  const statusText = getCurrentBusinessStatus(hours);
  const isOpen = statusText.startsWith("Open now");
  const statusDetail = isOpen ? statusText.replace("Open now · ", "") : statusText;

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
              <div className="contact-detail contact-detail--status"><Clock3 /><div><strong>{isOpen ? "Open now" : "Current status"}</strong><span>{statusDetail}</span></div></div>
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
              <RequestForm
                categories={categories}
                whatsappNumber={settings.whatsapp_e164}
                businessName={settings.business_name}
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} categories={categories} />
    </>
  );
}
