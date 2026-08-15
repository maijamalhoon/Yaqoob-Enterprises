export type ServiceStatus =
  | "active"
  | "appointment_only"
  | "temporarily_unavailable"
  | "coming_soon"
  | "hidden";

export type BusinessSettings = {
  business_name: string;
  tagline: string;
  phone_display: string;
  phone_e164: string;
  whatsapp_e164: string;
  address: string;
  map_url: string;
  pricing_message: string;
  concept_image_notice: string;
};

export type BusinessHourPeriod = {
  opens_at: string;
  closes_at: string;
  closes_next_day?: boolean;
};

export type BusinessHour = {
  id: string;
  weekday: number;
  label: string;
  opens_at: string | null;
  closes_at: string | null;
  periods: BusinessHourPeriod[];
  is_closed: boolean;
  display_order: number;
};

export type Service = {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  short_description: string;
  detailed_description: string;
  status: ServiceStatus;
  available_at_shop: boolean;
  whatsapp_request: boolean;
  pickup_available: boolean;
  delivery_available: boolean;
  doorstep_available: boolean;
  appointment_required: boolean;
  requirements: string[];
  important_note: string;
  display_order: number;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string;
};

export type ServiceCategory = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_key: string;
  display_order: number;
  is_active: boolean;
  updated_at: string;
  services?: Service[];
};

export type CoverageArea = {
  id: string;
  name: string;
  delivery_available: boolean;
  doorstep_biometric_available: boolean;
  pickup_available: boolean;
  extra_charge_may_apply: boolean;
  notes: string;
  display_order: number;
  is_active: boolean;
};

export type GalleryImage = {
  id: string;
  storage_path: string;
  alt_text: string;
  caption: string;
  media_kind: "concept" | "real";
  is_featured: boolean;
  display_order: number;
  focal_x: number;
  focal_y: number;
  is_active: boolean;
};

export type Announcement = {
  id: string;
  title: string;
  message: string;
  link_label: string | null;
  link_url: string | null;
};
