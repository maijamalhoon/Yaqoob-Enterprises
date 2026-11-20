import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  note?: string;
  tone?: "teal" | "blue" | "violet" | "amber";
  series?: readonly number[];
};

/** Accessible KPI with decorative trend only when actual daily values are available. */
export function AdminMetricCard({ label, value, icon: Icon, note, tone = "teal", series }: Props) {
  const valid = (series || []).filter((n) => Number.isFinite(n) && n >= 0);
  const maximum = Math.max(1, ...valid);
  const points = valid.map((count, index) => {
    const x = 2 + index * (116 / Math.max(1, valid.length - 1));
    const y = 33 - count / maximum * 27;
    return x.toFixed(1) + "," + y.toFixed(1);
  }).join(" ");

  return (
    <article className={"admin-metric-card admin-metric-card--" + tone}>
      <div className="admin-metric-card__head">
        <span>{label}</span>
        <span className="admin-metric-card__icon"><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></span>
      </div>
      <div className="admin-metric-card__body">
        <strong>{typeof value === "number" ? value.toLocaleString("en-PK") : value}</strong>
        {valid.length > 1 && valid.some((n) => n > 0) && (
          <svg className="admin-metric-card__sparkline" viewBox="0 0 120 40" aria-hidden="true" focusable="false">
            <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
        )}
      </div>
      {note && <p>{note}</p>}
    </article>
  );
}
