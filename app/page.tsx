import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileCheck2,
  MapPin,
  MessageCircle,
  PackageCheck,
  Send,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { LocalBusinessSchema } from "@/components/local-business-schema";
import { ServiceIcon } from "@/components/service-icon";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackedLink } from "@/components/tracked-link";
import { getCurrentBusinessStatus, getSiteData, whatsappUrl } from "@/lib/data";

const shortCategoryTitles: Record<string, string> = {
  "printing-photos": "Print, Copy & Photos",
  "typing-online": "Typing, CV & Online Forms",
  documents: "Agreements & Documents",
  biometric: "Biometric & e-Sahulat",
  payments: "Payments & Transfer",
  tickets: "Tickets & Booking",
  retail: "Stationery & Accessories",
  laptop: "Laptop & Software Help",
};

export default async function HomePage() {
  const { settings, hours, categories, coverage, gallery, announcements } = await getSiteData();
  const whatsapp = whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, I need help with: ");
  const featuredImage = gallery.find((image) => image.is_featured);
  const imageUrl = featuredImage
    ? `https://kzikyufuyanfjlddyepo.supabase.co/storage/v1/object/public/shop-media/${featuredImage.storage_path}`
    : "/images/storefront-concept.svg";
  const schemaImageUrl = featuredImage?.media_kind === "real" ? imageUrl : "/brand/logo-horizontal.svg";
  const hoursText = getCurrentBusinessStatus(hours);

  return (
    <>
      <LocalBusinessSchema settings={settings} hours={hours} coverage={coverage} imageUrl={schemaImageUrl} />
      {announcements[0] && (
        <div className="announcement-bar">
          <div className="container">
            <strong>{announcements[0].title}</strong>
            <span>{announcements[0].message}</span>
          </div>
        </div>
      )}
      <SiteHeader settings={settings} statusText={hoursText} />
      <main id="main-content">
        <section className="hero hero--experience hero--final">
          <div className="hero-grid-pattern" aria-hidden="true" />
          <div className="container hero-grid hero-grid--experience">
            <div className="hero-copy hero-copy--experience">
              <div className="hero-kicker-row">
                <span className="live-status"><span aria-hidden="true" /> {hoursText}</span>
                <span className="hero-kicker-divider" aria-hidden="true" />
                <span><MapPin size={15} /> Akhtar Colony, Karachi</span>
              </div>
              <h1>
                Kaam bata dein.
                <span>Hum next step simple kar denge.</span>
              </h1>
              <p className="hero-lead">
                Printing, documents, biometric, online forms aur everyday digital help — Akhtar Colony mein.
                <span className="hero-local-line">File, photo ya requirement WhatsApp par bhejein. Hum documents, timing aur total charges pehle clear kar dete hain.</span>
              </p>
              <div className="hero-actions hero-actions--premium">
                <TrackedLink className="button button--primary button--hero" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
                  <MessageCircle size={19} /> WhatsApp par kaam bhejein <ArrowRight size={17} />
                </TrackedLink>
                <Link className="button button--secondary button--hero" href="#services">
                  Services dekhein <ArrowDown size={17} />
                </Link>
              </div>
              <p className="hero-cta-note"><CheckCircle2 size={16} /> Kaam shuru hone se pehle requirement aur charges confirm hote hain.</p>
              <div className="hero-trust hero-trust--cards">
                <span><Store size={19} /><span><strong>Real local shop</strong><small>Akhtar Colony</small></span></span>
                <span><Clock3 size={19} /><span><strong>Less waiting</strong><small>Send files first</small></span></span>
                <span><BadgeCheck size={19} /><span><strong>Charges first</strong><small>No surprises</small></span></span>
              </div>
            </div>

            <div className="hero-visual hero-visual--experience">
              <div className="hero-visual__glow" aria-hidden="true" />
              <div className="image-frame image-frame--hero">
                <Image
                  src={imageUrl}
                  alt={featuredImage?.alt_text || "Yaqoob Enterprises storefront"}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 46vw"
                  style={{ objectPosition: `${featuredImage?.focal_x || 50}% ${featuredImage?.focal_y || 50}%` }}
                />
                <span className="hero-image-label"><Store size={14} /> Yaqoob Enterprises</span>
                <div className="hero-photo-meta">
                  <span className="hero-photo-status"><span aria-hidden="true" /> {hoursText}</span>
                  <span><MapPin size={14} /> Akhtar Colony</span>
                </div>
              </div>
              <div className="hero-image-card">
                <span className="hero-image-card__icon"><MessageCircle size={22} /></span>
                <span><strong>Your neighbourhood service desk</strong><small>One clear message can save an extra trip.</small></span>
              </div>
              <div className="hero-service-orbit" aria-label="Popular service categories">
                {categories.slice(0, 3).map((category, index) => (
                  <span className={`hero-orbit hero-orbit--${index + 1}`} key={category.id}>
                    <ServiceIcon iconKey={category.icon_key} size={16} />
                    {shortCategoryTitles[category.slug] || category.title}
                  </span>
                ))}
              </div>
              {featuredImage?.media_kind !== "real" && <p className="concept-label">{settings.concept_image_notice}</p>}
            </div>
          </div>
          <a className="hero-scroll-cue" href="#services"><ArrowDown size={16} /> Find your service</a>
        </section>

        <section className="journey-strip journey-strip--final" aria-label="How the service works">
          <div className="container journey-grid">
            <article>
              <span className="journey-number">01</span>
              <Send />
              <div><strong>Send it</strong><span>File, photo ya service name bhejein.</span></div>
            </article>
            <article>
              <span className="journey-number">02</span>
              <FileCheck2 />
              <div><strong>We check it</strong><span>Requirements, timing aur charges clear hote hain.</span></div>
            </article>
            <article>
              <span className="journey-number">03</span>
              <PackageCheck />
              <div><strong>You choose</strong><span>Visit, pickup, delivery ya appointment — where available.</span></div>
            </article>
          </div>
        </section>

        <section className="section services-showcase" id="services">
          <div className="container">
            <div className="section-heading section-heading--split">
              <div>
                <span className="eyebrow">Find a service</span>
                <h2>Jo kaam chahiye, seedha choose karein.</h2>
              </div>
              <p>Category khol kar available options, requirements aur service method pehle dekh lein.</p>
            </div>
            <div className="category-grid category-grid--bento category-grid--final">
              {categories.map((category, index) => {
                const count = category.services?.length || 0;
                return (
                  <Link className="category-card category-card--final" key={category.id} href={`/services/${category.slug}`}>
                    <div className="category-card__topline">
                      <span className="category-card__number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="category-card__icon"><ServiceIcon iconKey={category.icon_key} /></span>
                    </div>
                    <h3>
                      <span className="category-title-full">{category.title}</span>
                      <span className="category-title-short">{shortCategoryTitles[category.slug] || category.title}</span>
                    </h3>
                    <p>{category.description}</p>
                    <span className="category-card__link">
                      <span className="category-card__count">{count} {count === 1 ? "option" : "options"}</span>
                      <span className="category-card__action"><span>View services</span><ArrowRight size={17} /></span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section experience-section">
          <div className="container split-grid split-grid--experience">
            <div className="experience-copy">
              <span className="eyebrow">Save an extra trip</span>
              <h2>Start from home. Visit only when the work needs you there.</h2>
              <p className="section-lead">A clear message first can save waiting, missing documents and a second visit.</p>
              <div className="feature-list feature-list--timeline">
                <div><span className="feature-step">01</span><Send /><span><strong>Send files first</strong>Share the document, photo, service name or product reference.</span></div>
                <div><span className="feature-step">02</span><FileCheck2 /><span><strong>Get a clear checklist</strong>Know what to bring, expected timing and the exact charges.</span></div>
                <div><span className="feature-step">03</span><Truck /><span><strong>Choose the right option</strong>Shop visit, pickup, delivery or home appointment — where applicable.</span></div>
                <div><span className="feature-step">04</span><ShieldCheck /><span><strong>Approve with confidence</strong>No work starts until the details and charges are agreed.</span></div>
              </div>
            </div>
            <div className="info-panel info-panel--premium">
              <span className="info-panel__spark" aria-hidden="true"><BadgeCheck size={24} /></span>
              <span className="eyebrow">Our promise</span>
              <h3>Clear details before we begin.</h3>
              <p>{settings.pricing_message}</p>
              <div className="promise-list">
                <span><CheckCircle2 size={17} /> Requirement checked first</span>
                <span><CheckCircle2 size={17} /> Total charges confirmed</span>
                <span><CheckCircle2 size={17} /> Best service option explained</span>
              </div>
              <TrackedLink className="button button--light" href={whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, please quote this requirement: ")} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
                Get an exact quotation <ArrowRight size={17} />
              </TrackedLink>
            </div>
          </div>
        </section>

        <section className="section section--dark coverage-section" id="coverage">
          <div className="coverage-orb coverage-orb--one" aria-hidden="true" />
          <div className="coverage-orb coverage-orb--two" aria-hidden="true" />
          <div className="container coverage-grid coverage-grid--premium">
            <div>
              <span className="eyebrow eyebrow--light">Delivery &amp; home visits</span>
              <h2>Need service at your location?</h2>
              <p>Area ya location pin bhejein. Hum pehle confirm karenge ke selected service wahan available hai ya nahi.</p>
              <TrackedLink className="button button--light" href={whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, please confirm coverage for my location: ")} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
                <MapPin size={17} /> Check my location
              </TrackedLink>
            </div>
            <div className="area-cloud area-cloud--premium">
              {coverage.map((area, index) => <span key={area.id}><small>{String(index + 1).padStart(2, "0")}</small>{area.name}</span>)}
            </div>
          </div>
        </section>

        <section className="section closing-section closing-section--final">
          <div className="container closing-cta">
            <div>
              <span className="eyebrow">Not sure what to choose?</span>
              <h2>Photo, file ya short message bhej dein. Hum guide kar denge.</h2>
              <p>Real help from a local shop — no confusing automated process.</p>
            </div>
            <div className="closing-cta__actions">
              <TrackedLink className="button button--primary button--hero" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click"><MessageCircle size={18} /> WhatsApp par poochhein <ArrowRight size={16} /></TrackedLink>
              <TrackedLink className="button button--secondary" href={`tel:${settings.phone_e164}`} eventName="call_click">Call the shop</TrackedLink>
              <Link className="text-link" href="/contact">Use guided request <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} categories={categories} />
    </>
  );
}
