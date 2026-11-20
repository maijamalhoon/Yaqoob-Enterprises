type Row = [label: string, count: number];

const shades = ["#0d8d80", "#3172a4", "#e2a24a", "#7e74b4", "#b0c5d1", "#be7181"] as const;

export function AdminMixDonut({
  rows,
  label = "Device mix",
}: {
  rows: Row[];
  label?: string;
}) {
  const safeRows = rows.filter((row) => Number.isFinite(row[1]) && row[1] > 0).slice(0, shades.length);
  const total = safeRows.reduce((sum, row) => sum + row[1], 0);
  let start = 0;
  const slices = safeRows.map(([, count], index) => {
    const end = start + count / total * 100;
    const segment = shades[index] + " " + start.toFixed(3) + "% " + end.toFixed(3) + "%";
    start = end;
    return segment;
  });
  const chartBackground = total ? "conic-gradient(" + slices.join(",") + ")" : "#edf1f5";
  const description = total
    ? safeRows.map(([name, count]) => name + ": " + count.toLocaleString("en-PK")).join("; ")
    : "No data yet";

  return (
    <div className="admin-mix">
      <div className="admin-mix__donut" role="img" aria-label={label + ". " + description}
        style={{ background: chartBackground }}>
        <div className="admin-mix__hole" aria-hidden="true">
          <strong>{total.toLocaleString("en-PK")}</strong>
          <span>views</span>
        </div>
      </div>
      <div className="admin-mix__legend">
        {safeRows.map(([name, count], index) => (
          <div className="admin-mix__legend-row" key={name}>
            <span className="admin-mix__legend-name">
              <i style={{ backgroundColor: shades[index] }} aria-hidden="true" />
              {name}
            </span>
            <span>
              <strong>{total ? Math.round(count / total * 100) : 0}%</strong>
              <small>{count.toLocaleString("en-PK")}</small>
            </span>
          </div>
        ))}
        {!total && <p className="admin-mix__empty">No device data yet.</p>}
      </div>
    </div>
  );
}
