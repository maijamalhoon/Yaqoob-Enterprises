import { ADMIN_WORLD_MAP_PATHS, ADMIN_WORLD_MAP_VIEWBOX } from "@/lib/admin-world-map-data";

export type AdminCountryMetric = {
  code: string;
  name: string;
  views: number;
  share: number;
};

export function AdminWorldMap({ countries }: { countries: AdminCountryMetric[] }) {
  const maximum = Math.max(1, ...countries.map((country) => country.views));
  const countryStyles = countries
    .filter((country) => /^[A-Z]{2}$/.test(country.code) && country.code !== "ZZ")
    .map((country) => {
      const intensity = Math.round(18 + 72 * Math.sqrt(country.views / maximum));
      const id = country.code.toLowerCase();
      return `#${id} { --country-intensity: ${intensity}%; } #${id} path { --country-intensity: ${intensity}%; }`;
    })
    .join("\n");

  return (
    <div className="admin-world-map-card">
      <div className="admin-world-map-frame">
        <svg
          className="admin-world-map"
          viewBox={ADMIN_WORLD_MAP_VIEWBOX}
          role="img"
          aria-label="World map shaded by tracked page-view volume for countries with available geographic metadata."
          preserveAspectRatio="xMidYMid meet"
        >
          <title>Tracked website traffic by country</title>
          <desc>
            Country fills represent relative page-view volume for countries present in the current reporting window.
            This is approximate network metadata, not precise visitor location.
          </desc>
          <style>{`
            .admin-world-map .map-country,
            .admin-world-map path {
              fill: var(--map-land);
              stroke: var(--map-border);
              stroke-width: .65;
              stroke-linejoin: round;
              vector-effect: non-scaling-stroke;
              transition: fill 160ms ease, stroke 160ms ease;
            }
            .admin-world-map path {
              fill: color-mix(in srgb, var(--map-heat) var(--country-intensity, 0%), var(--map-land));
            }
            .admin-world-map path:hover {
              fill: var(--map-hot);
              stroke: var(--map-hot);
              stroke-width: 1.15;
            }
            ${countryStyles}
          `}</style>
          <g dangerouslySetInnerHTML={{ __html: ADMIN_WORLD_MAP_PATHS }} />
        </svg>
      </div>
      <div className="admin-country-panel">
        <div className="admin-country-panel__heading">
          <div>
            <span className="admin-panel-kicker">Top countries</span>
            <p>Page views with country data</p>
          </div>
          <span className="admin-country-panel__total">{countries.reduce((sum, country) => sum + country.views, 0).toLocaleString("en-PK")}</span>
        </div>
        <div className="admin-country-list" aria-label="Top countries by page views">
          {countries.slice(0, 5).map((country, index) => (
            <div className="admin-country-list__row" key={country.code}>
              <span className="admin-country-list__rank">{String(index + 1).padStart(2, "0")}</span>
              <span className="admin-country-list__copy">
                <strong>{country.name}</strong>
                <span className="admin-country-list__bar" aria-hidden="true">
                  <span style={{ width: `${Math.max(country.share, country.views ? 2 : 0)}%` }} />
                </span>
              </span>
              <span className="admin-country-list__value">
                <strong>{country.views.toLocaleString("en-PK")}</strong>
                <small>{country.share}%</small>
              </span>
            </div>
          ))}
          {countries.length === 0 && (
            <p className="admin-country-empty">Country data will appear when tracked visits include a valid country code.</p>
          )}
        </div>
      </div>
    </div>
  );
}
