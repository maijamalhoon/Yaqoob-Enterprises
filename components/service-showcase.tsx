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
    <section className="section services-showcase minimal-services" id="services">
      <div className="container">
        <div className="minimal-services__heading">
          <div>
            <span className="eyebrow">Services</span>
            <h2>What can we help with?</h2>
          </div>
        </div>

        <div className="minimal-services__list">
          {categories.map((category) => {
            const count = category.services?.length || 0;
            return (
              <Link className="minimal-service-item" key={category.id} href={`/services/${category.slug}`}>
                <span className="minimal-service-item__icon"><ServiceIcon iconKey={category.icon_key} size={20} /></span>
                <span className="minimal-service-item__copy">
                  <strong>{shortCategoryTitles[category.slug] || category.title}</strong>
                  <small>{category.description}</small>
                </span>
                <span className="minimal-service-item__meta">{count} {count === 1 ? "option" : "options"}</span>
                <ArrowRight className="minimal-service-item__arrow" size={18} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
