import { Eye, EyeOff, Plus, Wrench } from "lucide-react";
import { AdminSubmitButton } from "@/components/admin-form-buttons";
import { ServiceIcon } from "@/components/service-icon";
import { requireAdmin } from "@/lib/admin";
import { assertQuerySucceeded } from "@/lib/supabase/query-error";
import { archiveService, createCategory, createService, updateCategory, updateService } from "./actions";

const statuses = [
  ["active", "Available"],
  ["appointment_only", "Book first"],
  ["temporarily_unavailable", "Temporarily paused"],
  ["coming_soon", "Coming soon"],
  ["hidden", "Hidden from website"],
] as const;

const iconOptions = [
  ["printer", "Printing"],
  ["file-text", "Typing / forms"],
  ["scroll-text", "Documents"],
  ["fingerprint", "Biometric"],
  ["wallet-cards", "Payments"],
  ["ticket", "Tickets"],
  ["shopping-bag", "Retail"],
  ["laptop", "Laptop / web"],
  ["briefcase", "General"],
] as const;

function statusLabel(status: string) {
  return statuses.find(([value]) => value === status)?.[1] || status.replaceAll("_", " ");
}

function serviceModes(service: {
  available_at_shop: boolean;
  pickup_available: boolean;
  delivery_available: boolean;
  doorstep_available: boolean;
}) {
  return [
    service.available_at_shop ? "Shop" : null,
    service.pickup_available ? "Pickup" : null,
    service.delivery_available ? "Delivery" : null,
    service.doorstep_available ? "Home visit" : null,
  ].filter(Boolean);
}

export default async function AdminServicesPage() {
  const { supabase } = await requireAdmin();
  const [categoryResult, serviceResult] = await Promise.all([
    supabase.from("service_categories").select("*").order("display_order"),
    supabase.from("services").select("*").order("display_order"),
  ]);
  assertQuerySucceeded(categoryResult.error, "service categories");
  assertQuerySucceeded(serviceResult.error, "services");
  const categories = categoryResult.data;
  const services = serviceResult.data;
  const categoryList = categories || [];
  const serviceList = services || [];
  const activeCategories = categoryList.filter((category) => category.is_active);
  const activeCategoryIds = new Set(activeCategories.map((category) => category.id));
  const publicServices = serviceList.filter(
    (service) => service.status !== "hidden" && activeCategoryIds.has(service.category_id),
  );
  const websiteServices = publicServices.filter((service) => service.is_featured);

  return (
    <div className="admin-content admin-control-page">
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">Website content</span>
          <h1>Services</h1>
          <p>Status controls whether a service is public. “Show in homepage Top services” only controls the main homepage list.</p>
        </div>
        <div className="admin-heading-metrics" aria-label="Service content summary">
          <span><strong>{activeCategories.length}</strong> categories</span>
          <span><strong>{websiteServices.length}</strong> homepage Top</span>
          <span><strong>{publicServices.length}</strong> public services</span>
        </div>
      </div>

      <section className="admin-create-row">
        <details className="admin-panel admin-create-panel">
          <summary><span><Plus size={17} /> Add service</span><small>Create a new customer service</small></summary>
          <form className="admin-form-grid admin-form-grid--focused" action={createService}>
            <label>Category<select name="category_id" required>{categoryList.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}</select></label>
            <label>Status<select name="status" defaultValue="active">{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label>Title<input name="title" maxLength={120} required /></label>
            <label>URL slug<input name="slug" placeholder="service-name" required pattern="[a-zA-Z0-9-]+" /></label>
            <label>Order<input type="number" min="0" name="display_order" defaultValue={serviceList.length} /></label>
            <label className="checkbox-line"><input type="checkbox" name="is_featured" /> Show in homepage Top services</label>
            <label className="admin-span-2">Short description<textarea name="short_description" rows={2} maxLength={300} required /></label>
            <label className="admin-span-2">Detailed description<textarea name="detailed_description" rows={3} maxLength={2000} /></label>
            <label className="admin-span-2">What to bring / send <small>one item per line</small><textarea name="requirements" rows={4} maxLength={6000} /></label>
            <label className="admin-span-2">Important note<textarea name="important_note" rows={2} maxLength={1000} /></label>
            <label className="admin-span-2">Google title <small>optional — blank uses automatic local SEO</small><input name="seo_title" maxLength={90} placeholder="Service in Karachi | Business name" /></label>
            <label className="admin-span-2">Google description <small>optional — blank uses service details + location automatically</small><textarea name="seo_description" maxLength={190} rows={2} /></label>
            <div className="admin-checks admin-span-2" aria-label="Service options">
              <label><input type="checkbox" name="available_at_shop" defaultChecked /> At shop</label>
              <label><input type="checkbox" name="pickup_available" /> Pickup</label>
              <label><input type="checkbox" name="delivery_available" /> Delivery</label>
              <label><input type="checkbox" name="doorstep_available" /> Home visit</label>
              <label><input type="checkbox" name="appointment_required" /> Appointment</label>
            </div>
            <div className="admin-form-actions admin-span-2"><AdminSubmitButton>Add service</AdminSubmitButton></div>
          </form>
        </details>

        <details className="admin-panel admin-create-panel">
          <summary><span><Plus size={17} /> Add category</span><small>Create a new service group</small></summary>
          <form className="admin-form-grid admin-form-grid--focused" action={createCategory}>
            <label>Category name<input name="title" maxLength={100} required /></label>
            <label>URL slug<input name="slug" placeholder="category-name" required pattern="[a-zA-Z0-9-]+" /></label>
            <label>Icon<select name="icon_key" defaultValue="briefcase">{iconOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label>Order<input type="number" min="0" name="display_order" defaultValue={categoryList.length} /></label>
            <label className="admin-span-2">Description<textarea name="description" rows={2} maxLength={500} required /></label>
            <div className="admin-form-actions admin-span-2"><AdminSubmitButton>Add category</AdminSubmitButton></div>
          </form>
        </details>
      </section>

      <div className="admin-service-groups">
        {categoryList.map((category) => {
          const categoryServices = serviceList.filter((service) => service.category_id === category.id);
          return (
            <section className="admin-panel admin-service-group" key={category.id}>
              <div className="admin-service-group__head">
                <span className="admin-service-group__icon"><ServiceIcon iconKey={category.icon_key} size={21} /></span>
                <div className="admin-service-group__title">
                  <div><h2>{category.title}</h2><span className={`admin-state ${category.is_active ? "is-live" : "is-hidden"}`}>{category.is_active ? <Eye size={13} /> : <EyeOff size={13} />}{category.is_active ? "Enabled" : "Hidden"}</span></div>
                  <p>{categoryServices.length} {categoryServices.length === 1 ? "service" : "services"}</p>
                </div>
                <details className="admin-inline-editor">
                  <summary>Category settings</summary>
                  <form className="admin-form-grid admin-form-grid--focused" action={updateCategory}>
                    <input type="hidden" name="id" value={category.id} />
                    <label>Category name<input name="title" maxLength={100} defaultValue={category.title} required /></label>
                    <label>Icon<select name="icon_key" defaultValue={category.icon_key}>{iconOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                    <label>Order<input type="number" min="0" name="display_order" defaultValue={category.display_order} /></label>
                    <label className="admin-span-2">Description<textarea name="description" rows={2} maxLength={500} defaultValue={category.description} required /></label>
                    <label className="checkbox-line admin-span-2"><input type="checkbox" name="is_active" defaultChecked={category.is_active} /> Enable this category when it has public services</label>
                    <div className="admin-form-actions admin-span-2"><AdminSubmitButton variant="secondary">Save category</AdminSubmitButton></div>
                  </form>
                </details>
              </div>

              <div className="admin-service-list">
                {categoryServices.map((service) => {
                  const modes = serviceModes(service);
                  return (
                    <details className="admin-edit-card admin-service-card" key={service.id}>
                      <summary>
                        <span className="admin-service-card__main">
                          <strong>{service.title}</strong>
                          <small>{service.short_description}</small>
                        </span>
                        <span className="admin-service-card__meta">
                          {service.is_featured && service.status !== "hidden" && <span className="admin-status admin-status--active">Top</span>}
                          <span className={`admin-status admin-status--${service.status}`}>{statusLabel(service.status)}</span>
                          {modes.length > 0 && <small>{modes.join(" · ")}</small>}
                        </span>
                        <span className="admin-edit-label">Edit</span>
                      </summary>
                      <div className="admin-edit-card__body">
                        <form className="admin-form-grid admin-form-grid--focused" action={updateService}>
                          <input type="hidden" name="id" value={service.id} />
                          <label>Title<input name="title" maxLength={120} defaultValue={service.title} required /></label>
                          <label>Category<select name="category_id" defaultValue={service.category_id}>{categoryList.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
                          <label>Status<select name="status" defaultValue={service.status}>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                          <label>Order<input type="number" min="0" name="display_order" defaultValue={service.display_order} /></label>
                          <label className="checkbox-line admin-span-2"><input type="checkbox" name="is_featured" defaultChecked={service.is_featured} /> Show in homepage Top services</label>
                          <label className="admin-span-2">Short description<textarea name="short_description" rows={2} maxLength={300} defaultValue={service.short_description} required /></label>
                          <label className="admin-span-2">Detailed description<textarea name="detailed_description" rows={3} maxLength={2000} defaultValue={service.detailed_description} /></label>
                          <label className="admin-span-2">What to bring / send <small>one item per line</small><textarea name="requirements" rows={4} maxLength={6000} defaultValue={(service.requirements || []).join("\n")} /></label>
                          <label className="admin-span-2">Important note<textarea name="important_note" rows={2} maxLength={1000} defaultValue={service.important_note} /></label>
                          <label className="admin-span-2">Google title <small>optional — blank keeps automatic local SEO</small><input name="seo_title" maxLength={90} defaultValue={service.seo_title || ""} /></label>
                          <label className="admin-span-2">Google description <small>optional — blank keeps automatic local SEO</small><textarea name="seo_description" maxLength={190} rows={2} defaultValue={service.seo_description || ""} /></label>
                          <div className="admin-checks admin-span-2" aria-label="Service options">
                            <label><input type="checkbox" name="available_at_shop" defaultChecked={service.available_at_shop} /> At shop</label>
                            <label><input type="checkbox" name="pickup_available" defaultChecked={service.pickup_available} /> Pickup</label>
                            <label><input type="checkbox" name="delivery_available" defaultChecked={service.delivery_available} /> Delivery</label>
                            <label><input type="checkbox" name="doorstep_available" defaultChecked={service.doorstep_available} /> Home visit</label>
                            <label><input type="checkbox" name="appointment_required" defaultChecked={service.appointment_required} /> Appointment</label>
                          </div>
                          <div className="admin-form-actions admin-span-2"><AdminSubmitButton>Save service</AdminSubmitButton></div>
                        </form>
                        <form className="admin-destructive-row" action={archiveService}>
                          <input type="hidden" name="id" value={service.id} />
                          <AdminSubmitButton
                            variant="secondary"
                            pendingLabel="Archiving…"
                            confirmMessage={`Archive “${service.title}”? It will be hidden from the website and can be restored by changing its status later.`}
                          >
                            Archive service
                          </AdminSubmitButton>
                        </form>
                      </div>
                    </details>
                  );
                })}
                {categoryServices.length === 0 && <div className="admin-empty-state admin-empty-state--compact"><Wrench size={22} /><p>No services in this category.</p></div>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
