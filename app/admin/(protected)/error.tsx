"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="admin-content admin-control-page" role="alert" aria-labelledby="admin-error-title">
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">Admin Centre</span>
          <h1 id="admin-error-title">The action could not be completed</h1>
          <p>
            Try again. If the problem continues, refresh the page and confirm your connection and access.
            {error.digest ? ` Support code: ${error.digest}.` : ""}
          </p>
        </div>
      </div>
      <div className="admin-form-actions">
        <button className="button button--primary" type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </section>
  );
}
