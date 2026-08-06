import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock3, MapPin, Send, Store, Truck } from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrackedLink } from "@/components/tracked-link";
import { getCategoryBySlug, getSiteData, whatsappUrl } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return { title: category.title, description: category.description };
}

export default async function ServiceCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, site] = await Promise.all([getCategoryBySlug(slug), getSiteData()]);
  if (!category) notFound();

  return (
    <>
      <SiteHeader settings={site.settings} />
      <main>
        <section className="page-hero">
          <div className="container">
            <Link className="back-link" href="/#services"><ArrowLeft size={16} /> All services</Link>
            <div className="page-hero__icon"><ServiceIcon iconKey={category.icon_key} size={30} /></div>
            <h1>{category.title}</h1>
            <p>{category.description}</p>
          </div>
        </section>
        <section className="section">
          <div className="container service-detail-grid">
            <div className="service-list">
              {category.services?.map((service) => {
                const message = `Hello Yaqoob Enterprises, I need help with ${service.title}. My requirement is: `;
                return (
                  <article className="service-detail-card" key={service.id}>
                    <div className="service-detail-card__head">
                      <div>
                        <span className={`status status--${service.status}`}>{service.status.replaceAll("_", " ")}</span>
                        <h2>{service.title}</h2>
                        <p>{service.detailed_description || service.short_description}</p>
                      </div>
                    </div>
                    <div className="mode-pills">
                      {service.available_at_shop && <span><Store size={15} /> At shop</span>}
                      {service.pickup_available && <span><Check size={15} /> Pickup</span>}
                      {service.delivery_available && <span><Truck size={15} /> Delivery</span>}
                      {service.doorstep_available && <span><MapPin size={15} /> Doorstep</span>}
                      {service.appointment_required && <span><Clock3 size={15} /> Appointment</span>}
                    </div>
                    {service.requirements?.length > 0 && (
                      <div className="requirements">
                        <h3>What to provide</h3>
                        <ul>{service.requirements.map((item) => <li key={item}><Check size={15} /> {item}</li>)}</ul>
                      </div>
                    )}
                    {service.important_note && <div className="important-note"><strong>Important:</strong> {service.important_note}</div>}
                    <TrackedLink className="button button--primary" href={whatsappUrl(site.settings.whatsapp_e164, message)} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click"><Send size={17} /> Ask about this service</TrackedLink>
                  </article>
                );
              })}
            </div>
            <aside className="category-sidebar">
              <h2>Other categories</h2>
              {site.categories.map((item) => <Link className={item.slug === slug ? "active" : ""} key={item.id} href={`/services/${item.slug}`}>{item.title}</Link>)}
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter settings={site.settings} categories={site.categories} />
    </>
  );
}
