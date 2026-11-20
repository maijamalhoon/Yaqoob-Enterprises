"use client";
import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Minus, MoveHorizontal } from "lucide-react";

export type TrafficPoint = { key: string; label: string; count: number };
type Props = { points: TrafficPoint[]; partial?: boolean };
const WIDTH = 840, HEIGHT = 260, LEFT = 44, RIGHT = 20, TOP = 32, BOTTOM = 39;

export function AdminTrendChart({ points, partial = false }: Props) {
  const [range, setRange] = useState<7 | 30>(30);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const values = points.slice(-range);
  const total = values.reduce((sum, point) => sum + point.count, 0);
  const max = Math.max(1, ...values.map((point) => point.count));
  const average = values.length ? Math.round(total / values.length) : 0;
  const lastWeek = points.slice(-7).reduce((sum, p) => sum + p.count, 0);
  const previousWeek = points.length >= 14 ? points.slice(-14, -7).reduce((sum, p) => sum + p.count, 0) : 0;
  const change = !partial && previousWeek > 0 ? Math.round((lastWeek - previousWeek) / previousWeek * 100) : null;
  const plotWidth = WIDTH - LEFT - RIGHT, plotHeight = HEIGHT - TOP - BOTTOM;
  const chart = values.map((p, i) => ({
    ...p, x: LEFT + (values.length <= 1 ? plotWidth / 2 : i * plotWidth / (values.length - 1)),
    y: TOP + plotHeight * (1 - p.count / max),
  }));
  const path = chart.map((p, i) => (i === 0 ? "M " : "L ") + p.x.toFixed(2) + " " + p.y.toFixed(2)).join(" ");
  const bottom = HEIGHT - BOTTOM;
  const area = chart.length ? path + " L " + chart[chart.length - 1].x.toFixed(2) + " " + bottom + " L " + chart[0].x.toFixed(2) + " " + bottom + " Z" : "";
  const ticks = [0, Math.floor((values.length - 1) / 2), values.length - 1].filter((i, position, a) => i >= 0 && a.indexOf(i) === position);
  const selectedIndex = Math.min(focusIndex ?? Math.max(0, chart.length - 1), Math.max(0, chart.length - 1));
  const selected = chart[selectedIndex];
  const selectedPercent = selected ? Math.max(8, Math.min(92, selected.x / WIDTH * 100)) : 50;
  function focusFromX(clientX: number, left: number, width: number) {
    if (!width || !chart.length) return;
    const targetX = (clientX - left) / width * WIDTH;
    const index = chart.reduce((best, p, i) => Math.abs(p.x - targetX) < Math.abs(chart[best].x - targetX) ? i : best, 0);
    setFocusIndex(index);
  }
  return (
    <div className="admin-trend admin-trend--premium">
      <div className="admin-trend__toolbar">
        <div className="admin-trend__summary"><strong>{total.toLocaleString("en-PK")}</strong><span>Recorded page views · {range} days{partial ? " · partial" : ""}</span></div>
        <div className="admin-segmented-control" role="group" aria-label="Chart time range">
          {([7, 30] as const).map((days) => (
            <button key={days} type="button" onClick={() => { setRange(days); setFocusIndex(null); }}
              aria-pressed={range === days} className={range === days ? "is-selected" : ""}>{days} days</button>
          ))}
        </div>
      </div>
      <div className="admin-trend__visual admin-trend__visual--premium">
        {total > 0 && selected ? (
          <button type="button" className="admin-trend__explorer"
            aria-label={"Explore chart with arrow keys. Selected " + selected.key + ": " + selected.count + " page views. " + range + "-day total " + total + "."}
            onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); focusFromX(event.clientX, rect.left, rect.width); }}
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              setFocusIndex((current) => {
                const index = current ?? chart.length - 1;
                if (event.key === "Home") return 0;
                if (event.key === "End") return chart.length - 1;
                return Math.max(0, Math.min(chart.length - 1, index + (event.key === "ArrowRight" ? 1 : -1)));
              });
            }}>
            <svg viewBox={"0 0 " + WIDTH + " " + HEIGHT} aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="admin-trend-premium-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ca79a" stopOpacity=".32" />
                  <stop offset="100%" stopColor="#0ca79a" stopOpacity=".015" />
                </linearGradient>
                <linearGradient id="admin-trend-premium-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#087f74" /><stop offset="100%" stopColor="#11ab9c" />
                </linearGradient>
              </defs>
              {[0, 0.25, 0.5, 0.75, 1].map((part) => {
                const y = TOP + part * plotHeight;
                return <g key={part}>
                  <line x1={LEFT} x2={WIDTH - RIGHT} y1={y} y2={y} stroke="#e7edf3" strokeDasharray={part === 1 ? "" : "3 6"} />
                  <text x={LEFT - 11} y={y + 4} textAnchor="end" fontSize="11" fill="#7c8e9e">{Math.round(max * (1 - part)).toLocaleString("en-PK")}</text>
                </g>;
              })}
              <path d={area} fill="url(#admin-trend-premium-fill)" />
              <path d={path} fill="none" stroke="url(#admin-trend-premium-line)" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <line x1={selected.x} x2={selected.x} y1={TOP} y2={bottom} stroke="#0ba191" strokeWidth="1.5" strokeDasharray="4 5" />
              <circle cx={selected.x} cy={selected.y} r="9" fill="#0b9b8c" fillOpacity=".12" />
              <circle cx={selected.x} cy={selected.y} r="5.3" fill="#fff" stroke="#098c80" strokeWidth="2.7" />
              {ticks.map((i) => <text key={i} x={chart[i].x} y={HEIGHT - 12}
                textAnchor={i === 0 ? "start" : i === values.length - 1 ? "end" : "middle"} fontSize="11.5" fontWeight="500" fill="#7c8e9e">{chart[i].label}</text>)}
            </svg>
            <span className="admin-trend__floating-value" style={{ left: selectedPercent + "%" }}>
              <strong>{selected.count.toLocaleString("en-PK")}</strong><small>{selected.label}</small>
            </span>
          </button>
        ) : <div className="admin-trend__empty" role="status">No recorded page views in this period.</div>}
      </div>
      <div className="admin-trend__footer">
        <div className="admin-trend__facts">
          <span>Daily average <strong>{average.toLocaleString("en-PK")}</strong></span>
          {change !== null && <span className={"admin-trend__change " + (change > 0 ? "is-up" : change < 0 ? "is-down" : "")}>
            {change > 0 ? <ArrowUpRight size={15} aria-hidden="true" /> : change < 0 ? <ArrowDownRight size={15} aria-hidden="true" /> : <Minus size={15} aria-hidden="true" />}
            <strong>{Math.abs(change)}%</strong> vs previous 7 days
          </span>}
        </div>
        <details className="admin-trend__details">
          <summary><MoveHorizontal size={14} aria-hidden="true" /> Daily values</summary>
          <div className="admin-trend__table-wrap"><table>
            <thead><tr><th scope="col">Date (PKT)</th><th scope="col">Page views</th></tr></thead>
            <tbody>{values.map((point) => <tr key={point.key}><td>{point.key}</td><td>{point.count.toLocaleString("en-PK")}</td></tr>)}</tbody>
          </table></div>
        </details>
      </div>
    </div>
  );
}
