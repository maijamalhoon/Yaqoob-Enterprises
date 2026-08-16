"use client";

import { useState } from "react";

const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 0.82;
const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const INITIAL_STATUS = "JPG, PNG or WebP · up to 20 MB · resized in your browser when supported";

function webpName(name: string) {
  const base = name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "shop-photo";
  return `${base}.webp`;
}

async function optimizeImage(file: File) {
  if (!SUPPORTED_TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG or WebP image.");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("Choose an image smaller than 20 MB.");
  }

  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("This browser cannot prepare the image for upload.");
    context.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", WEBP_QUALITY));
    if (!blob) throw new Error("This browser could not optimize the image.");

    const shouldKeepOriginal = scale === 1 && file.size <= blob.size && file.size <= 4 * 1024 * 1024;
    if (shouldKeepOriginal) return file;
    return new File([blob], webpName(file.name), { type: "image/webp", lastModified: Date.now() });
  } finally {
    bitmap.close();
  }
}

export function OptimizedImageInput({
  disabled = false,
  onBusyChange,
  onFileReady,
}: {
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
  onFileReady?: (file: File | null) => void;
}) {
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <input
        type="file"
        name="file"
        accept="image/jpeg,image/png,image/webp"
        required
        disabled={disabled || busy}
        aria-describedby="gallery-image-upload-status"
        onChange={async (event) => {
          const input = event.currentTarget;
          const source = input.files?.[0];
          if (!source) {
            onFileReady?.(null);
            setStatus(INITIAL_STATUS);
            return;
          }

          setBusy(true);
          onBusyChange?.(true);
          onFileReady?.(null);
          setStatus("Preparing image…");
          try {
            const optimized = await optimizeImage(source);
            if (optimized.size > MAX_UPLOAD_BYTES) {
              throw new Error("The prepared image is still larger than 8 MB. Choose a smaller image.");
            }
            onFileReady?.(optimized);
            const saved = Math.max(0, source.size - optimized.size);
            const savedPercent = source.size > 0 ? Math.round((saved / source.size) * 100) : 0;
            setStatus(
              optimized === source
                ? `Ready · ${(optimized.size / 1024 / 1024).toFixed(1)} MB · already efficient`
                : `Ready · ${(optimized.size / 1024 / 1024).toFixed(1)} MB · ${savedPercent}% smaller`,
            );
          } catch (error) {
            const canUseOriginal = SUPPORTED_TYPES.has(source.type) && source.size <= MAX_UPLOAD_BYTES;
            if (canUseOriginal) {
              onFileReady?.(source);
              setStatus(`Ready · ${(source.size / 1024 / 1024).toFixed(1)} MB · original file will be uploaded`);
            } else {
              input.value = "";
              onFileReady?.(null);
              setStatus(error instanceof Error ? error.message : "Could not prepare this image.");
            }
          } finally {
            setBusy(false);
            onBusyChange?.(false);
          }
        }}
      />
      <small id="gallery-image-upload-status" role="status" aria-live="polite">
        {busy ? "Preparing image…" : status}
      </small>
    </div>
  );
}
