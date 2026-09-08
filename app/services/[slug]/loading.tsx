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
            <span className="eyebrow">
              <span
                className="skeleton-block skeleton-text"
                style={{ width: "7.5rem", height: "0.85rem" }}
              />
            </span>
            <h1>
              <span
                className="skeleton-block skeleton-title"
                style={{ width: "22rem", maxWidth: "85%", height: "2.8rem" }}
              />
            </h1>
            <p>
              <span
                className="skeleton-block skeleton-text"
                style={{ width: "30rem", maxWidth: "100%", height: "1rem" }}
              />
            </p>
          </div>

          <aside className="page-hero__summary" aria-hidden="true">
            <span
              className="page-hero__summary-icon skeleton-block"
              style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.6rem" }}
            />
            <strong style={{ marginBlock: "0.3rem" }}>
              <span className="skeleton-block skeleton-title" style={{ width: "3rem", height: "2rem" }} />
            </strong>
            <span
              className="skeleton-block skeleton-text"
              style={{ width: "7rem", height: "0.9rem" }}
            />
            <small>
              <span
                className="skeleton-block skeleton-text"
                style={{ width: "100%", height: "0.75rem", marginTop: "0.4rem" }}
              />
            </small>
          </aside>
        </div>
      </section>

      {/* Service List Showcase Skeleton */}
      <section className="section section--service-list">
        <div className="container service-detail-grid service-detail-grid--premium">
          <div className="service-list service-list--premium">
            <div className="service-list__intro">
              <div>
                <span className="eyebrow">
                  <span
                    className="skeleton-block skeleton-text"
                    style={{ width: "6.5rem", height: "0.85rem" }}
                  />
                </span>
                <h2>
                  <span
                    className="skeleton-block skeleton-title"
                    style={{ width: "20rem", maxWidth: "90%", height: "1.8rem" }}
                  />
                </h2>
              </div>
              <p>
                <span
                  className="skeleton-block skeleton-text"
                  style={{ width: "24rem", maxWidth: "100%", height: "0.95rem" }}
                />
              </p>
            </div>

            {[...Array(3)].map((_, i) => (
              <article
                className="service-detail-card service-detail-card--premium"
                key={i}
                aria-hidden="true"
                style={{ pointerEvents: "none" }}
              >
                <div className="service-detail-card__head service-detail-card__head--premium">
                  <span
                    className="skeleton-block"
                    style={{ width: "2rem", height: "1.2rem", borderRadius: "0.35rem" }}
                  />
                  <div style={{ flex: 1 }}>
                    <span
                      className="skeleton-block skeleton-pill"
                      style={{ width: "5.5rem", height: "1.25rem", marginBottom: "0.45rem" }}
                    />
                    <h2>
                      <span
                        className="skeleton-block skeleton-title"
                        style={{ width: `${60 + (i % 2) * 20}%`, height: "1.45rem" }}
                      />
                    </h2>
                    <p style={{ marginTop: "0.4rem" }}>
                      <span
                        className="skeleton-block skeleton-text"
                        style={{ width: "90%", height: "0.9rem" }}
                      />
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: "1rem", display: "flex", gap: "0.6rem" }}>
                  <span
                    className="skeleton-block skeleton-pill"
                    style={{ width: "7.5rem", height: "1.8rem" }}
                  />
                  <span
                    className="skeleton-block skeleton-pill"
                    style={{ width: "6.5rem", height: "1.8rem" }}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
