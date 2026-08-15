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
        <section className="page-hero"><div className="container"><span className="eyebrow">Privacy</span><h1>Plain-language privacy information.</h1><p>What the website stores, what it does not store and how third-party services are used.</p></div></section>
        <section className="section"><article className="container prose-page">
          <h2>Service request form</h2><p>The contact form prepares a WhatsApp message on your device. It does not upload files or store the form fields in the website database.</p>
          <h2>Website analytics</h2><p>The website records page views and contact-action clicks for aggregate operational reporting. It may record approximate city or country information supplied by the hosting platform. Exact GPS location, full IP addresses, passwords, PINs and one-time codes are not stored in the analytics table.</p>
          <h2>Analytics cookie</h2><p>When analytics is allowed, the website may set a first-party cookie named <code>ye_session</code>. It contains a random identifier—not your name, phone number or email—and expires after up to 12 months. The identifier is converted to a one-way hash before an analytics event is stored. The cookie is marked HttpOnly, Secure in production and SameSite=Lax.</p>
          <h2>Privacy signals and retention</h2><p>Analytics is skipped for signed-in administrators, recognised automated bots, browsers sending Do Not Track, and browsers using the Global Privacy Control signal. The website does not use advertising trackers. Analytics events are kept for operational reporting and may be deleted during maintenance; no customer request-form content is included in those records.</p>
          <h2>WhatsApp, phone and maps</h2><p>WhatsApp, telephone services and Google Maps are operated by their respective providers. Their terms and privacy policies apply when you use those services.</p>
          <h2>Sensitive information</h2><p>Never send passwords, PINs or one-time verification codes. Identification documents should only be shared when genuinely required and after confirming the service process.</p>
          <h2>Admin access</h2><p>The admin centre uses Supabase authentication and is restricted to explicitly authorised email addresses.</p>
        </article></section>
      </main>
      <SiteFooter settings={settings} categories={categories} />
    </>
  );
}
