export function AdminLoadingState({ label = "Loading admin page" }: { label?: string }) {
  return (
    <div className="admin-loading" role="status" aria-live="polite" aria-busy="true">
      <h1 className="admin-visually-hidden">{label}</h1>
      <div className="admin-loading__line" aria-hidden="true" />
      <div className="admin-loading__grid" aria-hidden="true">
        <div className="admin-loading__card" />
        <div className="admin-loading__card" />
        <div className="admin-loading__card" />
        <div className="admin-loading__card" />
      </div>
      <div className="admin-loading__card" aria-hidden="true" />
    </div>
  );
}
