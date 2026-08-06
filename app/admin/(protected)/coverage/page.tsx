import { Plus, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { createCoverageArea, deleteCoverageArea, updateCoverageArea } from "../actions";

export default async function AdminCoveragePage() {
  const { supabase } = await requireAdmin();
  const { data: areas } = await supabase.from("coverage_areas").select("*").order("display_order");

  return (
    <div className="admin-content">
      <div className="admin-page-heading"><div><span className="eyebrow">Operations</span><h1>Coverage areas</h1><p>Control delivery and doorstep biometric availability separately.</p></div></div>
      <section className="admin-panel">
        <h2>Add coverage area</h2>
        <form className="admin-form-grid" action={createCoverageArea}>
          <label>Area name<input name="name" required /></label>
          <label>Order<input type="number" name="display_order" defaultValue={areas?.length || 0} /></label>
          <label className="admin-span-2">Notes<textarea name="notes" /></label>
          <div className="admin-checks admin-span-2">
            <label><input type="checkbox" name="delivery_available" defaultChecked /> Delivery</label>
            <label><input type="checkbox" name="doorstep_biometric_available" defaultChecked /> Doorstep biometric</label>
            <label><input type="checkbox" name="extra_charge_may_apply" defaultChecked /> Extra charge may apply</label>
          </div>
          <button className="button button--primary" type="submit"><Plus size={17} /> Add area</button>
        </form>
      </section>
      <section className="admin-panel">
        <div className="admin-card-list">
          {areas?.map((area) => (
            <details className="admin-edit-card" key={area.id}>
              <summary><span><strong>{area.name}</strong><small>{area.is_active ? "Active" : "Hidden"}</small></span><span>Edit</span></summary>
              <form className="admin-form-grid" action={updateCoverageArea}>
                <input type="hidden" name="id" value={area.id} />
                <label>Area name<input name="name" defaultValue={area.name} required /></label>
                <label>Order<input type="number" name="display_order" defaultValue={area.display_order} /></label>
                <label className="admin-span-2">Notes<textarea name="notes" defaultValue={area.notes} /></label>
                <div className="admin-checks admin-span-2">
                  <label><input type="checkbox" name="delivery_available" defaultChecked={area.delivery_available} /> Delivery</label>
                  <label><input type="checkbox" name="doorstep_biometric_available" defaultChecked={area.doorstep_biometric_available} /> Doorstep biometric</label>
                  <label><input type="checkbox" name="pickup_available" defaultChecked={area.pickup_available} /> Pickup</label>
                  <label><input type="checkbox" name="extra_charge_may_apply" defaultChecked={area.extra_charge_may_apply} /> Extra charge may apply</label>
                  <label><input type="checkbox" name="is_active" defaultChecked={area.is_active} /> Active</label>
                </div>
                <button className="button button--primary" type="submit">Save area</button>
              </form>
              <form action={deleteCoverageArea}><input type="hidden" name="id" value={area.id} /><button className="danger-button" type="submit"><Trash2 size={16} /> Delete area</button></form>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
