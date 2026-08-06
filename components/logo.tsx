import Link from "next/link";

type LogoProps = {
  compact?: boolean;
  inverse?: boolean;
  href?: string;
};

export function Logo({ compact = false, inverse = false, href = "/" }: LogoProps) {
  const src = compact
    ? inverse
      ? "/brand/logo-icon-white.svg"
      : "/brand/logo-icon.svg"
    : "/brand/logo-horizontal.svg";

  return (
    <Link
      className={`brand-logo ${compact ? "brand-logo--compact" : ""} ${inverse ? "brand-logo--inverse" : ""}`}
      href={href}
      aria-label="Yaqoob Enterprises home"
    >
      <img
        className="brand-logo__image"
        src={src}
        width={compact ? 468 : 940}
        height={compact ? 290 : 250}
        alt="Yaqoob Enterprises"
      />
    </Link>
  );
}
