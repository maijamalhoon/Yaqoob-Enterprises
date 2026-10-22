import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { ServiceCategory } from "@/lib/types";
import { whatsappUrl } from "@/lib/data";

interface StitchServicesProps {
  categories: ServiceCategory[];
  whatsappNumber: string;
}

interface PrimaryService {
  id: string;
  title: string;
  shortDesc: string;
  url: string;
  whatsappMessage: string;
}

const PRIMARY_SERVICES: PrimaryService[] = [
  {
    id: "printing",
    title: "Printing",
    shortDesc: "Color and black-and-white laser printing for documents, assignments and office files.",
    url: "/printing",
    whatsappMessage: "Hello Yaqoob Enterprises, I need document printing. ",
  },
  {
    id: "photocopying",
    title: "Photocopying",
    shortDesc: "Black-and-white and colour copies for documents, notes, books and IDs. Single and bulk orders.",
    url: "/photocopying",
    whatsappMessage: "Hello Yaqoob Enterprises, I need photocopying. ",
  },
  {
    id: "color-printing",
    title: "Color printing",
    shortDesc: "Color prints and photocopies for slides, certificates and project covers.",
    url: "/color-printing",
    whatsappMessage: "Hello Yaqoob Enterprises, I need colour printing. ",
  },
  {
    id: "notes-printing",
    title: "Notes and assignments",
    shortDesc: "Printing for school, college and university notes and assignments.",
    url: "/notes-printing",
    whatsappMessage: "Hello Yaqoob Enterprises, I need notes or assignments printed. ",
  },
  {
    id: "bulk-printing",
    title: "Bulk printing",
    shortDesc: "Printing and photocopying for schools, colleges, universities and offices. Ask for bulk rates.",
    url: "/bulk-printing",
    whatsappMessage: "Hello Yaqoob Enterprises, I need a bulk print or photocopy quote. ",
  },
  {
    id: "photo-printing",
    title: "Passport photos",
    shortDesc: "Passport-size photos with white or blue backgrounds, usually ready in 5 minutes.",
    url: "/photo-printing",
    whatsappMessage: "Hello Yaqoob Enterprises, I need passport photos. ",
  },
  {
    id: "office-printing",
    title: "Office printing",
    shortDesc: "Printing and photocopying for contracts, proposals, forms and office documents.",
    url: "/office-printing",
    whatsappMessage: "Hello Yaqoob Enterprises, I have an office printing requirement. ",
  },
  {
    id: "nadra-esahulat",
    title: "NADRA e-Sahulat biometrics",
    shortDesc: "Supported general, vehicle-transfer, FBR Sales Tax and PSW biometric cases.",
    url: "/nadra-esahulat",
    whatsappMessage: "Hello Yaqoob Enterprises, I need NADRA e-Sahulat biometric verification. ",
  },
];

export function StitchServices({ categories, whatsappNumber }: StitchServicesProps) {
  const moreCategories = categories.filter(
    (category) => category.slug !== "printing-photos" && category.slug !== "biometric",
  );

  return (
    <section
      id="services"
      className="py-12 sm:py-20 bg-slate-50/70 border-b border-slate-200"
      data-purpose="services"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7 sm:mb-9">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Printing, copying and biometrics
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
              Choose a service for details, requirements and current availability.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center gap-2 text-slate-900 font-bold text-sm hover:text-[#0E7490] transition"
          >
            <span>All services</span>
            <ArrowRight className="w-4 h-4 text-[#0E7490]" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
          {PRIMARY_SERVICES.map((service) => (
            <li key={service.id} id={"service-card-" + service.id} className="border-b border-slate-200 py-3">
              <div className="flex min-h-11 items-center justify-between gap-3">
                <h3 className="min-w-0 text-base font-semibold text-slate-900 leading-snug">
                  <Link href={service.url} className="hover:text-[#0E7490]">
                    {service.title}
                  </Link>
                </h3>
                <a
                  href={whatsappUrl(whatsappNumber, service.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={"Ask about " + service.title + " on WhatsApp"}
                  className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#0E7490]"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
              </div>
              <p className="max-w-xl text-sm text-slate-600 leading-relaxed">
                {service.shortDesc}
              </p>
            </li>
          ))}
        </ul>

        {moreCategories.length > 0 && (
          <nav className="mt-7 sm:mt-9 border-t border-slate-200 pt-5" aria-label="More services">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">More services</h3>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {moreCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={"/services/" + category.slug}
                    className="inline-flex min-h-11 items-center text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-[#0E7490] hover:decoration-current"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}
