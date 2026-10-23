"use client";

export default function AdminRouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="admin-error-page" role="alert">
      <h1>This admin page could not be loaded</h1>
      <p>Please retry. If the problem continues, return to the overview and try again later.</p>
      <button type="button" onClick={() => reset()}>Try again</button>
    </section>
  );
}
