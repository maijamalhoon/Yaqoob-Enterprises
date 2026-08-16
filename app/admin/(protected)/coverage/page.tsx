import { MapPinned, Plus } from "lucide-react";
import { AdminSubmitButton } from "@/components/admin-form-buttons";
import { requireAdmin } from "@/lib/admin";
import { assertQuerySucceeded } from "@/lib/supabase/query-error";
import { archiveCoverageArea, createCoverageArea, updateCoverageArea } from "./actions";

export default async function AdminCoveragePage() {
  const { supabase } = await requireAdmin();
  const { data: areas, error } = await supabase.from("coverage_areas").select("*").order("display_order");
  assertQuerySucceeded(error, "coverage areas");
  const areaList = areas || [];
  const activeCount = areaList.filter((area) => area.is_active).length;

  return (
    <div className="admin-content admin-control-page">
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">Operations</span>
          <h1>Coverage</h1>
          <p>Areas used for delivery, pickup and home-visit availability.</p>
        </div>
        <div className="admin-heading-metrics"><span><strong>{activeCount}</strong> active areas</span></div>
      </div>

      <details className="admin-panel admin-create-panel">
        <summary><span><Plus size={17} /> Add area</span><small>Create a new service area</small></summary>
        <form className="admin-form-grid admin-form-grid--focused" action={createCoverageArea}>
          <label>Area name<input name="name" maxLength={120} required /></label>
          <label>Order<input type="number" min="0" max="10000" name="display_order" defaultValue={areaList.length} /></label>
          <label className="admin-span-2">Notes<textarea name="notes" maxLength={500} rows={2} /></label>
          <div className="admin-checks admin-span-2">
            <label><input type="checkbox" name="delivery_available" defaultChecked /> Delivery</label>
            <label><input type="checkbox" name="doorstep_biometric_available" defaultChecked /> Home biometric</label>
            <label><input type="checkbox" name="pickup_available" /> Pickup</label>
            <label><input type="checkbox" name="extra_charge_may_apply" defaultChecked /> Extra charge may apply</label>
          </div>
          <div className="admin-form-actions admin-span-2"><AdminSubmitButton>Add area</AdminSubmitButton></div>
        </form>
      </details>

      <section className="admin-panel admin-panel--control admin-coverage-panel">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><MapPinned size={15} /> Areas</span><h2>Service coverage</h2></div>
        </div>
        <div className="admin-card-list admin-coverage-list">
          {areaList.map((area) => (
            <details className="admin-edit-card admin-coverage-card" key={area.id}>
              <summary>
                <span><strong>{area.name}</strong><small>{area.is_active ? "Public" : "Hidden"} · Order {area.display_order}</small></span>
                <span>Edit</span>
              </summary>
              <div className="admin-edit-card__body">
                <form className="admin-form-grid admin-form-grid--focused" action={updateCoverageArea}>
                  <input type="hidden" name="id" value={area.id} />
                  <label>Area name<input name="name" maxLength={120} defaultValue={area.name} required /></label>
                  <label>Order<input type="number" min="0" max="10000" name="display_order" defaultValue={area.display_order} /></label>
                  <label className="admin-span-2">Notes<textarea name="notes" maxLength={500} rows={2} defaultValue={area.notes} /></label>
                  <div className="admin-checks admin-span-2">
                    <label><input type="checkbox" name="delivery_available" defaultChecked={area.delivery_available} /> Delivery</label>
                    <label><input type="checkbox" name="doorstep_biometric_available" defaultChecked={area.doorstep_biometric_available} /> Home biometric</label>
                    <label><input type="checkbox" name="pickup_available" defaultChecked={area.pickup_available} /> Pickup</label>
                    <label><input type="checkbox" name="extra_charge_may_apply" defaultChecked={area.extra_charge_may_apply} /> Extra charge</label>
                    <label><input type="checkbox" name="is_active" defaultChecked={area.is_active} /> Active</label>
                  </div>
                  <div className="admin-form-actions admin-span-2"><AdminSubmitButton>Save area</AdminSubmitButton></div>
                </form>
                <form className="admin-destructive-row" action={archiveCoverageArea}>
                  <input type="hidden" name="id" value={area.id} />
                  <AdminSubmitButton
                    variant="secondary"
                    pendingLabel="Archiving…"
                    confirmMessage={`Archive “${area.name}”? It will be hidden from the public website and can be restored by editing it.`}
                  >
                    Archive area
                  </AdminSubmitButton>
                </form>
              </div>
            </details>
          ))}
          {areaList.length === 0 && <div className="admin-empty-state admin-empty-state--compact"><MapPinned size={22} /><p>No coverage areas yet.</p></div>}
        </div>
      </section>
    </div>
  );
}
