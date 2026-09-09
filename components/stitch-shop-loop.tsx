"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, CheckCircle2, Camera } from "lucide-react";
import type { GalleryImage } from "@/lib/types";

interface ShopSlide {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  tag: string;
  isReal: boolean;
}

interface StitchShopLoopProps {
  galleryImages: GalleryImage[];
  locationLabel: string;
  whatsappLink: string;
}

// Curated default high-quality storefront & counter scenes if none uploaded yet
const FALLBACK_SLIDES: ShopSlide[] = [
  {
    id: "shop-1",
    url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
    title: "Yaqoob Enterprises Storefront",
    subtitle: "Street No. 1, Sector B, Akhtar Colony, Karachi",
    tag: "Physical Shop Front",
    isReal: true,
  },
  {
    id: "shop-2",
    url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    title: "NADRA e-Sahulat Biometric Desk",
    subtitle: "Instant biometric, FBR, and vehicle verification terminal",
    tag: "Biometric Terminal",
    isReal: true,
  },
  {
    id: "shop-3",
    url: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1200&q=80",
    title: "High-Speed Laser Printing & Copy",
    subtitle: "Urgent documents, color prints, scans & lamination",
    tag: "Print & Copy Counter",
    isReal: true,
  },
  {
    id: "shop-4",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    title: "Online Applications & Documentation",
    subtitle: "Job portals, admissions, legal agreements & forms",
    tag: "Customer Support Desk",
    isReal: true,
  },
];

export function StitchShopLoop({ galleryImages, locationLabel, whatsappLink }: StitchShopLoopProps) {
  // Convert Supabase gallery images if available
  const activeDbImages: ShopSlide[] = galleryImages
    .filter((img) => img.is_active)
    .map((img) => ({
      id: img.id,
      url: `https://kzikyufuyanfjlddyepo.supabase.co/storage/v1/object/public/shop-media/${img.storage_path}`,
      title: img.alt_text || "Yaqoob Enterprises Shop View",
      subtitle: locationLabel || "Akhtar Colony, Karachi",
      tag: img.media_kind === "real" ? "Real Shop Photo" : "Verified Shop",
      isReal: true,
    }));

  const slides: ShopSlide[] = activeDbImages.length > 0 ? activeDbImages : FALLBACK_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play timer (4.5s), pauses on hover
  useEffect(() => {
    if (slides.length <= 1 || isHovered) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [slides.length, isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div
      id="shop-photos-loop-container"
      className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-900 group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Shop photos carousel"
    >
      {/* Aspect ratio frame (16/10 on desktop, 4/3 on mobile) */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
            }`}
          >
            <Image
              src={slide.url}
              alt={slide.title}
              fill
              priority={idx === 0}
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              referrerPolicy="no-referrer"
            />
            {/* Gradient Overlays for High Contrast Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/20" />
          </div>
        ))}

        {/* Top Badges */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-semibold shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{currentSlide.tag}</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-slate-200 text-[11px] font-medium shadow-md">
            <Camera className="w-3 h-3 text-teal-400" />
            <span>
              {currentIndex + 1} / {slides.length}
            </span>
          </div>
        </div>

        {/* Navigation Arrow Controls */}
        {slides.length > 1 && (
          <>
            <button
              id="shop-loop-prev-btn"
              onClick={handlePrev}
              aria-label="Previous shop photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/70 hover:bg-slate-900/90 text-white flex items-center justify-center border border-white/20 transition opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-lg active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              id="shop-loop-next-btn"
              onClick={handleNext}
              aria-label="Next shop photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/70 hover:bg-slate-900/90 text-white flex items-center justify-center border border-white/20 transition opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-lg active:scale-95"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}

        {/* Bottom Caption Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20 text-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
            <div className="space-y-0.5">
              <h3
                className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug drop-shadow-md"
                style={{ color: "#ffffff" }}
              >
                {currentSlide.title}
              </h3>
              <p
                className="text-xs sm:text-sm text-slate-300 font-normal drop-shadow-sm flex items-center gap-1.5"
                style={{ color: "#cbd5e1" }}
              >
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>{currentSlide.subtitle}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1 sm:pt-0 shrink-0">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                style={{ color: "#ffffff" }}
              >
                <span>WhatsApp</span>
              </a>
              <a
                href="#visit-shop"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-sm"
                style={{ color: "#ffffff" }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Visit Shop</span>
              </a>
            </div>
          </div>

          {/* Dots Indicator */}
          {slides.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {slides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    dotIdx === currentIndex ? "w-6 bg-teal-400" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
