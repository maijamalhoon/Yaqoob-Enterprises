import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin, MessageCircle, Phone } from "lucide-react";
import { HomeContactFormClient } from "@/components/home-contact-form-client";
import { LocalBusinessSchema } from "@/components/local-business-schema";
import { ServiceShowcase } from "@/components/service-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackedLink } from "@/components/tracked-link";
import { getCurrentBusinessStatus, getSiteData, whatsappUrl } from "@/lib/data";
import styles from "./home.module.css";

const heroServices = ["Printing", "Documents", "Online forms", "Payments", "Tickets", "Biometric"];

export default async function HomePage() {
  const { settings, hours, categories, coverage, gallery } = await getSiteData();
  const whatsapp = whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, I need help with: ");
  const featuredImage = gallery.find((image) => image.is_featured && image.media_kind === "real");
  const imageUrl = featuredImage
    ? `https://kzikyufuyanfjlddyepo.supabase.co/storage/v1/object/public/shop-media/${featuredImage.storage_path}`
    : "/brand/logo-horizontal.svg";
  const schemaImageUrl = featuredImage ? imageUrl : "/brand/logo-horizontal.svg";
  const hoursText = getCurrentBusinessStatus(hours);
  const contactCategories = categories.map(({ id, slug, title }) => ({ id, slug, title }));

  return (
    <div className={styles.page}>
      <LocalBusinessSchema settings={settings} hours={hours} coverage={coverage} imageUrl={schemaImageUrl} />
      <SiteHeader settings={settings} statusText={hoursText} showMobileQuickActions={false} />

      <main id="main-content">
        <section className={`${styles.hero} home-hero`}>
          <div className={`container home-hero-grid ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <div className={styles.kicker}>
                <span className={styles.statusDot} aria-hidden="true" />
                <span>{hoursText}</span>
                <span className={styles.kickerDivider} aria-hidden="true" />
                <span><MapPin size={14} /> Akhtar Colony, Karachi</span>
              </div>

              <div
                className="home-hero-service-line"
                aria-label="Local help for printing, documents, online forms, payments, tickets and biometric services"
              >
                <span className="home-hero-service-label">Local help for</span>
                <span className="home-hero-service-viewport" aria-hidden="true">
                  <span className="home-hero-service-track">
                    {heroServices.map((service) => <span key={service}>{service}</span>)}
                    <span>{heroServices[0]}</span>
                  </span>
                </span>
              </div>

              <h1>
                <span>Everything you need,</span>
                <span>handled locally.</span>
              </h1>

              <p className={styles.lead}>
                Check requirements, availability and charges before you visit.
              </p>

              <div className={styles.actions}>
                <TrackedLink
                  className={styles.primaryButton}
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="whatsapp_click"
                >
                  <MessageCircle size={18} /> Send your requirement <ArrowRight size={17} />
                </TrackedLink>
                <Link className={styles.secondaryButton} href="#services">
                  Browse services
                </Link>
              </div>
            </div>

            <div className={`${styles.visual} home-hero-visual`}>
              <div className={`${styles.imageShell} home-hero-image`}>
                <Image
                  src={imageUrl}
                  alt={featuredImage?.alt_text || "Yaqoob Enterprises"}
                  fill
                  priority
                  sizes="(max-width: 1088px) calc(100vw - 24px), 42vw"
                  style={featuredImage
                    ? { objectPosition: `${featuredImage.focal_x || 50}% ${featuredImage.focal_y || 50}%` }
                    : { objectFit: "contain", padding: "18%" }}
                />
              </div>
            </div>
          </div>
        </section>

        <div className={styles.servicesWrap}>
          <ServiceShowcase categories={categories} />
        </div>

        <section className={`${styles.trustSection} home-how-it-works`} aria-labelledby="why-us-title">
          <div className="container">
            <div className={styles.sectionIntro}>
              <span>How it works</span>
              <h2 id="why-us-title">Know the next step before you travel.</h2>
            </div>
            <div className={`${styles.trustGrid} home-how-grid`}>
              <div><Check size={18} /><strong>Send the requirement</strong><p>Tell us the service, quantity, deadline or any detail that matters.</p></div>
              <div><Check size={18} /><strong>Get a clear confirmation</strong><p>We confirm what is required, current availability, expected timing and charges.</p></div>
              <div><Check size={18} /><strong>Use the right service option</strong><p>Visit the shop, collect, request delivery or arrange an appointment where supported.</p></div>
            </div>
          </div>
        </section>

        <section className={`${styles.contactSection} home-contact-section`} id="get-in-touch">
          <div className={`container home-contact-shell ${styles.contactShell}`}>
            <div className={styles.contactCopy}>
              <span className={styles.eyebrow}>Quick request</span>
              <h2>Tell us what you need.</h2>
              <p>Choose a service, add a short note, then review the prepared message in WhatsApp before sending.</p>
              <Link href="/contact" className={styles.textLink}>Need more guidance? Use the guided request <ArrowRight size={15} /></Link>
            </div>
            <div className={styles.formPanel}>
              <HomeContactFormClient categories={contactCategories} whatsappNumber={settings.whatsapp_e164} />
            </div>
          </div>
        </section>

        <section className={`${styles.visitSection} home-visit-section`} id="visit">
          <div className={`container home-visit-grid ${styles.visitGrid}`}>
            <div>
              <span className={styles.eyebrow}>Visit the shop</span>
              <h2>Akhtar Colony, Karachi.</h2>
              <p>{settings.address}</p>
              <span className={styles.statusLine}><span className={styles.statusDot} aria-hidden="true" /> {hoursText}</span>
            </div>
            <div className={styles.visitActions}>
              <TrackedLink href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click"><MapPin size={17} /> Directions</TrackedLink>
              <TrackedLink href={`tel:${settings.phone_e164}`} eventName="call_click"><Phone size={17} /> {settings.phone_display}</TrackedLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter settings={settings} categories={categories} />
    </div>
  );
}
