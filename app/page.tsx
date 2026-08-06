import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileCheck2,
  HomeIcon,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
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
                Printing, documents, biometric &amp; online services—
                <span>handled clearly.</span>
              </h1>
              <p className="hero-lead">
                Send the requirement first. We confirm what to bring, exact charges and the most practical service mode before any work starts.
              </p>
              <div className="hero-actions hero-actions--premium">
                <TrackedLink className="button button--primary button--hero" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
                  <MessageCircle size={19} /> Start on WhatsApp <ArrowRight size={17} />
                </TrackedLink>
                <TrackedLink className="button button--secondary button--hero" href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click">
                  <MapPin size={18} /> Get directions
                </TrackedLink>
              </div>
              <p className="hero-cta-note"><CheckCircle2 size={16} /> Requirements and charges are confirmed before work begins.</p>
              <div className="hero-trust hero-trust--cards">
                <span><Store size={19} /><span><strong>Local service centre</strong><small>Real shop in Akhtar Colony</small></span></span>
                <span><Truck size={19} /><span><strong>Flexible fulfilment</strong><small>Shop, pickup, delivery or visit</small></span></span>
                <span><ShieldCheck size={19} /><span><strong>Clear confirmation</strong><small>No vague pricing or promises</small></span></span>
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
                <span className="hero-image-label"><Sparkles size={14} /> Yaqoob Enterprises</span>
              </div>
              <div className="hero-image-card">
                <span className="hero-image-card__icon"><BadgeCheck size={22} /></span>
                <span><strong>One reliable local centre</strong><small>Everyday services with a clear next step.</small></span>
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
          <a className="hero-scroll-cue" href="#services"><ArrowDown size={16} /> Explore services</a>
        </section>

        <section className="journey-strip" aria-label="How the service works">
          <div className="container journey-grid">
            <article>
              <span className="journey-number">01</span>
              <Send />
              <div><strong>Send the requirement</strong><span>Files, service details or a product reference.</span></div>
            </article>
            <article>
              <span className="journey-number">02</span>
              <FileCheck2 />
              <div><strong>Receive a clear confirmation</strong><span>Documents, availability, timing and exact charges.</span></div>
            </article>
            <article>
              <span className="journey-number">03</span>
              <PackageCheck />
              <div><strong>Choose the practical option</strong><span>Shop visit, pickup, delivery or appointment.</span></div>
            </article>
          </div>
        </section>

        <section className="section services-showcase" id="services">
          <div className="container">
            <div className="section-heading section-heading--split">
              <div>
                <span className="eyebrow">Services</span>
                <h2>Eight useful categories. One clear experience.</h2>
              </div>
              <p>Open a category to see what is available, what to provide and which service modes apply—before you travel or send documents.</p>
            </div>
            <div className="category-grid category-grid--bento">
              {categories.map((category, index) => (
                <Link className={`category-card category-card--${index < 2 ? "wide" : "standard"}`} key={category.id} href={`/services/${category.slug}`}>
                  <div className="category-card__topline">
                    <span className="category-card__number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="category-card__icon"><ServiceIcon iconKey={category.icon_key} /></span>
                  </div>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <span className="category-card__link">
                    <span>{category.services?.length || 0} services</span>
                    <span className="category-card__arrow"><ArrowRight size={17} /></span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section experience-section">
          <div className="container split-grid split-grid--experience">
            <div className="experience-copy">
              <span className="eyebrow">Built around convenience</span>
              <h2>Start from home. Visit only when the work actually requires it.</h2>
              <p className="section-lead">The service mode depends on the task—not on a vague promise that everything can be delivered.</p>
              <div className="feature-list feature-list--timeline">
                <div><span className="feature-step">01</span><Send /><span><strong>WhatsApp preparation</strong>Send print files, document content, travel details or product references.</span></div>
                <div><span className="feature-step">02</span><HomeIcon /><span><strong>Doorstep appointment</strong>Available for eligible biometric services in covered areas.</span></div>
                <div><span className="feature-step">03</span><Truck /><span><strong>Pickup or delivery</strong>Available for eligible printing, documents and in-stock products.</span></div>
                <div><span className="feature-step">04</span><BadgeCheck /><span><strong>Customer approval</strong>No work starts until requirements and charges are confirmed.</span></div>
              </div>
            </div>
            <div className="info-panel info-panel--premium">
              <span className="info-panel__spark" aria-hidden="true"><Sparkles size={24} /></span>
              <span className="eyebrow">Our service promise</span>
              <h3>Clear quotation before work begins.</h3>
              <p>{settings.pricing_message}</p>
              <div className="promise-list">
                <span><CheckCircle2 size={17} /> Requirement checked first</span>
                <span><CheckCircle2 size={17} /> Exact charges confirmed</span>
                <span><CheckCircle2 size={17} /> Practical service mode suggested</span>
              </div>
              <TrackedLink className="button button--light" href={whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, please quote this requirement: ")} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
                Request exact quotation <ArrowRight size={17} />
              </TrackedLink>
            </div>
          </div>
        </section>

        <section className="section section--dark coverage-section" id="coverage">
          <div className="coverage-orb coverage-orb--one" aria-hidden="true" />
          <div className="coverage-orb coverage-orb--two" aria-hidden="true" />
          <div className="container coverage-grid coverage-grid--premium">
            <div>
              <span className="eyebrow eyebrow--light">Coverage</span>
              <h2>Serving selected Karachi South areas.</h2>
              <p>Delivery and doorstep eligibility varies by service, timing and exact pin. Share your location before relying on coverage.</p>
              <TrackedLink className="button button--light" href={whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, please confirm coverage for my location:")} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
                <MapPin size={17} /> Confirm my location
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
              <span className="eyebrow">Ready when you are</span>
              <h2>Tell us the task. We will tell you the clearest next step.</h2>
              <p>{settings.address}</p>
            </div>
            <div className="closing-cta__actions">
              <TrackedLink className="button button--primary button--hero" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click"><MessageCircle size={18} /> WhatsApp us</TrackedLink>
              <TrackedLink className="button button--secondary" href={`tel:${settings.phone_e164}`} eventName="call_click"><Phone size={18} /> {settings.phone_display}</TrackedLink>
              <Link className="text-link" href="/contact">Prepare a detailed request <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} categories={categories} />
    </>
  );
}
