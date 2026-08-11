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
        <section className={styles.hero}>
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <div className={styles.kicker}>
                <span className={styles.statusDot} aria-hidden="true" />
                <span>{hoursText}</span>
                <span className={styles.kickerDivider} aria-hidden="true" />
                <span><MapPin size={14} /> Akhtar Colony, Karachi</span>
              </div>

              <h1>Printing, documents &amp; digital services.</h1>

              <p className={styles.lead}>
                Send your requirement before you visit. We’ll confirm what you need, current availability and charges before work starts.
              </p>

              <div className={styles.actions}>
                <TrackedLink
                  className={styles.primaryButton}
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="whatsapp_click"
                >
                  <MessageCircle size={18} /> WhatsApp us <ArrowRight size={17} />
                </TrackedLink>
                <Link className={styles.secondaryButton} href="#services">
                  View services
                </Link>
              </div>

              <div className={styles.heroNote} aria-label="Service highlights">
                <span>Requirements confirmed first</span>
                <span>Clear pricing before work</span>
                <span>Local help in Akhtar Colony</span>
              </div>
            </div>

            <div className={styles.visual}>
              <div className={styles.imageShell}>
                <Image
                  src={imageUrl}
                  alt={featuredImage?.alt_text || "Yaqoob Enterprises"}
                  fill
                  priority
                  sizes="(max-width: 992px) 100vw, 42vw"
                  style={featuredImage
                    ? { objectPosition: `${featuredImage.focal_x || 50}% ${featuredImage.focal_y || 50}%` }
                    : { objectFit: "contain", padding: "18%" }}
                />
              </div>
              <div className={styles.imageCaption}>
                <span>Yaqoob Enterprises</span>
                <span><MapPin size={13} /> Akhtar Colony</span>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.servicesWrap}>
          <ServiceShowcase categories={categories} />
        </div>

        <section className={styles.trustSection} aria-labelledby="why-us-title">
          <div className="container">
            <div className={styles.sectionIntro}>
              <span>Simple process</span>
              <h2 id="why-us-title">Know the next step before you travel.</h2>
            </div>
            <div className={styles.trustGrid}>
              <div><Check size={18} /><strong>Confirm requirements</strong><p>See what to bring or send before visiting.</p></div>
              <div><Check size={18} /><strong>Confirm availability</strong><p>Official-system and appointment-dependent work is checked first.</p></div>
              <div><Check size={18} /><strong>Confirm charges</strong><p>We confirm the quotation before work begins.</p></div>
            </div>
          </div>
        </section>

        <section className={styles.contactSection} id="get-in-touch">
          <div className={`container ${styles.contactShell}`}>
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

        <section className={styles.visitSection} id="visit">
          <div className={`container ${styles.visitGrid}`}>
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
