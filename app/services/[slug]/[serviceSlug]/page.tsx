import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Clock3,
  ExternalLink,
  ListChecks,
  MapPin,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchHeader } from "@/components/stitch-header";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { businessCity } from "@/lib/business-display";
import {
  getCurrentBusinessStatus,
  getPublicServicePaths,
  getServiceBySlugs,
  getSiteData,
} from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { getCustomerServiceModes } from "@/lib/service-availability";
import { getServiceSeo } from "@/lib/service-seo";
import { serializeJsonLd } from "@/lib/structured-data";

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
      message: `Hello ${businessName}, I want to ask about ${title}. My requirement is: `,
    };
  }
  if (status === "appointment_only") {
    return {
      message: `Hello ${businessName}, I want to book or confirm ${title}. `,
    };
  }
  if (status === "coming_soon") {
    return {
      message: `Hello ${businessName}, please tell me when ${title} will be available. `,
    };
  }
  if (status === "temporarily_unavailable") {
    return {
      message: `Hello ${businessName}, please tell me when ${title} will be available again. `,
    };
  }
  return {
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

  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords,
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
        alt: `${match.service.title} — ${site.settings.business_name}`,
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
  const statusText = getCurrentBusinessStatus(site.hours);
  const modes = getCustomerServiceModes(service);
  const action = serviceAction(service.status, service.title, site.settings.business_name);
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
      { "@type": "ListItem", position: 3, name: service.title, item: pageUrl },
    ],
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: service.title,
    serviceType: service.title,
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

  const faqData =
    seo.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: seo.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <div className="public-site public-site--cms-service">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceData) }} />
      {faqData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqData) }} />}
      <StitchHeader settings={site.settings} statusText={statusText} />
      <main id="main-content">
        <section className="seo-service-hero">
          <div className="container">
<div className="seo-service-hero__grid">
              <div className="seo-service-hero__copy">
                <Link className="back-link" href={`/services/${category.slug}`}><ArrowLeft size={16} /> Back to {category.title}</Link>
                <div className="page-hero__icon"><ServiceIcon iconKey={category.icon_key} size={28} /></div>
                <h1>{seo.heading}</h1>
                <p>{service.short_description || seo.description}</p>
              </div>
              <aside className="seo-service-hero__summary" aria-label="Service summary">
                {service.status !== "active" && <span className={`status status--${service.status}`}>{statusLabel(service.status)}</span>}
                <strong>{seo.location}</strong>
              </aside>
            </div>
          </div>
        </section>

        <section className="seo-service-body">
          <div className="container seo-service-layout">
            <article className="seo-service-main">
              {seo.commonRequests.length > 0 && (
                <section className="seo-content-block seo-requirements">
                  <h2><ListChecks size={20} /> What we do</h2>
                  <ul>{seo.commonRequests.map((item) => <li key={item}><Check size={16} /> <span>{item}</span></li>)}</ul>
                </section>
              )}

              {modes.length > 0 && (
                <section className="seo-content-block">
                  <h2>Service options</h2>
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
                  <h2><ListChecks size={20} /> Bring</h2>
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
                  <div className="important-note"><strong>Please note:</strong> {service.important_note}</div>
                </section>
              )}

              {seo.faqs.length > 0 && (
                <section className="seo-content-block">
                  <h2>Questions</h2>
                  <div className="space-y-3 mt-4">
                    {seo.faqs.map((faq, idx) => (
                      <details key={idx} className="group border-b border-slate-200 py-3 transition-all">
                        <summary className="min-h-11 font-bold text-sm text-slate-900 cursor-pointer flex items-center justify-between list-none select-none">
                          <span>{faq.question}</span>
                          <span className="ml-2 text-xs text-slate-500 group-open:text-slate-900 group-open:font-bold">
                            +
                          </span>
                        </summary>
                        <p className="text-xs sm:text-sm text-slate-600 mt-2.5 pt-2.5 border-t border-slate-200 leading-relaxed">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {relatedServices.length > 0 && (
                <section className="seo-related-services">
                  <div className="seo-related-services__heading"><h2>Related services</h2></div>
                  <div className="seo-related-services__grid">
                    {relatedServices.map((item) => (
                      <Link key={item.id} href={`/services/${category.slug}/${item.slug}`}>
                        <strong>{item.title}</strong>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>

          </div>
        </section>
      </main>
      <StitchFooter settings={site.settings} statusText={statusText} />
      <StitchFloatingActions settings={site.settings} whatsappMessage={action.message} />
    </div>
  );
}
