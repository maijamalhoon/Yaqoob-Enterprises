export type GalleryKind = "real" | "concept";

function stringField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function galleryMediaKind(formData: FormData): GalleryKind {
  const kind = stringField(formData, "media_kind");
  if (kind !== "real" && kind !== "concept") {
    throw new Error("Select a valid image type.");
  }
  return kind;
}

export function galleryAltText(formData: FormData) {
  const value = stringField(formData, "alt_text");
  if (value.length < 3 || value.length > 180) {
    throw new Error("Image description must be between 3 and 180 characters.");
  }
  return value;
}

export function galleryOrder(formData: FormData) {
  const raw = stringField(formData, "display_order");
  if (!/^\d{1,5}$/.test(raw)) {
    throw new Error("Image display order must be a whole number from 0 to 10000.");
  }
  const n = Number(raw);
  if (n > 10_000) throw new Error("Image display order must be between 0 and 10000.");
  return n;
}

export function galleryFocalPoint(formData: FormData, key: "focal_x" | "focal_y") {
  const value = stringField(formData, key);
  if (!/^\d{1,3}(?:\.\d{1,2})?$/.test(value)) {
    throw new Error("Image focal position must be between 0 and 100.");
  }
  const n = Number(value);
  if (n > 100) throw new Error("Image focal position must be between 0 and 100.");
  return n;
}

export function galleryImageFields(formData: FormData) {
  return {
    alt_text: galleryAltText(formData),
    media_kind: galleryMediaKind(formData),
    display_order: galleryOrder(formData),
    focal_x: galleryFocalPoint(formData, "focal_x"),
    focal_y: galleryFocalPoint(formData, "focal_y"),
  };
}
