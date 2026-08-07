"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ServiceIcon } from "@/components/service-icon";
import type { ServiceCategory } from "@/lib/types";

const ROTATION_MS = 5000;
const TRANSITION_MS = 650;

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

const motionCaptions: Record<string, string> = {
  "printing-photos": "From file to finished print",
  "typing-online": "Clear documents, ready to use",
  documents: "Prepared, checked and formatted",
  biometric: "Verification with a clear process",
  payments: "Supported transfers made simpler",
  tickets: "Search, compare and book",
  retail: "Everyday essentials in one stop",
  laptop: "Setup and troubleshooting support",
};

function categoryHighlights(category: ServiceCategory) {
  const services = category.services || [];
  const options = [
    ["At the shop", services.some((service) => service.available_at_shop)],
    ["WhatsApp request", services.some((service) => service.whatsapp_request)],
    ["Pickup", services.some((service) => service.pickup_available)],
    ["Delivery", services.some((service) => service.delivery_available)],
    ["Home visit", services.some((service) => service.doorstep_available)],
    ["Appointment", services.some((service) => service.appointment_required)],
  ] as const;

  const active = options.filter(([, enabled]) => enabled).map(([label]) => label);
  return active.length > 0 ? active.slice(0, 3) : ["Requirements confirmed", "Clear quotation"];
}

function ServiceMotion({ category }: { category: ServiceCategory }) {
  return (
    <div className={`service-motion service-motion--${category.slug}`} aria-hidden="true">
      <span className="service-motion__halo" />
      <span className="service-motion__ring service-motion__ring--one" />
      <span className="service-motion__ring service-motion__ring--two" />
      <span className="service-motion__icon"><ServiceIcon iconKey={category.icon_key} size={76} /></span>
      <span className="service-motion__scan" />
      <span className="service-motion__line service-motion__line--one" />
      <span className="service-motion__line service-motion__line--two" />
      <span className="service-motion__line service-motion__line--three" />
      <span className="service-motion__dot service-motion__dot--one" />
      <span className="service-motion__dot service-motion__dot--two" />
      <span className="service-motion__dot service-motion__dot--three" />
      <small>{motionCaptions[category.slug] || "A clear service, step by step"}</small>
    </div>
  );
}

function FeatureCard({
  category,
  index,
  className,
}: {
  category: ServiceCategory;
  index: number;
  className: string;
}) {
  const count = category.services?.length || 0;
  const highlights = categoryHighlights(category);

  return (
    <Link
      className={`service-feature-card ${className}`}
      data-tone={String(index % 4)}
      href={`/services/${category.slug}`}
      aria-label={`Open ${category.title}`}
    >
      <div className="service-feature-card__copy">
        <div className="service-feature-card__meta">
          <span>Service {String(index + 1).padStart(2, "0")}</span>
          <span>{count} {count === 1 ? "option" : "options"}</span>
        </div>
        <h3>{category.title}</h3>
        <p>{category.description}</p>
        <div className="service-feature-card__chips" aria-label="Availability highlights">
          {highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}
        </div>
        <span className="service-feature-card__action">Explore this service <ArrowRight size={18} /></span>
      </div>
      <div className="service-feature-card__visual">
        <ServiceMotion category={category} />
      </div>
    </Link>
  );
}

export function ServiceShowcase({ categories }: { categories: ServiceCategory[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showAll, setShowAll] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef<number | null>(null);

  const paused = manualPaused || interactionPaused || showAll || !inView || reduceMotion;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.16 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
  }, []);

  const changeTo = useCallback((nextIndex: number, nextDirection: 1 | -1) => {
    if (categories.length < 2 || nextIndex === currentIndex) return;
    if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);

    setDirection(nextDirection);
    if (!reduceMotion) setOutgoingIndex(currentIndex);
    setCurrentIndex(nextIndex);

    if (!reduceMotion) {
      cleanupTimerRef.current = setTimeout(() => setOutgoingIndex(null), TRANSITION_MS + 80);
    } else {
      setOutgoingIndex(null);
    }
  }, [categories.length, currentIndex, reduceMotion]);

  const goNext = useCallback(() => {
    changeTo((currentIndex + 1) % categories.length, 1);
  }, [categories.length, changeTo, currentIndex]);

  const goPrevious = useCallback(() => {
    changeTo((currentIndex - 1 + categories.length) % categories.length, -1);
  }, [categories.length, changeTo, currentIndex]);

  useEffect(() => {
    if (paused || categories.length < 2) return;
    const timer = setTimeout(goNext, ROTATION_MS);
    return () => clearTimeout(timer);
  }, [categories.length, currentIndex, goNext, paused]);

  if (categories.length === 0) return null;

  const activeCategory = categories[currentIndex];
  const outgoingCategory = outgoingIndex === null ? null : categories[outgoingIndex];

  return (
    <section
      className={`section services-showcase services-showcase--interactive${showAll ? " is-showing-all" : ""}`}
      id="services"
      ref={sectionRef}
    >
      <div className="container">
        <div className="section-heading section-heading--split service-showcase-heading">
          <div>
            <span className="eyebrow">Find a service</span>
            <h2>Choose the service you need.</h2>
          </div>
          <div className="service-showcase-heading__side">
            <p>Explore each category, or open the full list whenever you want to compare everything at once.</p>
            <button
              className="service-showcase-toggle"
              type="button"
              aria-expanded={showAll}
              aria-controls="all-service-categories"
              onClick={() => setShowAll((value) => !value)}
            >
              {showAll ? "Show featured services" : "View all services"}
              {showAll ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
            </button>
          </div>
        </div>
      </div>

      {!showAll && (
        <div
          className={`service-experience${paused ? " is-paused" : ""}`}
          onMouseEnter={() => setInteractionPaused(true)}
          onMouseLeave={() => setInteractionPaused(false)}
          onFocusCapture={() => setInteractionPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteractionPaused(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              goNext();
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              goPrevious();
            }
          }}
          onTouchStart={(event) => {
            touchStartRef.current = event.touches[0]?.clientX ?? null;
            setInteractionPaused(true);
          }}
          onTouchEnd={(event) => {
            const start = touchStartRef.current;
            const end = event.changedTouches[0]?.clientX;
            touchStartRef.current = null;
            if (start !== null && typeof end === "number") {
              const delta = end - start;
              if (Math.abs(delta) > 45) {
                if (delta < 0) goNext();
                else goPrevious();
              }
            }
            setInteractionPaused(false);
          }}
        >
          <div className="service-stage">
            <div className="service-stage__viewport">
              {outgoingCategory && outgoingIndex !== null && (
                <FeatureCard
                  category={outgoingCategory}
                  index={outgoingIndex}
                  className={direction === 1 ? "is-exiting-left" : "is-exiting-right"}
                />
              )}
              <FeatureCard
                key={`service-${currentIndex}`}
                category={activeCategory}
                index={currentIndex}
                className={direction === 1 ? "is-entering-right" : "is-entering-left"}
              />
            </div>

            <div className="service-stage__controls">
              <div className="service-stage__counter" aria-label={`Service ${currentIndex + 1} of ${categories.length}`}>
                <strong>{String(currentIndex + 1).padStart(2, "0")}</strong>
                <span>/ {String(categories.length).padStart(2, "0")}</span>
              </div>
              <div className="service-stage__dots" aria-label="Choose a service category">
                {categories.map((category, index) => (
                  <button
                    key={category.id}
                    type="button"
                    className={index === currentIndex ? "is-active" : ""}
                    aria-label={`Show ${category.title}`}
                    aria-current={index === currentIndex ? "true" : undefined}
                    onClick={() => changeTo(index, index >= currentIndex ? 1 : -1)}
                  />
                ))}
              </div>
              <div className="service-stage__buttons">
                <button type="button" onClick={goPrevious} aria-label="Previous service"><ArrowLeft size={18} /></button>
                <button
                  type="button"
                  className="service-stage__pause"
                  onClick={() => setManualPaused((value) => !value)}
                  aria-label={manualPaused ? "Resume automatic service rotation" : "Pause automatic service rotation"}
                  aria-pressed={manualPaused}
                >
                  {manualPaused ? <Play size={17} /> : <Pause size={17} />}
                </button>
                <button type="button" onClick={goNext} aria-label="Next service"><ArrowRight size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAll && (
        <div className="container service-all-services" id="all-service-categories">
          <div className="category-grid category-grid--bento category-grid--final service-all-grid">
            {categories.map((category, index) => {
              const count = category.services?.length || 0;
              return (
                <Link className="category-card category-card--final" key={category.id} href={`/services/${category.slug}`}>
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
      )}
    </section>
  );
}
