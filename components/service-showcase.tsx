import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";
import { getServicePresentation, getServicePriority, isPriorityService } from "@/lib/service-presentation";
import type { ServiceCategory } from "@/lib/types";

const shortCategoryTitles: Record<string, string> = {
  "printing-photos": "Print, Copy & Photos",
  "typing-online": "Typing, CV & Online Forms",
  documents: "Agreements & Documents",
  biometric: "Biometric & e-Sahulat",
  payments: "Payments & Transfer",
  tickets: "Tickets & Booking",
  retail: "Stationery & Accessories",
  laptop: "Laptop & Software Help",
  "web-development-seo": "Web Development & SEO",
};

export function ServiceShowcase({ categories }: { categories: ServiceCategory[] }) {
  const featuredServices = categories
    .flatMap((category) =>
      (category.services || [])
        .filter((service) => service.is_featured && service.status !== "hidden")
        .map((service) => ({ category, service })),
    )
    .sort((a, b) => {
      const priorityOrder = getServicePriority(a.service.slug) - getServicePriority(b.service.slug);
      if (priorityOrder !== 0) return priorityOrder;
      const serviceOrder = a.service.display_order - b.service.display_order;
      if (serviceOrder !== 0) return serviceOrder;
      const categoryOrder = a.category.display_order - b.category.display_order;
      if (categoryOrder !== 0) return categoryOrder;
      return a.service.title.localeCompare(b.service.title);
    });

  if (featuredServices.length === 0) return null;

  return (
    <section className="section services-showcase minimal-services" id="services" aria-labelledby="services-title">
      <div className="container">
        <div className="minimal-services__heading">
          <div>
            <span className="eyebrow">Services</span>
            <h2 id="services-title">What can we help with?</h2>
          </div>
          <p>Priority services appear first. Open any service to check requirements, availability and the next step.</p>
        </div>

        <div className="minimal-services__list">
          {featuredServices.map(({ category, service }) => {
            const presentation = getServicePresentation(service);
            const priority = isPriorityService(service.slug);

            return (
              <Link
                className={`minimal-service-item${priority ? " minimal-service-item--priority" : ""}`}
                data-service-slug={service.slug}
                key={service.id}
                href={`/services/${category.slug}/${service.slug}`}
                aria-label={`${presentation.title}: view requirements and availability`}
              >
                <span className="minimal-service-item__icon"><ServiceIcon iconKey={category.icon_key} size={20} /></span>
                <span className="minimal-service-item__copy">
                  <strong>{presentation.title}</strong>
                  <small>{presentation.description}</small>
                </span>
                <span className="minimal-service-item__meta">{shortCategoryTitles[category.slug] || category.title}</span>
                <ArrowRight className="minimal-service-item__arrow" size={18} aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
