import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";
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
};

export function ServiceShowcase({ categories }: { categories: ServiceCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="section services-showcase services-showcase--interactive" id="services">
      <div className="container">
        <div className="section-heading section-heading--split service-showcase-heading">
          <div>
            <span className="eyebrow">Find a service</span>
            <h2>Choose the service you need.</h2>
          </div>
          <div className="service-showcase-heading__side">
            <p>
              Compare all {categories.length} service categories at a glance. Open any category to see requirements,
              availability and the right next step.
            </p>
          </div>
        </div>

        <div className="service-all-services">
          <div className="category-grid category-grid--bento category-grid--final service-all-grid">
            {categories.map((category, index) => {
              const count = category.services?.length || 0;
              return (
                <Link
                  className="category-card category-card--final"
                  key={category.id}
                  href={`/services/${category.slug}`}
                >
                  <div className="category-card__topline">
                    <span className="category-card__number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="category-card__icon"><ServiceIcon iconKey={category.icon_key} /></span>
                  </div>
                  <h3>
                    <span className="category-title-full">{category.title}</span>
                    <span className="category-title-short">{shortCategoryTitles[category.slug] || category.title}</span>
                  </h3>
                  <p>{category.description}</p>
                  <span className="category-card__link">
                    <span className="category-card__count">{count} {count === 1 ? "option" : "options"}</span>
                    <span className="category-card__action"><span>View services</span><ArrowRight size={17} /></span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
