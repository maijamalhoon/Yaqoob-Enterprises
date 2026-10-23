import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ServiceCategory } from "@/lib/types";

interface StitchServicesProps {
  categories: ServiceCategory[];
}

const PRIMARY_SERVICES = [
  { id: "printing", title: "Printing", url: "/printing" },
  { id: "photocopying", title: "Photocopying", url: "/photocopying" },
  { id: "color-printing", title: "Colour printing", url: "/color-printing" },
  { id: "notes-printing", title: "Notes and assignments", url: "/notes-printing" },
  { id: "bulk-printing", title: "Bulk printing", url: "/bulk-printing" },
  { id: "photo-printing", title: "Passport photos", url: "/photo-printing" },
  { id: "office-printing", title: "Office printing", url: "/office-printing" },
  { id: "nadra-esahulat", title: "NADRA e-Sahulat", url: "/nadra-esahulat" },
];

export function StitchServices({ categories }: StitchServicesProps) {
  const moreCategories = categories.filter(
    (category) => category.slug !== "printing-photos" && category.slug !== "biometric",
  );

  return (
    <section id="services" className="public-section public-section--soft" aria-labelledby="home-services-title">
      <div className="public-container">
        <div className="public-section__heading">
          <h2 id="home-services-title">What we do</h2>
          <Link href="/services" className="text-link">
            All services <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <ul className="home-service-list">
          {PRIMARY_SERVICES.map((service) => (
            <li key={service.id}>
              <div>
                <h3><Link href={service.url}>{service.title}</Link></h3>
              </div>
              <Link href={service.url} className="home-service-list__link" aria-label={`Details: ${service.title}`}>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>

        {moreCategories.length > 0 && (
          <nav className="more-services" aria-label="More service categories">
            <h3>More services</h3>
            <ul>
              {moreCategories.map((category) => {
                const href = `/services/${category.slug}`;

                return (
                  <li key={category.id}>
                    <Link href={href}>
                      <span>{category.title}</span>
                      <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}
