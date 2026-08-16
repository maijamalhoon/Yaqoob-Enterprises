export default function AdminLoading() {
  return (
    <section className="admin-content admin-control-page" aria-busy="true" aria-live="polite">
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">Admin Centre</span>
          <h1>Loading business information</h1>
          <p>Please wait while the latest records are retrieved.</p>
        </div>
      </div>
    </section>
  );
}
