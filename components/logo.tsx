import Link from "next/link";

type LogoProps = {
  compact?: boolean;
  inverse?: boolean;
  href?: string;
  businessName?: string;
};

export function Logo({
  compact = false,
  inverse = false,
  href = "/",
  businessName = "Yaqoob Enterprises",
}: LogoProps) {
  const src = compact ? "/brand/logo-icon.svg" : "/brand/logo-horizontal.svg";

  return (
    <Link
      className={`brand-logo ${compact ? "brand-logo--compact" : ""} ${inverse ? "brand-logo--inverse" : ""}`}
      href={href}
      aria-label={`${businessName} home`}
    >
      {/* Direct SVG delivery is intentional here: it is tiny, reliable, and avoids unnecessary image-optimization usage. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="brand-logo__image"
        src={src}
        width={compact ? 1076 : 2740}
        height={compact ? 668 : 740}
        alt={businessName}
      />
    </Link>
  );
}
