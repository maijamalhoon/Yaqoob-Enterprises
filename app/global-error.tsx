"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="admin-content admin-control-page">
          <div className="admin-page-heading admin-page-heading--control">
            <div>
              <span className="eyebrow">Yaqoob Enterprises</span>
              <h1>Something went wrong</h1>
              <p>The page could not be completed. Please try again.</p>
            </div>
          </div>
          <button className="button button--primary" type="button" onClick={reset}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
