import type { Metadata } from "next";
import { LocalBusinessSchema } from "@/components/local-business-schema";
import { StitchFAQ } from "@/components/stitch-faq";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchHeader } from "@/components/stitch-header";
import { StitchHero } from "@/components/stitch-hero";
import { StitchHowItWorks } from "@/components/stitch-how-it-works";
import { StitchQuickRequest } from "@/components/stitch-quick-request";
import { StitchServices } from "@/components/stitch-services";
import { StitchTrust } from "@/components/stitch-trust";
import { StitchVisitShop } from "@/components/stitch-visit-shop";
import { businessLocationLabel } from "@/lib/business-display";
import { getCurrentBusinessStatus, getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const title = `Yaqoob Enterprises | Printing & Photocopying in Akhtar Colony, Karachi`;
  const description = `${settings.business_name} provides printing, photocopying, color printing, notes printing, photo printing, bulk printing and NADRA e-Sahulat services in Akhtar Colony, Karachi.`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: settings.business_name,
      locale: "en_PK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HomePage() {
  const { settings, hours, categories, coverage, gallery, services } = await getSiteData();
  const featuredImage = gallery.find((image) => image.is_featured && image.media_kind === "real");
  const imageUrl = featuredImage
    ? `https://kzikyufuyanfjlddyepo.supabase.co/storage/v1/object/public/shop-media/${featuredImage.storage_path}`
    : "/brand/logo-horizontal.svg";
  const schemaImageUrl = featuredImage ? imageUrl : "/brand/logo-horizontal.svg";
  const hoursText = getCurrentBusinessStatus(hours);
  const locationLabel = businessLocationLabel(settings.address);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#0E7490] selection:text-white pb-20 md:pb-0">
      <LocalBusinessSchema
        settings={settings}
        hours={hours}
        coverage={coverage}
        categories={categories}
        imageUrl={schemaImageUrl}
      />

      <StitchHeader settings={settings} statusText={hoursText} />

      <main id="main-content">
        <StitchHero
          settings={settings}
          statusText={hoursText}
          locationLabel={locationLabel}
          gallery={gallery}
        />
        <StitchServices services={services} categories={categories} />
        <StitchHowItWorks />
        <StitchTrust settings={settings} statusText={hoursText} />
        <StitchQuickRequest settings={settings} services={services} />
        <StitchVisitShop settings={settings} statusText={hoursText} hours={hours} />
        <StitchFAQ />
      </main>

      <StitchFooter settings={settings} />
      <StitchFloatingActions settings={settings} />
    </div>
  );
}
