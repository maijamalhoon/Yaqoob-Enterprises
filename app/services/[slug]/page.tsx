import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Layers3,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackedLink } from "@/components/tracked-link";
import { getCategoryBySlug, getSiteData, whatsappUrl } from "@/lib/data";

function serviceAction(status: string, title: string) {
  if (status === "active") {
    return {
      label: "Start this request",
      message: `Hello Yaqoob Enterprises, I want to request ${title}. My requirement is: `,
      note: null,
      className: "button button--primary",
    };
  }
  if (status === "coming_soon") {
    return {
      label: "Ask when available",
      message: `Hello Yaqoob Enterprises, please tell me when ${title} will be available. `,
      note: "This service is not currently listed as active. Confirm the expected availability before visiting.",
      className: "button button--secondary",
    };
  }
  return {
    label: "Confirm current availability",
    message: `Hello Yaqoob Enterprises, please confirm the current availability of ${title}. `,
    note: "Availability may be limited or temporarily paused. Confirm before sending documents or travelling.",
    className: "button button--secondary",
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return { title: category.title, description: category.description };
}

export default async function ServiceCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, site] = await Promise.all([getCategoryBySlug(slug), getSiteData()]);
  if (!category) notFound();
  const serviceCount = category.services?.length || 0;

  return (
    <>
      <SiteHeader settings={site.settings} />
      <main id="main-content">
        <section className="page-hero page-hero--service">
          <div className="page-hero__pattern" aria-hidden="true" />
          <div className="container page-hero__grid">
            <div className="page-hero__content">
              <Link className="back-link" href="/#services"><ArrowLeft size={16} /> All services</Link>
              <div className="page-hero__icon"><ServiceIcon iconKey={category.icon_key} size={30} /></div>
              <span className="eyebrow">Service category</span>
              <h1>{category.title}</h1>
              <p>{category.description}</p>
            </div>
            <aside className="page-hero__summary" aria-label="Category summary">
              <span className="page-hero__summary-icon"><Sparkles size={22} /></span>
              <strong>{serviceCount}</strong>
              <span>{serviceCount === 1 ? "service" : "services"} in this category</span>
              <small>Requirements, availability and charges are confirmed before work begins.</small>
            </aside>
          </div>
        </section>

        <section className="section section--service-list">
          <div className="container service-detail-grid service-detail-grid--premium">
            <details className="mobile-category-switcher">
              <summary>
                <span>Browse service categories</span>
                <strong>{category.title}</strong>
              </summary>
              <nav aria-label="Service categories">
                {site.categories.map((item) => (
                  <Link
                    className={item.slug === slug ? "active" : ""}
                    aria-current={item.slug === slug ? "page" : undefined}
                    key={item.id}
                    href={`/services/${item.slug}`}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </details>

            <div className="service-list service-list--premium">
              <div className="service-list__intro">
                <div>
                  <span className="eyebrow">Available options</span>
                  <h2>Choose the exact service you need.</h2>
                </div>
                <p>Each card shows where the service can be completed, what to provide and the correct next action.</p>
              </div>

              {category.services?.map((service, index) => {
                const action = serviceAction(service.status, service.title);
                return (
                  <article className="service-detail-card service-detail-card--premium" key={service.id}>
                    <div className="service-card-accent" aria-hidden="true" />
                    <div className="service-detail-card__head service-detail-card__head--premium">
                      <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <span className={`status status--${service.status}`}>{service.status.replaceAll("_", " ")}</span>
                        <h2>{service.title}</h2>
                        <p>{service.detailed_description || service.short_description}</p>
                      </div>
                    </div>

                    <div className="mode-pills mode-pills--premium">
                      {service.available_at_shop && <span><Store size={15} /> At shop</span>}
                      {service.pickup_available && <span><Check size={15} /> Pickup</span>}
                      {service.delivery_available && <span><Truck size={15} /> Delivery</span>}
                      {service.doorstep_available && <span><MapPin size={15} /> Doorstep</span>}
                      {service.appointment_required && <span><Clock3 size={15} /> Appointment</span>}
                    </div>

                    {service.requirements?.length > 0 && (
                      <div className="requirements requirements--premium">
                        <h3><Layers3 size={18} /> What to provide</h3>
                        <ul>{service.requirements.map((item) => <li key={item}><Check size={15} /> {item}</li>)}</ul>
                      </div>
                    )}

                    {service.important_note && <div className="important-note"><strong>Important:</strong> {service.important_note}</div>}
                    {action.note && <p className="service-status-note">{action.note}</p>}

                    <TrackedLink className={`${action.className} service-card-action`} href={whatsappUrl(site.settings.whatsapp_e164, action.message)} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
                      <Send size={17} /> {action.label} <ArrowRight size={16} />
                    </TrackedLink>
                  </article>
                );
              })}
            </div>

            <aside className="category-sidebar category-sidebar--premium">
              <div className="category-sidebar__heading">
                <MessageCircle size={20} />
                <div><span>Explore</span><h2>Other categories</h2></div>
              </div>
              <nav aria-label="Other service categories">
                {site.categories.map((item, index) => (
                  <Link
                    className={item.slug === slug ? "active" : ""}
                    aria-current={item.slug === slug ? "page" : undefined}
                    key={item.id}
                    href={`/services/${item.slug}`}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {item.title}
                    <ArrowRight size={15} />
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter settings={site.settings} categories={site.categories} />
    </>
  );
}
