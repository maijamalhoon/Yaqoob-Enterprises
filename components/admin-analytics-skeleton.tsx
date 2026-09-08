export function AdminAnalyticsSkeleton() {
  const statCards = ["Visitors", "Page views", "Contact visitors", "Contact rate"];
  const insightPanels = [
    { title: "Contact actions", kicker: "Conversion", rows: 3 },
    { title: "Service interest", kicker: "Services", rows: 5 },
    { title: "Traffic sources", kicker: "Sources", rows: 4 },
    { title: "Popular pages", kicker: "Pages", rows: 5 },
    { title: "Approximate cities", kicker: "Location", rows: 4 },
    { title: "Device mix", kicker: "Devices", rows: 3 },
  ];

  return (
    <div
      className="admin-content admin-control-page"
      aria-busy="true"
      aria-label="Loading analytics dashboard"
    >
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">
            <span
              className="skeleton-block skeleton-text"
              style={{ width: "4rem", height: "0.8rem" }}
              aria-hidden="true"
            />
          </span>
          <h1>
            <span
              className="skeleton-block skeleton-title"
              style={{ width: "12rem", height: "2.6rem" }}
              aria-hidden="true"
            />
          </h1>
          <p>
            <span
              className="skeleton-block skeleton-text"
              style={{ width: "20rem", maxWidth: "90%", height: "0.95rem", marginTop: "0.4rem" }}
              aria-hidden="true"
            />
          </p>
        </div>
      </div>

      {/* 4 Overview Stat Cards */}
      <div className="admin-stats admin-stats--control">
        {statCards.map((label, idx) => (
          <article key={label} className="admin-stat-card--skeleton" aria-hidden="true">
            <span
              className="skeleton-block skeleton-icon"
              style={{ width: "2.35rem", height: "2.35rem", borderRadius: "0.62rem" }}
            />
            <strong style={{ marginBlock: "0.35rem" }}>
              <span
                className="skeleton-block skeleton-title"
                style={{ width: `${3.5 + (idx % 2) * 1.5}rem`, height: "1.85rem" }}
              />
            </strong>
            <p>
              <span
                className="skeleton-block skeleton-text"
                style={{ width: "5.5rem", height: "0.8rem" }}
              />
            </p>
          </article>
        ))}
      </div>

      {/* Google Business Attribution Panel */}
      <section
        className="admin-panel admin-panel--control admin-google-panel admin-google-panel--skeleton"
        aria-hidden="true"
      >
        <div className="admin-panel__heading">
          <div>
            <span className="admin-panel-kicker">
              <span
                className="skeleton-block skeleton-text"
                style={{ width: "8.5rem", height: "0.85rem" }}
              />
            </span>
            <h2>
              <span
                className="skeleton-block skeleton-title"
                style={{ width: "14rem", height: "1.35rem", marginTop: "0.25rem" }}
              />
            </h2>
            <p>
              <span
                className="skeleton-block skeleton-text"
                style={{ width: "22rem", maxWidth: "100%", height: "0.85rem", marginTop: "0.3rem" }}
              />
            </p>
          </div>
          <span
            className="skeleton-block skeleton-pill"
            style={{ width: "6.5rem", height: "2rem", borderRadius: "0.55rem" }}
          />
        </div>

        <div className="admin-google-metrics">
          {[...Array(4)].map((_, i) => (
            <span key={i}>
              <strong>
                <span
                  className="skeleton-block skeleton-title"
                  style={{ width: "3.5rem", height: "1.45rem" }}
                />
              </strong>
              <small>
                <span
                  className="skeleton-block skeleton-text"
                  style={{ width: "4.8rem", height: "0.75rem", marginTop: "0.3rem" }}
                />
              </small>
            </span>
          ))}
        </div>

        <div className="admin-tracking-link">
          <div>
            <strong>
              <span
                className="skeleton-block skeleton-text"
                style={{ width: "8.5rem", height: "0.88rem" }}
              />
            </strong>
            <small>
              <span
                className="skeleton-block skeleton-text"
                style={{ width: "16rem", maxWidth: "100%", height: "0.75rem", marginTop: "0.25rem" }}
              />
            </small>
          </div>
          <code>
            <span
              className="skeleton-block skeleton-text"
              style={{ width: "100%", height: "1.1rem" }}
            />
          </code>
          <span
            className="skeleton-block skeleton-pill"
            style={{ width: "3.5rem", height: "1.9rem", borderRadius: "0.5rem" }}
          />
        </div>
      </section>

      {/* 6 Analytical Insight Panels */}
      <div className="admin-two-column admin-insights-grid">
        {insightPanels.map((panel, pIdx) => (
          <section
            className="admin-panel admin-panel--control admin-panel--skeleton"
            key={panel.title}
            aria-hidden="true"
          >
            <div className="admin-panel__heading">
              <div>
                <span className="admin-panel-kicker">
                  <span
                    className="skeleton-block skeleton-text"
                    style={{ width: "5.5rem", height: "0.75rem" }}
                  />
                </span>
                <h2>
                  <span
                    className="skeleton-block skeleton-title"
                    style={{ width: `${8 + (pIdx % 3) * 2}rem`, height: "1.2rem", marginTop: "0.2rem" }}
                  />
                </h2>
              </div>
            </div>

            <div className="rank-list">
              {[...Array(panel.rows)].map((_, rIdx) => {
                const labelWidth = 42 + ((rIdx * 19 + pIdx * 7) % 38);
                return (
                  <div className="rank-row--skeleton" key={rIdx}>
                    <span
                      className="skeleton-block skeleton-text"
                      style={{ width: `${labelWidth}%`, height: "0.88rem" }}
                    />
                    <strong
                      className="skeleton-block skeleton-text"
                      style={{ width: "2rem", height: "0.88rem" }}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
