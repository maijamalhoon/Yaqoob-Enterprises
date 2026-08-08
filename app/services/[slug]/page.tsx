import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Grid2X2,
  ListChecks,
  MapPin,
  Send,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackedLink } from "@/components/tracked-link";
import { getCategoryBySlug, getCurrentBusinessStatus, getSiteData, whatsappUrl } from "@/lib/data";
import { getActiveServiceCategorySlugs } from "@/lib/public-category-slugs";
import { getCustomerServiceModes } from "@/lib/service-availability";

function serviceAction(status: string, title: string) {
  if (status === "active") {
    return {
      label: "Send this requirement",
      message: `Hello Yaqoob Enterprises, I want to ask about ${title}. My requirement is: `,
      note: null,
      className: "button button--primary",
    };
  }
  if (status === "appointment_only") {
    return {
      label: "Book or confirm first",
      message: `Hello Yaqoob Enterprises, I want to book or confirm ${title}. `,
      note: "This service needs confirmation or an appointment before you visit.",
      className: "button button--primary",
    };
  }
  if (status === "coming_soon") {
    return {
      label: "Ask when it starts",
      message: `Hello Yaqoob Enterprises, please tell me when ${title} will be available. `,
      note: "This service is coming soon. Ask for the expected start date before visiting.",
      className: "button button--secondary",
    };
  }
  if (status === "temporarily_unavailable") {
    return {
      label: "Ask when available",
      message: `Hello Yaqoob Enterprises, please tell me when ${title} will be available again. `,
      note: "This service is temporarily paused. Confirm before sending documents or travelling.",
      className: "button button--secondary",
    };
  }
  return {
    label: "Check availability",
    message: `Hello Yaqoob Enterprises, please confirm the current availability of ${title}. `,
    note: "Availability may be limited. Confirm the current status before visiting.",
    className: "button button--secondary",
  };
}

function statusLabel(status: string) {
  if (status === "active") return "Available";
  if (status === "appointment_only") return "Book first";
  if (status === "coming_soon") return "Coming soon";
  if (status === "temporarily_unavailable") return "Temporarily paused";
  return "Check first";
}

export async function generateStaticParams() {
  const categorySlugs = await getActiveServiceCategorySlugs();
  return categorySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  const canonicalPath = `/services/${slug}`;
  const socialTitle = `${category.title} | Yaqoob Enterprises`;

  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      locale: "en_PK",
      siteName: "Yaqoob Enterprises",
      url: canonicalPath,
      title: socialTitle,
      description: category.description,
      images: [{
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${category.title} — Yaqoob Enterprises`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: category.description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function ServiceCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, site] = await Promise.all([getCategoryBySlug(slug), getSiteData()]);
  if (!category) notFound();
  const serviceCount = category.services?.length || 0;
  const statusText = getCurrentBusinessStatus(site.hours);

  return (
    <>
      <SiteHeader settings={site.settings} statusText={statusText} />
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
              <span className="page-hero__summary-icon"><Grid2X2 size={22} /></span>
              <strong>{serviceCount}</strong>
              <span>{serviceCount === 1 ? "service option" : "service options"}</span>
              <small>Choose an option to see what to bring, where it is available and what to do next.</small>
            </aside>
          </div>
        </section>

        <section className="section section--service-list">
          <div className="container service-detail-grid service-detail-grid--premium">
            <details className="mobile-category-switcher mobile-category-switcher--final">
              <summary>
                <span className="mobile-switcher-icon"><ServiceIcon iconKey={category.icon_key} size={19} /></span>
                <span className="mobile-switcher-copy"><small>Current category</small><strong>{category.title}</strong></span>
                <ChevronDown className="mobile-switcher-chevron" size={19} />
              </summary>
              <nav aria-label="Service categories">
                {site.categories.map((item) => (
                  <Link
                    className={item.slug === slug ? "active" : ""}
                    aria-current={item.slug === slug ? "page" : undefined}
                    key={item.id}
                    href={`/services/${item.slug}`}
                  >
                    <ServiceIcon iconKey={item.icon_key} size={17} />
                    <span>{item.title}</span>
                    <ArrowRight size={15} />
                  </Link>
                ))}
              </nav>
            </details>

            <div className="service-list service-list--premium">
              <div className="service-list__intro">
                <div>
                  <span className="eyebrow">Choose your task</span>
                  <h2>Pick the option that matches what you need.</h2>
                </div>
                <p>Every card shows the requirement, service method and the correct next action.</p>
              </div>

              {category.services?.map((service, index) => {
                const action = serviceAction(service.status, service.title);
                const customerModes = getCustomerServiceModes(service);
                return (
                  <article className="service-detail-card service-detail-card--premium" key={service.id}>
                    <div className="service-card-accent" aria-hidden="true" />
                    <div className="service-detail-card__head service-detail-card__head--premium">
                      <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <span className={`status status--${service.status}`}>{statusLabel(service.status)}</span>
                        <h2>{service.title}</h2>
                        <p>{service.detailed_description || service.short_description}</p>
                      </div>
                    </div>

                    {customerModes.length > 0 && (
                      <div className="mode-pills mode-pills--premium" aria-label="Available service options">
                        {customerModes.includes("Visit the shop") && <span><Store size={15} /> At the shop</span>}
                        {customerModes.includes("Shop pickup") && <span><Check size={15} /> Pickup</span>}
                        {customerModes.includes("Delivery") && <span><Truck size={15} /> Delivery</span>}
                        {customerModes.includes("Doorstep appointment") && <span><MapPin size={15} /> Home visit</span>}
                        {service.appointment_required && <span><Clock3 size={15} /> Book first</span>}
                      </div>
                    )}

                    {service.requirements?.length > 0 && (
                      <div className="requirements requirements--premium">
                        <h3><ListChecks size={18} /> What to bring or send</h3>
                        <ul>{service.requirements.map((item) => <li key={item}><Check size={15} /> {item}</li>)}</ul>
                      </div>
                    )}

                    {service.important_note && <div className="important-note"><strong>Please note:</strong> {service.important_note}</div>}
                    {action.note && <p className="service-status-note"><ShieldCheck size={16} /> {action.note}</p>}

                    <TrackedLink className={`${action.className} service-card-action`} href={whatsappUrl(site.settings.whatsapp_e164, action.message)} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
                      <Send size={17} /> {action.label} <ArrowRight size={16} />
                    </TrackedLink>
                  </article>
                );
              })}
            </div>

            <aside className="category-sidebar category-sidebar--premium category-sidebar--final">
              <div className="category-sidebar__heading">
                <Grid2X2 size={20} />
                <div><span>Other services</span><h2>Switch category</h2></div>
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
