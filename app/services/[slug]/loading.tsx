export default function ServiceCategoryLoading() {
  return (
    <main id="main-content" aria-busy="true" aria-label="Loading service category">
      {/* Hero Skeleton */}
      <section className="page-hero page-hero--service">
        <div className="page-hero__pattern" aria-hidden="true" />
        <div className="container page-hero__grid">
          <div className="page-hero__content">
            <span
              className="skeleton-block skeleton-text"
              style={{ width: "6.5rem", height: "1rem", marginBottom: "0.8rem" }}
            />
            <div
              className="page-hero__icon skeleton-block"
              style={{ width: "3.75rem", height: "3.75rem", borderRadius: "0.85rem" }}
            />
            <h1>
              <span
                className="skeleton-block skeleton-title"
                style={{ width: "22rem", maxWidth: "85%", height: "2.8rem" }}
              />
            </h1>
          </div>
        </div>
      </section>

      {/* Service List Showcase Skeleton */}
      <section className="section section--service-list">
        <div className="container service-detail-grid service-detail-grid--premium">
          <div className="service-list service-list--premium">
            <div className="service-list__intro">
              <h2>
                <span
                  className="skeleton-block skeleton-title"
                  style={{ width: "20rem", maxWidth: "90%", height: "1.8rem" }}
                />
              </h2>
            </div>

            {[...Array(3)].map((_, i) => (
              <article
                className="service-detail-card service-detail-card--premium"
                key={i}
                aria-hidden="true"
                style={{ pointerEvents: "none" }}
              >
                <div className="service-detail-card__head service-detail-card__head--premium">
                  <div style={{ flex: 1 }}>
                    <h2>
                      <span
                        className="skeleton-block skeleton-title"
                        style={{ width: `${60 + (i % 2) * 20}%`, height: "1.45rem" }}
                      />
                    </h2>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
