type TrafficPoint = {
  key: string;
  label: string;
  count: number;
};

type AdminTrafficChartProps = {
  data: TrafficPoint[];
  maximum: number;
  rangeDays: number;
};

function formatMetric(value: number) {
  return value.toLocaleString("en-PK", { maximumFractionDigits: 1 });
}

export function AdminTrafficChart({ data, maximum, rangeDays }: AdminTrafficChartProps) {
  const width = 920;
  const height = 270;
  const left = 56;
  const right = 18;
  const top = 18;
  const bottom = 28;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const safeMaximum = Math.max(1, maximum);
  const points = data.map((entry, index) => ({
    ...entry,
    x: left + (data.length <= 1 ? 0 : (index / (data.length - 1)) * plotWidth),
    y: top + plotHeight - (entry.count / safeMaximum) * plotHeight,
  }));
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${(top + plotHeight).toFixed(2)} L ${points[0].x.toFixed(2)} ${(top + plotHeight).toFixed(2)} Z`
    : "";
  const middle = Math.floor((data.length - 1) / 2);
  const ticks = [
    { value: safeMaximum, y: top + 4 },
    { value: safeMaximum / 2, y: top + plotHeight / 2 + 4 },
    { value: 0, y: top + plotHeight + 4 },
  ];

  return (
    <div className="admin-traffic-visual">
      <svg
        className="admin-line-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Daily page views over ${rangeDays} days. ${data.reduce((sum, item) => sum + item.count, 0).toLocaleString("en-PK")} total page views; chart values are based on tracked page-view events.`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="admin-traffic-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--admin-accent)" stopOpacity=".25" />
            <stop offset="100%" stopColor="var(--admin-accent)" stopOpacity=".015" />
          </linearGradient>
        </defs>
        {ticks.map((tick, index) => (
          <g key={index}>
            <line className="admin-line-chart__grid" x1={left} y1={tick.y - 4} x2={width - right} y2={tick.y - 4} />
            <text className="admin-line-chart__tick" x={left - 12} y={tick.y} textAnchor="end">{formatMetric(tick.value)}</text>
          </g>
        ))}
        {data.filter((_, index) => index === 0 || index === Math.floor((data.length - 1) / 4) || index === Math.floor((data.length - 1) / 2) || index === Math.floor((data.length - 1) * 3 / 4) || index === data.length - 1).map((entry, index) => {
          const point = points[data.indexOf(entry)];
          return <line key={entry.key + index} className="admin-line-chart__vertical-grid" x1={point.x} y1={top} x2={point.x} y2={top + plotHeight} />;
        })}
        {areaPath && <path className="admin-line-chart__area" d={areaPath} />}
        {linePath && <path className="admin-line-chart__line" d={linePath} />}
        {points.map((point) => (
          <g key={point.key} className="admin-line-chart__point">
            <circle cx={point.x} cy={point.y} r={data.length > 45 ? 2.2 : 3.2} />
            <title>{point.label}: {point.count.toLocaleString("en-PK")} page views</title>
          </g>
        ))}
      </svg>
      <div className="admin-line-chart__dates" aria-hidden="true">
        <span>{data[0]?.label || "—"}</span>
        <span>{data[middle]?.label || "—"}</span>
        <span>{data[data.length - 1]?.label || "—"}</span>
      </div>
    </div>
  );
}
