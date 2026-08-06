import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  FileCheck2,
  HomeIcon,
  MapPin,
  PackageCheck,
  Phone,
  Send,
  ShieldCheck,
  Truck,
} from "lucide-react";
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
  const hoursText = getCurrentBusinessStatus(hours);

  return (
    <>
      {announcements[0] && (
        <div className="announcement-bar">
          <div className="container"><strong>{announcements[0].title}</strong><span>{announcements[0].message}</span></div>
        </div>
      )}
      <SiteHeader settings={settings} />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow"><MapPin size={15} /> Akhtar Colony, Karachi</span>
              <h1>Everyday services, handled with less waiting.</h1>
              <p className="hero-lead">
                Send documents, service details or product requirements on WhatsApp. We prepare what we can before your visit and confirm pickup, delivery or doorstep options clearly.
              </p>
              <div className="hero-actions">
                <TrackedLink className="button button--primary" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click"><Send size={18} /> Start on WhatsApp</TrackedLink>
                <TrackedLink className="button button--secondary" href={settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click"><MapPin size={18} /> Get directions</TrackedLink>
              </div>
              <div className="hero-trust">
                <span><Clock3 size={17} /> {hoursText}</span>
                <span><Truck size={17} /> Selected Karachi South delivery</span>
                <span><ShieldCheck size={17} /> Charges confirmed first</span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="image-frame">
                <Image
                  src={imageUrl}
                  alt={featuredImage?.alt_text || "Concept preview of the Yaqoob Enterprises storefront"}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 48vw"
                  style={{ objectPosition: `${featuredImage?.focal_x || 50}% ${featuredImage?.focal_y || 50}%` }}
                />
              </div>
              <p className="concept-label">{featuredImage?.media_kind === "real" ? featuredImage.caption : settings.concept_image_notice}</p>
            </div>
          </div>
        </section>

        <section className="quick-strip">
          <div className="container quick-grid">
            <article><Send /><div><strong>Send first</strong><span>Files and requirements on WhatsApp</span></div></article>
            <article><FileCheck2 /><div><strong>Confirm clearly</strong><span>Requirements, availability and charges</span></div></article>
            <article><PackageCheck /><div><strong>Choose delivery mode</strong><span>Shop, pickup, delivery or appointment</span></div></article>
          </div>
        </section>

        <section className="section section--soft" id="services">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Services</span>
              <h2>One local centre. Eight practical service categories.</h2>
              <p>Each category shows exactly what is available, what to bring and whether delivery or a doorstep appointment can be requested.</p>
            </div>
            <div className="category-grid">
              {categories.map((category) => (
                <Link className="category-card" key={category.id} href={`/services/${category.slug}`}>
                  <span className="category-card__icon"><ServiceIcon iconKey={category.icon_key} /></span>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <span className="category-card__link">View {category.services?.length || 0} services <ArrowRight size={16} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container split-grid">
            <div>
              <span className="eyebrow">Flexible service</span>
              <h2>Start from home. Visit only when needed.</h2>
              <p className="section-lead">The service mode depends on the work—not on a vague promise that everything can be delivered.</p>
              <div className="feature-list">
                <div><Send /><span><strong>WhatsApp preparation</strong>Send print files, document content, travel details or product references.</span></div>
                <div><HomeIcon /><span><strong>Doorstep appointment</strong>Available for eligible biometric services in covered areas.</span></div>
                <div><Truck /><span><strong>Delivery</strong>Available for eligible printing, documents and in-stock products.</span></div>
                <div><BadgeCheck /><span><strong>Customer approval</strong>No work starts until requirements and charges are confirmed.</span></div>
              </div>
            </div>
            <div className="info-panel">
              <span className="eyebrow">Pricing</span>
              <h3>Clear quotation before work begins.</h3>
              <p>{settings.pricing_message}</p>
              <TrackedLink className="button button--primary" href={whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, please quote this requirement: ")} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">Request exact quotation</TrackedLink>
            </div>
          </div>
        </section>

        <section className="section section--dark" id="coverage">
          <div className="container coverage-grid">
            <div>
              <span className="eyebrow eyebrow--light">Coverage</span>
              <h2>Selected Karachi South areas.</h2>
              <p>Delivery and doorstep eligibility varies by service, timing and exact pin. Share your location on WhatsApp before relying on coverage.</p>
              <TrackedLink className="button button--light" href={whatsappUrl(settings.whatsapp_e164, "Hello Yaqoob Enterprises, please confirm coverage for my location: ")} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">Confirm my location</TrackedLink>
            </div>
            <div className="area-cloud">
              {coverage.map((area) => <span key={area.id}>{area.name}</span>)}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container section-heading section-heading--center">
            <span className="eyebrow">Visit or contact</span>
            <h2>Tell us the task. We will tell you the practical next step.</h2>
            <p>{settings.address}</p>
            <div className="hero-actions hero-actions--center">
              <TrackedLink className="button button--primary" href={whatsapp} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click"><Send size={18} /> WhatsApp</TrackedLink>
              <TrackedLink className="button button--secondary" href={`tel:${settings.phone_e164}`} eventName="call_click"><Phone size={18} /> {settings.phone_display}</TrackedLink>
              <Link className="button button--secondary" href="/contact">Prepare request</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} categories={categories} />
    </>
  );
}
