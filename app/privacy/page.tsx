import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentBusinessStatus, getSiteData } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const description = `Plain-language privacy information for the ${settings.business_name} website and admin centre.`;
  const socialTitle = `Privacy | ${settings.business_name}`;

  return {
    title: "Privacy",
    description,
    alternates: { canonical: "/privacy" },
    openGraph: {
      type: "website",
      locale: "en_PK",
      siteName: settings.business_name,
      url: "/privacy",
      title: socialTitle,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${settings.business_name} privacy information` }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function PrivacyPage() {
  const { settings, categories, hours } = await getSiteData();
  return (
    <>
      <SiteHeader settings={settings} statusText={getCurrentBusinessStatus(hours)} />
      <main id="main-content">
        <section className="page-hero"><div className="container"><span className="eyebrow">Privacy</span><h1>Privacy &amp; data use</h1><p>How this website handles forms, analytics and external services.</p></div></section>
        <section className="section"><article className="container prose-page">
          <h2>Service request form</h2><p>The form prepares a WhatsApp message on your device. It does not upload files or save form details to the website database.</p>
          <h2>Website analytics</h2><p>Page views and contact clicks are recorded for aggregate reporting. Google Analytics 4 measures public visits. Hosting may provide an approximate city or country. The website analytics table does not store exact GPS locations, full IP addresses, passwords, PINs or one-time codes.</p>
          <h2>Analytics cookies</h2><p>First-party analytics may use a random <code>ye_session</code> cookie for up to 12 months; its value is one-way hashed before storage. Campaign cookies may last up to 30 days. Google Analytics may set its own cookies. These cookies do not contain your name, phone number or email.</p>
          <h2>Privacy signals and retention</h2><p>First-party analytics skips signed-in administrators, recognised bots and browsers with Do Not Track or Global Privacy Control enabled. Google Analytics runs on public production pages, not admin routes, and also skips those signals. We do not use advertising trackers. Analytics events may be deleted during maintenance; they do not include request-form content.</p>
          <h2>WhatsApp, phone, maps and analytics</h2><p>Google Analytics, WhatsApp, phone providers and Google Maps have their own terms and privacy policies.</p>
          <h2>Sensitive information</h2><p>Do not send passwords, PINs or one-time codes. Share ID documents only when required, after confirming the service process.</p>
          <h2>Admin access</h2><p>Supabase authentication limits admin access to authorised email addresses.</p>
        </article></section>
      </main>
      <SiteFooter settings={settings} categories={categories} />
    </>
  );
}
