import { MapPin, MessageCircle, Phone } from "lucide-react";
import styles from "./brand-icon.module.css";

export type BrandIconName = "whatsapp" | "phone" | "location";

interface BrandIconProps {
  name: BrandIconName;
  size?: number;
  badge?: boolean;
  className?: string;
  ariaHidden?: boolean;
}

export function BrandIcon({
  name,
  size = 18,
  badge = true,
  className = "",
  ariaHidden = true,
}: BrandIconProps) {
  if (name === "whatsapp") {
    if (!badge) {
      return (
        <MessageCircle
          size={size}
          className={`${styles.iconWhatsapp} ${className}`}
          strokeWidth={2.2}
          aria-hidden={ariaHidden}
        />
      );
    }
    return (
      <span
        className={`${styles.badge} ${styles.badgeWhatsapp} ${className}`}
        aria-hidden={ariaHidden}
      >
        <MessageCircle
          size={Math.round(size * 0.9)}
          className={styles.innerIconWhatsapp}
          strokeWidth={2.2}
          fill="currentColor"
        />
      </span>
    );
  }

  if (name === "phone") {
    if (!badge) {
      return (
        <Phone
          size={size}
          className={`${styles.iconPhone} ${className}`}
          strokeWidth={2.2}
          aria-hidden={ariaHidden}
        />
      );
    }
    return (
      <span
        className={`${styles.badge} ${styles.badgePhone} ${className}`}
        aria-hidden={ariaHidden}
      >
        <Phone
          size={Math.round(size * 0.85)}
          className={styles.innerIconPhone}
          strokeWidth={2.2}
          fill="currentColor"
        />
      </span>
    );
  }

  if (name === "location") {
    if (!badge) {
      return (
        <MapPin
          size={size}
          className={`${styles.iconLocation} ${className}`}
          strokeWidth={2.2}
          aria-hidden={ariaHidden}
        />
      );
    }
    return (
      <span
        className={`${styles.badge} ${styles.badgeLocation} ${className}`}
        aria-hidden={ariaHidden}
      >
        <MapPin
          size={Math.round(size * 0.85)}
          className={styles.innerIconLocation}
          strokeWidth={2.2}
        />
      </span>
    );
  }

  return null;
}
