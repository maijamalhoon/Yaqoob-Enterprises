import { ArrowRight } from "lucide-react";

interface ServiceShowcaseSkeletonProps {
  itemCount?: number;
  showHeading?: boolean;
}

export function ServiceShowcaseSkeleton({
  itemCount = 6,
  showHeading = true,
}: ServiceShowcaseSkeletonProps) {
  const items = Array.from({ length: itemCount });

  return (
    <section
      className="section services-showcase minimal-services"
      id="services-loading"
      aria-busy="true"
      aria-label="Loading services showcase"
    >
      <div className="container">
        {showHeading && (
          <div className="minimal-services__heading">
            <div>
              <span className="eyebrow">
                <span
                  className="skeleton-block skeleton-text"
                  style={{ width: "4.5rem", height: "0.85rem" }}
                  aria-hidden="true"
                />
              </span>
              <h2>
                <span
                  className="skeleton-block skeleton-title"
                  style={{ width: "17rem", maxWidth: "80%", height: "2.1rem" }}
                  aria-hidden="true"
                />
              </h2>
            </div>
          </div>
        )}

        <div className="minimal-services__list">
          {items.map((_, index) => {
            const titleWidth = 60 + ((index * 17) % 35);
            const descWidth1 = 88 + ((index * 7) % 10);
            const descWidth2 = 45 + ((index * 23) % 40);
            const metaWidth = 4.8 + ((index * 0.9) % 2.5);

            return (
              <div
                className="minimal-service-item minimal-service-item--skeleton"
                key={index}
                aria-hidden="true"
              >
                <div className="minimal-service-item__icon skeleton-block" />
                <div className="minimal-service-item__copy">
                  <span
                    className="skeleton-block skeleton-title"
                    style={{
                      width: `${titleWidth}%`,
                      height: "1.05rem",
                      marginBottom: "0.42rem",
                    }}
                  />
                  <span
                    className="skeleton-block skeleton-text"
                    style={{
                      width: `${descWidth1}%`,
                      height: "0.78rem",
                      marginBottom: "0.22rem",
                    }}
                  />
                  <span
                    className="skeleton-block skeleton-text"
                    style={{
                      width: `${descWidth2}%`,
                      height: "0.78rem",
                    }}
                  />
                </div>
                <div className="minimal-service-item__meta">
                  <span
                    className="skeleton-block skeleton-pill"
                    style={{
                      width: `${metaWidth}rem`,
                      height: "1.2rem",
                    }}
                  />
                </div>
                <ArrowRight
                  className="minimal-service-item__arrow"
                  size={18}
                  style={{ opacity: 0.25 }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
