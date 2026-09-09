import { LocalBusinessSchema } from "@/components/local-business-schema";
import { StitchFAQ } from "@/components/stitch-faq";
import { StitchFloatingActions } from "@/components/stitch-floating-actions";
import { StitchFooter } from "@/components/stitch-footer";
import { StitchHeader } from "@/components/stitch-header";
import { StitchHero } from "@/components/stitch-hero";
import { StitchHowItWorks } from "@/components/stitch-how-it-works";
import { StitchQuickRequest } from "@/components/stitch-quick-request";
import { StitchServices } from "@/components/stitch-services";
import { StitchVisitShop } from "@/components/stitch-visit-shop";
import { businessLocationLabel } from "@/lib/business-display";
import { getCurrentBusinessStatus, getSiteData } from "@/lib/data";

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
        <StitchQuickRequest settings={settings} />
        <StitchVisitShop settings={settings} statusText={hoursText} />
        <StitchFAQ />
      </main>

      <StitchFooter settings={settings} />
      <StitchFloatingActions settings={settings} />
    </div>
  );
}
