import type { Metadata } from "next";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchHeader } from "@/components/stitch-header";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { ServicesCatalogView } from "@/components/services-catalog-view";
import { getCurrentBusinessStatus, getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "What can we help with? | All Services | Yaqoob Enterprises Karachi",
  description:
    "All major government portal verifications, documentation, ticketing, and everyday digital services in one place. NADRA e-Sahulat, FBR tax, agreements, and urgent printing in Akhtar Colony, Karachi.",
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: "What can we help with? | All Services | Yaqoob Enterprises Karachi",
    description:
      "All major government portal verifications, documentation, ticketing, and everyday digital services in one place in Akhtar Colony, Karachi.",
    url: `${SITE_URL}/services`,
    type: "website",
  },
};

export default async function ServicesPage() {
  const { settings, hours, categories, services } = await getSiteData();
  const statusText = getCurrentBusinessStatus(hours);

  // Structured data: ItemList of services
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Yaqoob Enterprises Services Directory",
    description:
      "All major government portal verifications, documentation, ticketing, and everyday digital services in Akhtar Colony, Karachi.",
    url: `${SITE_URL}/services`,
    numberOfItems: services.filter((s) => s.status !== "hidden").length,
    itemListElement: services
      .filter((s) => s.status !== "hidden")
      .map((service, index) => {
        const cat = categories.find((c) => c.id === service.category_id);
        return {
          "@type": "ListItem",
          position: index + 1,
          name: service.title,
          description: service.short_description || service.detailed_description,
          url: `${SITE_URL}/services/${cat?.slug || "general"}/${service.slug}`,
        };
      }),
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#0E7490] selection:text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StitchHeader settings={settings} statusText={statusText} />
      <div className="flex-1">
        <ServicesCatalogView
          categories={categories}
          services={services}
          settings={settings}
          statusText={statusText}
        />
      </div>
      <StitchFooter settings={settings} />
      <StitchFloatingActions settings={settings} />
    </div>
  );
}
