import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { HomeContactFormClient } from "@/components/home-contact-form-client";
import { LocalBusinessSchema } from "@/components/local-business-schema";
import { ServiceShowcase } from "@/components/service-showcase";
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

              <h1>
                Everyday services.
                <span>Handled simply.</span>
              </h1>

              <p className={styles.lead}>
                Printing, documents, biometric services, online forms and everyday digital help from one local shop in Akhtar Colony.
              </p>

              <div className={styles.actions}>
                <TrackedLink
                  className={styles.primaryButton}
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="whatsapp_click"
                >
                  <MessageCircle size={18} /> Send on WhatsApp <ArrowRight size={17} />
                </TrackedLink>
                <Link className={styles.secondaryButton} href="#services">
                  Browse services <ArrowDown size={17} />
                </Link>
              </div>

              <div className={styles.heroNote} aria-label="Service highlights">
                <span>Send files first</span>
                <span>Clear next step</span>
                <span>Charges confirmed before work</span>
              </div>
            </div>

            <div className={styles.visual}>
              <div className={styles.imageShell}>
                <Image
                  src={imageUrl}
                  alt={featuredImage?.alt_text || "Yaqoob Enterprises"}
                  fill
                  priority
                  sizes="(max-width: 992px) 100vw, 44vw"
                  style={featuredImage
                    ? { objectPosition: `${featuredImage.focal_x || 50}% ${featuredImage.focal_y || 50}%` }
                    : { objectFit: "contain", padding: "18%" }}
                />
                <div className={styles.imageMeta}>
                  <div>
                    <strong>Yaqoob Enterprises</strong>
                    <span><MapPin size={13} /> Akhtar Colony</span>
                  </div>
                  <span>{hoursText}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.servicesWrap}>
          <ServiceShowcase categories={categories} />
        </div>

        <section className={styles.contactSection} id="get-in-touch">
          <div className={`container ${styles.contactShell}`}>
            <div className={styles.contactCopy}>
              <span className={styles.eyebrow}>Get in touch</span>
              <h2>Tell us what you need.</h2>
              <p>
                Choose a service and add a short note. We’ll turn it into a clear WhatsApp request so you can continue directly with the shop.
              </p>
            </div>

            <div className={styles.formPanel}>
              <HomeContactFormClient categories={contactCategories} whatsappNumber={settings.whatsapp_e164} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
