import { Clock } from "lucide-react";
import { formatBusinessHours } from "@/lib/data";
import type { BusinessHour, BusinessSettings } from "@/lib/types";

interface StitchVisitShopProps {
  settings: BusinessSettings;
  statusText: string;
  hours?: BusinessHour[];
}

export function StitchVisitShop({ settings, statusText, hours = [] }: StitchVisitShopProps) {
  return (
    <section id="visit-shop" className="public-section" aria-labelledby="visit-shop-title">
      <div className="public-container visit-shop-layout">
        <div className="visit-shop-copy">
          <h2 id="visit-shop-title">Visit the shop</h2>
          <p>{settings.address || "Akhtar Colony, Karachi"}</p>
        </div>

        <div className="visit-shop-hours">
          <h3><Clock size={17} aria-hidden="true" /> Opening hours</h3>
          {statusText && <p className="visit-shop-status">{statusText}</p>}
          {hours.length > 0 ? (
            <dl>
              {hours.map((hour) => (
                <div key={hour.id}>
                  <dt>{hour.label}</dt>
                  <dd>{formatBusinessHours(hour)}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p>Message us to check today&apos;s hours.</p>
          )}
        </div>
      </div>
    </section>
  );
}
