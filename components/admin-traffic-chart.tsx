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
  const height = 250;
  const left = 6;
  const right = 6;
  const top = 12;
  const bottom = 12;
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
  const gridYs = [top, top + plotHeight / 2, top + plotHeight];
  const verticalIndices = [...new Set([
    0,
    Math.floor((data.length - 1) / 4),
    Math.floor((data.length - 1) / 2),
    Math.floor(((data.length - 1) * 3) / 4),
    data.length - 1,
  ])].filter((index) => index >= 0);

  return (
    <div className="admin-traffic-visual">
      <div className="admin-line-chart__layout">
        <div className="admin-line-chart__scale" aria-hidden="true">
          <span>{formatMetric(safeMaximum)}</span>
          <span>{formatMetric(safeMaximum / 2)}</span>
          <span>0</span>
        </div>
        <svg
          className="admin-line-chart"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Daily page views over ${rangeDays} days. ${data.reduce((sum, item) => sum + item.count, 0).toLocaleString("en-PK")} total page views; values are based on tracked page-view events.`}
        >
          <defs>
            <linearGradient id="admin-traffic-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--admin-accent)" stopOpacity=".28" />
              <stop offset="100%" stopColor="var(--admin-accent)" stopOpacity=".015" />
            </linearGradient>
          </defs>
          {gridYs.map((y, index) => <line key={index} className="admin-line-chart__grid" x1={left} y1={y} x2={width - right} y2={y} />)}
          {verticalIndices.map((index) => {
            const point = points[index];
            return point ? <line key={data[index]?.key || index} className="admin-line-chart__vertical-grid" x1={point.x} y1={top} x2={point.x} y2={top + plotHeight} /> : null;
          })}
          {areaPath && <path className="admin-line-chart__area" d={areaPath} />}
          {linePath && <path className="admin-line-chart__line" d={linePath} />}
          {points.map((point) => (
            <g key={point.key} className="admin-line-chart__point">
              <circle cx={point.x} cy={point.y} r={data.length > 45 ? 2.1 : 3.1} />
              <title>{point.label}: {point.count.toLocaleString("en-PK")} page views</title>
            </g>
          ))}
        </svg>
      </div>
      <div className="admin-line-chart__dates" aria-hidden="true">
        <span>{data[0]?.label || "—"}</span>
        <span>{data[middle]?.label || "—"}</span>
        <span>{data[data.length - 1]?.label || "—"}</span>
      </div>
    </div>
  );
}
