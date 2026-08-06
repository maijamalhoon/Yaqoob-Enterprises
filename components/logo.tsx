import Link from "next/link";

type LogoProps = {
  compact?: boolean;
  inverse?: boolean;
  href?: string;
};

export function Logo({ compact = false, inverse = false, href = "/" }: LogoProps) {
  return (
    <Link className={`brand-logo ${compact ? "brand-logo--compact" : ""}`} href={href} aria-label="Yaqoob Enterprises home">
      <svg className="brand-logo__mark" viewBox="0 0 120 92" role="img" aria-label="YE monogram">
        <path d="M6 6h25l24 28L79 6h35L67 59v27H43V59L6 6Z" fill={inverse ? "#fff" : "#082a5e"} />
        <path d="M64 38h49L101 55H78l-7 8h36L96 82H51l13-15 14-17-14-12Z" fill={inverse ? "#fff" : "#08766f"} />
        <path d="M57 83 87 47" stroke={inverse ? "#082a5e" : "#fff"} strokeWidth="7" strokeLinecap="square" />
      </svg>
      {!compact && (
        <span className="brand-logo__text">
          <strong>Yaqoob</strong>
          <span>Enterprises</span>
        </span>
      )}
    </Link>
  );
}
