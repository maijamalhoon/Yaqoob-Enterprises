import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  ExternalLink,
  ListChecks,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackedLink } from "@/components/tracked-link";
import { businessCity } from "@/lib/business-display";
import {
  getCurrentBusinessStatus,
  getPublicServicePaths,
  getServiceBySlugs,
  getSiteData,
  whatsappUrl,
} from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { getCustomerServiceModes } from "@/lib/service-availability";
import { getServicePresentation } from "@/lib/service-presentation";
import { getServiceSeo } from "@/lib/service-seo";

function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function statusLabel(status: string) {
  if (status === "active") return "Available";
  if (status === "appointment_only") return "Book first";
  if (status === "coming_soon") return "Coming soon";
  if (status === "temporarily_unavailable") return "Temporarily paused";
  return "Check first";
}

function serviceAction(status: string, title: string, businessName: string) {
  if (status === "active") {
    return {
      label: "Ask about this service",
      message: `Hello ${businessName}, I want to ask about ${title}. My requirement is: `,
    };
  }
  if (status === "appointment_only") {
    return {
      label: "Book or confirm first",
      message: `Hello ${businessName}, I want to book or confirm ${title}. `,
    };
  }
  if (status === "coming_soon") {
    return {
      label: "Ask when it starts",
      message: `Hello ${businessName}, please tell me when ${title} will be available. `,
    };
  }
  if (status === "temporarily_unavailable") {
    return {
      label: "Ask when available",
      message: `Hello ${businessName}, please tell me when ${title} will be available again. `,
    };
  }
  return {
    label: "Check availability",
    message: `Hello ${businessName}, please confirm the current availability of ${title}. `,
  };
}

export async function generateStaticParams() {
  const paths = await getPublicServicePaths();
  return paths.map(({ categorySlug, serviceSlug }) => ({ slug: categorySlug, serviceSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; serviceSlug: string }>;
}): Promise<Metadata> {
  const { slug, serviceSlug } = await params;
  const [match, site] = await Promise.all([
    getServiceBySlugs(slug, serviceSlug),
    getSiteData(),
  ]);
  if (!match) return {};
  const seo = getServiceSeo(match.category, match.service, site.settings);
  const presentation = getServicePresentation(match.service);

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: seo.canonicalPath },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_PK",
      siteName: site.settings.business_name,
      url: seo.canonicalPath,
      title: seo.title,
      description: seo.description,
      images: [{
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${presentation.title} — ${site.settings.business_name}`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function PublicServicePage({
  params,
}: {
  params: Promise<{ slug: string; serviceSlug: string }>;
}) {
  const { slug, serviceSlug } = await params;
  const [match, site] = await Promise.all([
    getServiceBySlugs(slug, serviceSlug),
    getSiteData(),
  ]);
  if (!match) notFound();

  const { category, service } = match;
  const seo = getServiceSeo(category, service, site.settings);
  const presentation = getServicePresentation(service);
  const statusText = getCurrentBusinessStatus(site.hours);
  const modes = getCustomerServiceModes(service);
  const action = serviceAction(service.status, presentation.title, site.settings.business_name);
  const relatedServices = (category.services || []).filter((item) => item.id !== service.id).slice(0, 4);
  const pageUrl = `${SITE_URL.replace(/\/$/, "")}${seo.canonicalPath}`;
  const city = businessCity(site.settings.address);
  const serviceAreas = [
    { "@type": "City", name: city },
    ...site.coverage.slice(0, 12).map((area) => ({ "@type": "Place", name: area.name })),
  ];

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: category.title, item: `${SITE_URL}/services/${category.slug}` },
      { "@type": "ListItem", position: 3, name: presentation.title, item: pageUrl },
    ],
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: presentation.title,
    serviceType: presentation.title,
    description: seo.description,
    url: pageUrl,
    areaServed: serviceAreas,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: site.settings.business_name,
      telephone: site.settings.phone_e164,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.settings.address,
        addressLocality: city,
        addressRegion: "Sindh",
        addressCountry: "PK",
      },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceData) }} />
      <SiteHeader settings={site.settings} statusText={statusText} />
      <main id="main-content">
        <section className="seo-service-hero">
          <div className="container">
            <nav className="seo-breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span aria-hidden="true">/</span>
              <Link href={`/services/${category.slug}`}>{category.title}</Link><span aria-hidden="true">/</span>
              <span aria-current="page">{presentation.title}</span>
            </nav>

            <div className="seo-service-hero__grid">
              <div className="seo-service-hero__copy">
                <Link className="back-link" href={`/services/${category.slug}`}><ArrowLeft size={16} /> Back to {category.title}</Link>
                <div className="page-hero__icon"><ServiceIcon iconKey={category.icon_key} size={28} /></div>
                <span className="eyebrow">{category.title}</span>
                <h1>{seo.heading}</h1>
                <p>{seo.description}</p>
              </div>
              <aside className="seo-service-hero__summary" aria-label="Service summary">
                <span className={`status status--${service.status}`}>{statusLabel(service.status)}</span>
                <strong>{seo.location}</strong>
                <small>{statusText}</small>
                <div className="seo-summary-modes">
                  {modes.includes("Visit the shop") && <span><Store size={14} /> Shop</span>}
                  {modes.includes("Delivery") && <span><Truck size={14} /> Delivery</span>}
                  {modes.includes("Doorstep appointment") && <span><MapPin size={14} /> Home visit</span>}
                  {service.appointment_required && <span><Clock3 size={14} /> Book first</span>}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="seo-service-body">
          <div className="container seo-service-layout">
            <article className="seo-service-main">
              <section className="seo-content-block">
                <span className="eyebrow">Service overview</span>
                <h2>What this service covers</h2>
                <p>{seo.intro}</p>
                {service.detailed_description && service.detailed_description !== seo.intro && <p>{service.detailed_description}</p>}
              </section>

              {seo.commonRequests.length > 0 && (
                <section className="seo-content-block seo-requirements">
                  <h2><ListChecks size={20} /> Common requests we handle</h2>
                  <ul>{seo.commonRequests.map((item) => <li key={item}><Check size={16} /> <span>{item}</span></li>)}</ul>
                </section>
              )}

              {modes.length > 0 && (
                <section className="seo-content-block">
                  <h2>Available service options</h2>
                  <div className="mode-pills mode-pills--premium">
                    {modes.includes("Visit the shop") && <span><Store size={15} /> At the shop</span>}
                    {modes.includes("Shop pickup") && <span><Check size={15} /> Pickup</span>}
                    {modes.includes("Delivery") && <span><Truck size={15} /> Delivery</span>}
                    {modes.includes("Doorstep appointment") && <span><MapPin size={15} /> Home visit</span>}
                    {service.appointment_required && <span><Clock3 size={15} /> Appointment required</span>}
                  </div>
                </section>
              )}

              {service.requirements?.length > 0 && (
                <section className="seo-content-block seo-requirements">
                  <h2><ListChecks size={20} /> What to bring or prepare</h2>
                  <ul>{service.requirements.map((item) => <li key={item}><Check size={16} /> <span>{item}</span></li>)}</ul>
                </section>
              )}

              {seo.officialContext && (
                <section className="seo-official-reference">
                  <div><ShieldCheck size={20} /><span>{seo.officialContext.source} reference</span></div>
                  <h2>{seo.officialContext.title}</h2>
                  <p>{seo.officialContext.body}</p>
                  <p className="seo-official-reference__notice">Official rules, eligibility and system availability are controlled by the relevant authority. This page is service information from {site.settings.business_name}, not an official government notice.</p>
                  <a href={seo.officialContext.url} target="_blank" rel="noopener noreferrer">Read the official guidance <ExternalLink size={14} /></a>
                </section>
              )}

              {service.important_note && (
                <section className="seo-content-block">
                  <h2>Before you visit</h2>
                  <div className="important-note"><strong>Please note:</strong> {service.important_note}</div>
                  <p>Send the service name and your case details on WhatsApp first if you are unsure about eligibility, documents or current system availability.</p>
                </section>
              )}

              {relatedServices.length > 0 && (
                <section className="seo-related-services">
                  <div className="seo-related-services__heading"><span className="eyebrow">Related services</span><h2>Other options in {category.title}</h2></div>
                  <div className="seo-related-services__grid">
                    {relatedServices.map((item) => (
                      <Link key={item.id} href={`/services/${category.slug}/${item.slug}`}>
                        <strong>{item.title}</strong>
                        <small>{item.short_description}</small>
                        <span>View service <ArrowRight size={14} /></span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>

            <aside className="seo-service-cta">
              <span className="eyebrow">Confirm before travelling</span>
              <h2>{presentation.title}</h2>
              <p>{site.settings.address}</p>
              <TrackedLink className="button button--primary" href={whatsappUrl(site.settings.whatsapp_e164, action.message)} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click">
                <MessageCircle size={17} /> {action.label}
              </TrackedLink>
              <TrackedLink className="seo-service-cta__link" href={`tel:${site.settings.phone_e164}`} eventName="call_click"><Phone size={16} /> {site.settings.phone_display}</TrackedLink>
              <TrackedLink className="seo-service-cta__link" href={site.settings.map_url} target="_blank" rel="noopener noreferrer" eventName="directions_click"><MapPin size={16} /> Directions</TrackedLink>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter settings={site.settings} categories={site.categories} />
    </>
  );
}
