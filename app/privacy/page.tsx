import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteData } from "@/lib/data";

export const metadata: Metadata = { title: "Privacy" };

export default async function PrivacyPage() {
  const { settings, categories } = await getSiteData();
  return (
    <>
      <SiteHeader settings={settings} />
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
