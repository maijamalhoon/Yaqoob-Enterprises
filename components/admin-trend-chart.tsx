"use client";

import { useState } from "react";

export type TrafficPoint = { key: string; label: string; count: number };

type Props = { points: TrafficPoint[]; partial?: boolean };

const WIDTH = 800;
const HEIGHT = 220;
const LEFT = 38;
const RIGHT = 16;
const TOP = 14;
const BOTTOM = 36;

function coordinates(points: TrafficPoint[], max: number) {
  const plotWidth = WIDTH - LEFT - RIGHT;
  const plotHeight = HEIGHT - TOP - BOTTOM;
  return points.map((point, i) => ({
    ...point,
    x: LEFT + (points.length === 1 ? plotWidth / 2 : i * plotWidth / (points.length - 1)),
    y: TOP + plotHeight - (point.count / max) * plotHeight,
  }));
}

export function AdminTrendChart({ points, partial = false }: Props) {
  const [range, setRange] = useState<7 | 30>(30);
  const values = range === 7 ? points.slice(-7) : points;
  const max = Math.max(1, ...values.map((point) => point.count));
  const total = values.reduce((sum, point) => sum + point.count, 0);
  const chart = coordinates(values, max);
  const line = chart.map(({ x, y }, index) => (index === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2)).join(" ");
  const bottomY = HEIGHT - BOTTOM;
  const area = chart.length
    ? line + " L " + chart[chart.length - 1].x.toFixed(2) + " " + bottomY +
      " L " + chart[0].x.toFixed(2) + " " + bottomY + " Z"
    : "";
  const ticks = [0, Math.floor((values.length - 1) / 2), values.length - 1].filter(
    (index, position, array) => index >= 0 && array.indexOf(index) === position,
  );
  const average = values.length ? Math.round(total / values.length) : 0;

  return (
    <div className="admin-trend" aria-label="Traffic chart">
      <div className="admin-trend__toolbar">
        <div className="admin-trend__summary">
          <strong>{total.toLocaleString("en-PK")}</strong>
          <span>page views · {range} days{partial ? " · partial" : ""}</span>
        </div>
        <div className="admin-segmented-control" role="group" aria-label="Chart time range">
          {([7, 30] as const).map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setRange(days)}
              aria-pressed={range === days}
              className={range === days ? "is-selected" : ""}
            >
              {days} days
            </button>
          ))}
        </div>
      </div>
      <div className="admin-trend__visual">
        {total > 0 ? (
          <svg viewBox={"0 0 " + WIDTH + " " + HEIGHT} role="img"
            aria-label={"Daily page views in the selected " + range + "-day period; total " + total.toLocaleString("en-PK") + ", daily average " + average.toLocaleString("en-PK") + "."}>
            <defs>
              <linearGradient id="admin-trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0e8e83" stopOpacity=".22" />
                <stop offset="100%" stopColor="#0e8e83" stopOpacity=".015" />
              </linearGradient>
            </defs>
            {[0, 0.5, 1].map((part) => {
              const y = TOP + part * (HEIGHT - TOP - BOTTOM);
              const amount = Math.round((1 - part) * max);
              return (
                <g key={part}>
                  <line x1={LEFT} x2={WIDTH - RIGHT} y1={y} y2={y} stroke="#e4ebf0" strokeDasharray={part === 1 ? "" : "3 5"} />
                  <text x={LEFT - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#7b8b9c">
                    {amount.toLocaleString("en-PK")}
                  </text>
                </g>
              );
            })}
            <path d={area} fill="url(#admin-trend-fill)" />
            <path d={line} fill="none" stroke="#0e8e83" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {chart.map(({ key, label, count, x, y }) => (
              <circle key={key} cx={x} cy={y} r="3.7" fill="#fff" stroke="#0e8e83" strokeWidth="2">
                <title>{label + ": " + count.toLocaleString("en-PK") + " page views"}</title>
              </circle>
            ))}
            {ticks.map((index) => (
              <text key={index} x={chart[index].x} y={HEIGHT - 10}
                textAnchor={index === 0 ? "start" : index === values.length - 1 ? "end" : "middle"} fontSize="11" fill="#718398">
                {chart[index].label}
              </text>
            ))}
          </svg>
        ) : (
          <div className="admin-trend__empty" role="status">No page views in this period</div>
        )}
      </div>
      <div className="admin-trend__footer">
        <span>Daily average <strong>{average.toLocaleString("en-PK")}</strong></span>
        <details className="admin-trend__details">
          <summary>View daily data</summary>
          <div className="admin-trend__table-wrap">
            <table>
              <thead><tr><th scope="col">Date (PKT)</th><th scope="col">Page views</th></tr></thead>
              <tbody>
                {values.map((point) => (
                  <tr key={point.key}><td>{point.key}</td><td>{point.count.toLocaleString("en-PK")}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}
