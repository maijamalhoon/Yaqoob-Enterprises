"use client";

export type AdminCountryMetric = {
  code: string;
  name: string;
  views: number;
  share: number;
};

const countryCoordinates: Record<string, [number, number]> = {
  US: [176, 142], CA: [182, 97], MX: [205, 187], BR: [277, 278],
  GB: [438, 130], IE: [426, 128], FR: [456, 145], DE: [470, 130],
  ES: [442, 157], IT: [470, 156], TR: [505, 151], SA: [534, 194],
  AE: [555, 185], PK: [594, 184], IN: [625, 207], BD: [651, 204],
  LK: [628, 230], CN: [667, 160], JP: [733, 173], KR: [718, 168],
  SG: [661, 236], ID: [688, 244], TH: [654, 220], MY: [669, 235],
  AU: [757, 282], NZ: [803, 328], ZA: [510, 286], NG: [477, 213],
  EG: [514, 184], QA: [548, 188], KW: [532, 184], NL: [461, 124],
  SE: [482, 88], NO: [465, 83], CH: [464, 141], PL: [488, 126],
};

export function AdminWorldMap({ countries }: { countries: AdminCountryMetric[] }) {
  const maximum = Math.max(1, ...countries.map((country) => country.views));
  const mappedCountries = countries.filter((country) => countryCoordinates[country.code]).slice(0, 16);

  return (
    <div className="admin-world-map-card">
      <svg
        className="admin-world-map"
        viewBox="0 0 900 400"
        role="img"
        aria-label="Stylised world map showing approximate visitor countries. Point size represents page-view volume."
      >
        <defs>
          <pattern id="admin-map-dots" width="19" height="19" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" opacity=".12" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="900" height="400" fill="url(#admin-map-dots)" opacity=".48" />
        <path className="map-grid" d="M20 100H880 M20 200H880 M20 300H880 M150 30V370 M300 30V370 M450 30V370 M600 30V370 M750 30V370" />
        <g className="map-land">
          <path d="M68 91 91 65 129 54 165 59 187 76 216 74 245 96 267 119 253 138 231 148 222 170 195 180 177 210 157 222 141 203 132 177 109 160 91 134 70 117Z" />
          <path d="M257 49 281 35 310 39 325 58 309 77 282 84 261 69Z" />
          <path d="M224 193 253 203 274 225 285 253 274 286 259 323 242 359 227 330 218 297 204 264 205 229Z" />
          <path d="M415 111 433 94 461 88 484 98 503 95 523 108 521 124 503 135 485 135 471 149 450 148 431 139 416 127Z" />
          <path d="M438 153 465 151 489 164 504 188 496 216 482 247 466 281 449 268 438 239 425 209 418 179Z" />
          <path d="M507 99 534 82 569 75 601 80 626 74 661 83 687 91 725 91 755 106 786 115 814 134 802 151 779 159 755 150 735 163 708 157 687 178 660 184 639 169 615 165 593 151 566 151 545 137 524 133Z" />
          <path d="M548 165 566 158 586 168 589 183 575 195 558 190Z" />
          <path d="M599 187 620 180 645 195 649 215 637 232 622 221 614 205Z" />
          <path d="M662 226 688 222 707 237 696 251 674 250 660 239Z" />
          <path d="M723 251 749 239 781 245 805 263 793 282 764 294 740 284 724 269Z" />
          <path d="M819 310 833 307 843 318 835 330 822 326Z" />
          <path d="M694 180 704 174 710 182 706 196 699 192Z" />
          <path d="M797 168 808 181 804 196 795 188Z" />
        </g>
        {mappedCountries.map((country) => {
          const [cx, cy] = countryCoordinates[country.code];
          const radius = 4 + Math.min(7, Math.sqrt(country.views / maximum) * 8);
          return (
            <g key={country.code}>
              <circle className="map-point" cx={cx} cy={cy} r={radius}>
                <title>{country.name}: {country.views.toLocaleString("en-PK")} page views</title>
              </circle>
            </g>
          );
        })}
      </svg>
      <div className="admin-country-list" aria-label="Top countries by page views">
        {countries.slice(0, 5).map((country) => (
          <div className="admin-country-list__row" key={country.code}>
            <span className="admin-country-list__code">{country.code}</span>
            <span className="admin-country-list__copy">
              <strong>{country.name}</strong>
              <small>{country.share}% of tracked views</small>
            </span>
            <span className="admin-country-list__value">{country.views.toLocaleString("en-PK")}</span>
          </div>
        ))}
        {countries.length === 0 && (
          <p className="admin-country-empty">Country-level data will appear here when available in tracked visits.</p>
        )}
      </div>
    </div>
  );
}
