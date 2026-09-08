import { ServiceShowcaseSkeleton } from "@/components/service-showcase-skeleton";
import styles from "./home.module.css";

export default function RootLoading() {
  return (
    <div className={styles.page} aria-busy="true" aria-label="Loading page...">
      <main id="main-content">
        <section className={`${styles.hero} home-hero`}>
          <div className={`container home-hero-grid ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <div className={`${styles.kicker} home-hero-kicker`}>
                <span
                  className="skeleton-block skeleton-text"
                  style={{ width: "12rem", height: "1rem" }}
                  aria-hidden="true"
                />
              </div>

              <h1>
                <span
                  className="skeleton-block skeleton-title"
                  style={{ width: "19rem", maxWidth: "90%", height: "2.8rem", marginBottom: "0.5rem" }}
                  aria-hidden="true"
                />
                <span
                  className="skeleton-block skeleton-title"
                  style={{ width: "14rem", maxWidth: "70%", height: "2.8rem" }}
                  aria-hidden="true"
                />
              </h1>

              <p className={styles.lead} style={{ marginTop: "1rem" }}>
                <span
                  className="skeleton-block skeleton-text"
                  style={{ width: "24rem", maxWidth: "95%", height: "1.1rem" }}
                  aria-hidden="true"
                />
              </p>

              <div className={styles.actions} style={{ marginTop: "1.5rem" }}>
                <span
                  className="skeleton-block skeleton-pill"
                  style={{ width: "14rem", height: "3.2rem", borderRadius: "0.78rem" }}
                  aria-hidden="true"
                />
                <span
                  className="skeleton-block skeleton-pill"
                  style={{ width: "11rem", height: "3.2rem", borderRadius: "0.78rem" }}
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className={`${styles.visual} home-hero-visual`}>
              <div
                className={`${styles.imageShell} home-hero-image skeleton-block`}
                style={{ borderRadius: "1.1rem", aspectRatio: "1.6 / 1" }}
                aria-hidden="true"
              />
            </div>
          </div>
        </section>

        <div className={styles.servicesWrap}>
          <ServiceShowcaseSkeleton itemCount={6} />
        </div>
      </main>
    </div>
  );
}
