import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchHeader } from "@/components/stitch-header";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { getCategoryBySlug, getCurrentBusinessStatus, getSiteData } from "@/lib/data";
import { getActiveServiceCategorySlugs } from "@/lib/public-category-slugs";
import { getCategorySeo } from "@/lib/service-seo";
import { SITE_URL } from "@/lib/env";
import { serializeJsonLd } from "@/lib/structured-data";

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
  const [category, site] = await Promise.all([getCategoryBySlug(slug), getSiteData()]);
  if (!category) return {};
  const canonicalPath = `/services/${slug}`;
  const seo = getCategorySeo(category, site.settings);

  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      locale: "en_PK",
      siteName: site.settings.business_name,
      url: canonicalPath,
      title: seo.title,
      description: seo.description,
      images: [{
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${category.title} — ${site.settings.business_name}`,
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

export default async function ServiceCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, site] = await Promise.all([getCategoryBySlug(slug), getSiteData()]);
  if (!category) notFound();
  const statusText = getCurrentBusinessStatus(site.hours);
  const seo = getCategorySeo(category, site.settings);
  const siteUrl = SITE_URL.replace(/\/$/, "");

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
      { "@type": "ListItem", position: 3, name: category.title, item: `${siteUrl}/services/${category.slug}` },
    ],
  };

  const itemListData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.title} Services in Akhtar Colony Karachi`,
    description: seo.description,
    itemListElement: (category.services || []).map((service, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: service.title,
      description: service.short_description,
      url: `${siteUrl}/services/${category.slug}/${service.slug}`,
    })),
  };

  return (
    <div className="public-site public-site--cms-service">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(itemListData) }}
      />
      <StitchHeader settings={site.settings} statusText={statusText} />
      <main id="main-content">
        <section className="page-hero page-hero--service">
          <div className="page-hero__pattern" aria-hidden="true" />
          <div className="container page-hero__grid">
            <div className="page-hero__content">
              <Link className="back-link service-back-link" href="/services">
                <ArrowLeft className="service-back-link__icon" size={18} aria-hidden="true" />
                <span>All services</span>
              </Link>
              <div className="page-hero__icon"><ServiceIcon iconKey={category.icon_key} size={30} /></div>
              <h1>{seo.heading}</h1>
            </div>
          </div>
        </section>

        <section className="section section--service-list">
          <div className="container service-detail-grid service-detail-grid--premium">
            <div className="service-list service-list--premium">
              <div className="service-list__intro">
                <h2>Available services</h2>
              </div>

              {category.services?.map((service) => {
                return (
                  <article className="service-detail-card service-detail-card--premium" key={service.id}>
                    <div className="service-detail-card__head service-detail-card__head--premium">
                      <div>
                        {service.status !== "active" && <span className={`status status--${service.status}`}>{statusLabel(service.status)}</span>}
                        <h2>{service.title}</h2>
                      </div>
                    </div>
                    <Link className="service-detail-link" href={`/services/${category.slug}/${service.slug}`}>
                      Full service details <ArrowRight size={14} />
                    </Link>
                  </article>
                );
              })}
            </div>

          </div>
        </section>
      </main>
      <StitchFooter settings={site.settings} statusText={statusText} />
      <StitchFloatingActions settings={site.settings} />
    </div>
  );
}
