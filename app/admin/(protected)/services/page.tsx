import { Plus, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { createService, deleteService, updateCategory, updateService } from "../actions";

const statuses = ["active", "appointment_only", "temporarily_unavailable", "coming_soon", "hidden"];

export default async function AdminServicesPage() {
  const { supabase } = await requireAdmin();
  const [{ data: categories }, { data: services }] = await Promise.all([
    supabase.from("service_categories").select("*").order("display_order"),
    supabase.from("services").select("*").order("display_order"),
  ]);

  return (
    <div className="admin-content">
      <div className="admin-page-heading"><div><span className="eyebrow">Content</span><h1>Services & categories</h1><p>Change availability, delivery modes, customer requirements and wording.</p></div></div>

      <section className="admin-panel">
        <h2>Add a service</h2>
        <form className="admin-form-grid" action={createService}>
          <label>Category<select name="category_id" required>{categories?.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}</select></label>
          <label>URL slug<input name="slug" placeholder="service-name" required pattern="[a-z0-9-]+" /></label>
          <label>Title<input name="title" required /></label>
          <label>Status<select name="status">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label className="admin-span-2">Short description<textarea name="short_description" required /></label>
          <label className="admin-span-2">Detailed description<textarea name="detailed_description" /></label>
          <label className="admin-span-2">Requirements, one per line<textarea name="requirements" /></label>
          <label className="admin-span-2">Important note<textarea name="important_note" /></label>
          <div className="admin-checks admin-span-2">
            <label><input type="checkbox" name="available_at_shop" defaultChecked /> At shop</label>
            <label><input type="checkbox" name="pickup_available" /> Pickup</label>
            <label><input type="checkbox" name="delivery_available" /> Delivery</label>
            <label><input type="checkbox" name="doorstep_available" /> Doorstep</label>
            <label><input type="checkbox" name="appointment_required" /> Appointment required</label>
          </div>
          <button className="button button--primary" type="submit"><Plus size={17} /> Add service</button>
        </form>
      </section>

      {categories?.map((category) => (
        <section className="admin-panel" key={category.id}>
          <form className="admin-category-form" action={updateCategory}>
            <input type="hidden" name="id" value={category.id} />
            <label>Category name<input name="title" defaultValue={category.title} /></label>
            <label>Icon key<input name="icon_key" defaultValue={category.icon_key} /></label>
            <label>Order<input type="number" name="display_order" defaultValue={category.display_order} /></label>
            <label className="admin-span-2">Description<textarea name="description" defaultValue={category.description} /></label>
            <label className="checkbox-line"><input type="checkbox" name="is_active" defaultChecked={category.is_active} /> Active</label>
            <button className="button button--secondary" type="submit">Save category</button>
          </form>
          <div className="admin-card-list">
            {services?.filter((service) => service.category_id === category.id).map((service) => (
              <details className="admin-edit-card" key={service.id}>
                <summary><span><strong>{service.title}</strong><small>{service.status.replaceAll("_", " ")}</small></span><span>Edit</span></summary>
                <form className="admin-form-grid" action={updateService}>
                  <input type="hidden" name="id" value={service.id} />
                  <label>Title<input name="title" defaultValue={service.title} required /></label>
                  <label>Status<select name="status" defaultValue={service.status}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
                  <label>Order<input type="number" name="display_order" defaultValue={service.display_order} /></label>
                  <label className="admin-span-2">Short description<textarea name="short_description" defaultValue={service.short_description} /></label>
                  <label className="admin-span-2">Detailed description<textarea name="detailed_description" defaultValue={service.detailed_description} /></label>
                  <label className="admin-span-2">Requirements, one per line<textarea name="requirements" defaultValue={(service.requirements || []).join("\n")} /></label>
                  <label className="admin-span-2">Important note<textarea name="important_note" defaultValue={service.important_note} /></label>
                  <div className="admin-checks admin-span-2">
                    <label><input type="checkbox" name="available_at_shop" defaultChecked={service.available_at_shop} /> At shop</label>
                    <label><input type="checkbox" name="whatsapp_request" defaultChecked={service.whatsapp_request} /> WhatsApp</label>
                    <label><input type="checkbox" name="pickup_available" defaultChecked={service.pickup_available} /> Pickup</label>
                    <label><input type="checkbox" name="delivery_available" defaultChecked={service.delivery_available} /> Delivery</label>
                    <label><input type="checkbox" name="doorstep_available" defaultChecked={service.doorstep_available} /> Doorstep</label>
                    <label><input type="checkbox" name="appointment_required" defaultChecked={service.appointment_required} /> Appointment</label>
                    <label><input type="checkbox" name="is_featured" defaultChecked={service.is_featured} /> Featured</label>
                  </div>
                  <button className="button button--primary" type="submit">Save service</button>
                </form>
                <form action={deleteService}><input type="hidden" name="id" value={service.id} /><button className="danger-button" type="submit"><Trash2 size={16} /> Delete service</button></form>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
