"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/lib/types";
import { SUPABASE_URL } from "@/lib/env";

interface StitchShopLoopProps {
  galleryImages: GalleryImage[];
  locationLabel: string;
}

export function StitchShopLoop({ galleryImages, locationLabel }: StitchShopLoopProps) {
  const slides = galleryImages.filter((image) => image.is_active);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (slides.length === 0) return null;

  const currentImage = slides[currentIndex] || slides[0];
  const imageUrl =
    SUPABASE_URL.replace(/\/$/, "") +
    "/storage/v1/object/public/shop-media/" +
    currentImage.storage_path;
  const focalX = currentImage.focal_x ?? 50;
  const focalY = currentImage.focal_y ?? 50;

  return (
    <figure className="shop-gallery" aria-label="Yaqoob Enterprises photos">
      <div className="shop-gallery__image">
        <Image
          src={imageUrl}
          alt={currentImage.alt_text || "Yaqoob Enterprises shop"}
          fill
          priority={currentIndex === 0}
          sizes="(max-width: 768px) 100vw, 42vw"
          style={{ objectPosition: focalX + "% " + focalY + "%" }}
        />
        {slides.length > 1 && (
          <div className="shop-gallery__controls">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => setCurrentIndex((index) => (index - 1 + slides.length) % slides.length)}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <span aria-live="polite">
              {currentIndex + 1} of {slides.length}
            </span>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setCurrentIndex((index) => (index + 1) % slides.length)}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      <figcaption className="shop-gallery__caption">
        <span>{currentImage.caption || currentImage.alt_text || "Yaqoob Enterprises"}</span>
        <span>{locationLabel}</span>
      </figcaption>
    </figure>
  );
}
