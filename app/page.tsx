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
  Phone,
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
      <SiteHeader settings={settings} />
      <main id="main-content">
        <section className="hero hero--experience">
          <div className="hero-grid-pattern" aria-hidden="true" />
          <div className="container hero-grid hero-grid--experience">
            <div className="hero-copy hero-copy--experience">
              <div className="hero-kicker-row">
                <span className="live-status"><span aria-hidden="true" /> {hoursText}</span>
                <span className="hero-kicker-divider" aria-hidden="true" />
                <span><MapPin size={15} /> Akhtar Colony, Karachi</span>
              </div>
              <h1>
                Tell us the task.
                <span>We’ll make the next step simple.</span>
              </h1>
              <p className="hero-lead">
                Printing, documents, biometric, online applications and everyday digital services—from one trusted local shop.
                <span className="hero-local-line">Aap requirement bhejein; hum documents, timing aur total charges pehle clear kar dete hain.</span>
              </p>
              <div className="hero-actions hero-actions--premium">
                <TrackedLink className="button button--primary button--hero" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
                  <MessageCircle size={19} /> Send requirement on WhatsApp <ArrowRight size={17} />
                </TrackedLink>
                <TrackedLink className="button button--secondary button--hero" href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click">
                  <MapPin size={18} /> Visit the shop
                </TrackedLink>
              </div>
              <p className="hero-cta-note"><CheckCircle2 size={16} /> Nothing starts until you approve the requirement and charges.</p>
              <div className="hero-trust hero-trust--cards">
                <span><Store size={19} /><span><strong>Real local shop</strong><small>Visit us in Akhtar Colony</small></span></span>
                <span><Clock3 size={19} /><span><strong>Less waiting</strong><small>Send files before you come</small></span></span>
                <span><BadgeCheck size={19} /><span><strong>No surprises</strong><small>Charges confirmed first</small></span></span>
              </div>
            </div>

            <div className="hero-visual hero-visual--experience">
              <div className="hero-visual__glow" aria-hidden="true" />
              <div className="image-frame image-frame--hero">
                <Image
                  src={imageUrl}
                  alt={featuredImage?.alt_text || "Concept preview of the Yaqoob Enterprises storefront"}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 48vw"
                  style={{ objectPosition: `${featuredImage?.focal_x || 50}% ${featuredImage?.focal_y || 50}%` }}
                />
                <span className="hero-image-label"><Store size={14} /> Yaqoob Enterprises</span>
              </div>
              <div className="hero-image-card">
                <span className="hero-image-card__icon"><MessageCircle size={22} /></span>
                <span><strong>Your neighbourhood service desk</strong><small>One message can save an extra trip.</small></span>
              </div>
              <div className="hero-service-orbit" aria-label="Popular service categories">
                {categories.slice(0, 3).map((category, index) => (
                  <span className={`hero-orbit hero-orbit--${index + 1}`} key={category.id}>
                    <ServiceIcon iconKey={category.icon_key} size={16} />
                    {category.title}
                  </span>
                ))}
              </div>
              {featuredImage?.media_kind !== "real" && <p className="concept-label">{settings.concept_image_notice}</p>}
            </div>
          </div>
          <a className="hero-scroll-cue" href="#services"><ArrowDown size={16} /> Find your service</a>
        </section>

        <section className="journey-strip" aria-label="How the service works">
          <div className="container journey-grid">
            <article>
              <span className="journey-number">01</span>
              <Send />
              <div><strong>Share it</strong><span>Send the file, photo or service name.</span></div>
            </article>
            <article>
              <span className="journey-number">02</span>
              <FileCheck2 />
              <div><strong>We check it</strong><span>Get requirements, timing and exact charges.</span></div>
            </article>
            <article>
              <span className="journey-number">03</span>
              <PackageCheck />
              <div><strong>You choose</strong><span>Visit, pickup, delivery or appointment—where available.</span></div>
            </article>
          </div>
        </section>

        <section className="section services-showcase" id="services">
          <div className="container">
            <div className="section-heading section-heading--split">
              <div>
                <span className="eyebrow">Find a service</span>
                <h2>Understand your options in seconds.</h2>
              </div>
              <p>Choose a category to see what is available, what to bring and how the work can be completed—before you travel.</p>
            </div>
            <div className="category-grid category-grid--bento">
              {categories.map((category, index) => {
                const count = category.services?.length || 0;
                return (
                  <Link className={`category-card category-card--${index < 2 ? "wide" : "standard"}`} key={category.id} href={`/services/${category.slug}`}>
                    <div className="category-card__topline">
                      <span className="category-card__number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="category-card__icon"><ServiceIcon iconKey={category.icon_key} /></span>
                    </div>
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                    <span className="category-card__link">
                      <span className="category-card__count">{count} {count === 1 ? "option" : "options"}</span>
                      <span className="category-card__action">View services <ArrowRight size={17} /></span>
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
                <div><span className="feature-step">03</span><Truck /><span><strong>Choose the right option</strong>Shop visit, pickup, delivery or home appointment—where applicable.</span></div>
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
              <p>Share your area or location pin. We will confirm whether the selected service is available there before you depend on it.</p>
              <TrackedLink className="button button--light" href={whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, please confirm coverage for my location: ")} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
                <MapPin size={17} /> Check my location on WhatsApp
              </TrackedLink>
            </div>
            <div className="area-cloud area-cloud--premium">
              {coverage.map((area, index) => <span key={area.id}><small>{String(index + 1).padStart(2, "0")}</small>{area.name}</span>)}
            </div>
          </div>
        </section>

        <section className="section closing-section">
          <div className="container closing-cta">
            <div>
              <span className="eyebrow">Not sure what to choose?</span>
              <h2>Send a photo, file or short message. We’ll guide you.</h2>
              <p>Real help from a local shop—not a confusing automated process.</p>
            </div>
            <div className="closing-cta__actions">
              <TrackedLink className="button button--primary button--hero" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click"><MessageCircle size={18} /> Ask on WhatsApp <ArrowRight size={16} /></TrackedLink>
              <TrackedLink className="button button--secondary" href={`tel:${settings.phone_e164}`} eventName="call_click"><Phone size={18} /> Call the shop</TrackedLink>
              <Link className="text-link" href="/contact">Use the guided request form <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} categories={categories} />
    </>
  );
}
