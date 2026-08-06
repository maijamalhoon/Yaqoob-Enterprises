import Link from "next/link";

type LogoProps = {
  compact?: boolean;
  inverse?: boolean;
  href?: string;
};

export function Logo({ compact = false, inverse = false, href = "/" }: LogoProps) {
  const navy = inverse ? "#ffffff" : "#001f56";
  const teal = inverse ? "#ffffff" : "#016773";

  return (
    <Link className={`brand-logo ${compact ? "brand-logo--compact" : ""}`} href={href} aria-label="Yaqoob Enterprises home">
      <svg className="brand-logo__mark" viewBox="0 0 262 171" role="img" aria-label="Yaqoob Enterprises YE monogram">
        <polygon
          points="14,14 80,91 80,157 169,48 206,48 229,13 149,13 110,58 70,13"
          fill={navy}
        />
        <polygon
          points="248,64 176,64 100,158 246,158 225,124 163,124 162,101 225,100"
          fill={teal}
        />
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
