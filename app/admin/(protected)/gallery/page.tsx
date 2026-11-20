import Image from "next/image";
import { AdminActionForm } from "@/components/admin-action-form";
import { Eye, EyeOff, ImagePlus, Star } from "lucide-react";
import { AdminCancelButton, AdminDeleteButton, AdminSubmitButton } from "@/components/admin-form-buttons";
import { OptimizedImageInput } from "@/components/optimized-image-input";
import { requireAdmin } from "@/lib/admin";
import { SUPABASE_URL } from "@/lib/env";
import { deleteGalleryImageWithFeedback, updateGalleryImageWithFeedback, uploadGalleryImageWithFeedback } from "./actions";

export default async function AdminGalleryPage() {
  const { supabase } = await requireAdmin();
  const { data: images, error } = await supabase.from("gallery_images").select("*").order("display_order");
  if (error) throw new Error("Gallery could not be loaded. Please retry.");
  const imageList = images || [];
  const activeImages = imageList.filter((image) => image.is_active);
  const featuredImage = activeImages.find((image) => image.is_featured && image.media_kind === "real");

  return (
    <div className="admin-content admin-control-page">
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">Website media</span>
          <h1>Homepage image</h1>
          <p>Upload, preview and manage shop photos. Choose one real, active image for the homepage hero.</p>
        </div>
        <div className="admin-heading-metrics">
          <span><strong>{activeImages.length}</strong> active</span>
          <span className={featuredImage ? "is-good" : "is-warning"}><strong>{featuredImage ? "1" : "0"}</strong> featured</span>
        </div>
      </div>

      <details className="admin-panel admin-create-panel admin-upload-panel">
        <summary><span><ImagePlus size={17} /> Upload shop image</span><small>JPG, PNG, WebP · auto-optimized</small></summary>
        <AdminActionForm className="admin-form-grid admin-form-grid--focused" action={uploadGalleryImageWithFeedback} resetOnSuccess>
          <label className="admin-span-2">Image<OptimizedImageInput /></label>
          <label>Type<select name="media_kind" defaultValue="real"><option value="real">Real shop photo</option><option value="concept">Concept image</option></select></label>
          <label>Order<input type="number" min="0" name="display_order" max="10000" step="1" defaultValue={imageList.length} /></label>
          <label className="admin-span-2">Alt text<input name="alt_text" required minLength={3} maxLength={180} placeholder="Describe what customers see" /></label>
          <label>Horizontal focus<input type="number" min="0" max="100" name="focal_x" step="0.01" defaultValue="50" /></label>
          <label>Vertical focus<input type="number" min="0" max="100" name="focal_y" step="0.01" defaultValue="50" /></label>
          <label className="checkbox-line admin-span-2"><input type="checkbox" name="is_featured" defaultChecked={!featuredImage} /> Use as homepage hero image</label>
          <div className="admin-form-actions admin-span-2"><AdminSubmitButton pendingLabel="Uploading image…">Upload image</AdminSubmitButton><AdminCancelButton /></div>
        </AdminActionForm>
      </details>

      <section className="admin-media-grid">
        {imageList.map((image) => {
          const url = `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/shop-media/${image.storage_path}`;
          const isHomepageImage = image.is_featured && image.is_active && image.media_kind === "real";
          return (
            <article className={`admin-media-card ${isHomepageImage ? "is-featured" : ""}`} key={image.id}>
              <div className="admin-gallery-preview">
                <Image
                  src={url}
                  alt={image.alt_text}
                  fill
                  sizes="(max-width:900px) 100vw, 33vw"
                  style={{ objectPosition: `${image.focal_x}% ${image.focal_y}%` }}
                />
                <div className="admin-media-badges">
                  {isHomepageImage && <span className="admin-media-badge admin-media-badge--featured"><Star size={13} /> Homepage</span>}
                  <span className={`admin-media-badge ${image.is_active ? "" : "is-muted"}`}>{image.is_active ? <Eye size={13} /> : <EyeOff size={13} />}{image.is_active ? "Active" : "Hidden"}</span>
                </div>
              </div>
              <div className="admin-media-card__caption">
                <strong>{image.alt_text}</strong>
                <small>{image.media_kind === "real" ? "Shop photo" : "Concept image"}</small>
              </div>
              <details className="admin-inline-editor admin-media-editor">
                <summary>Edit image</summary>
                <AdminActionForm className="admin-form-grid admin-form-grid--focused" action={updateGalleryImageWithFeedback}>
                  <input type="hidden" name="id" value={image.id} />
                  <label className="admin-span-2">Alt text<input name="alt_text" defaultValue={image.alt_text} required minLength={3} maxLength={180} /></label>
                  <label>Type<select name="media_kind" defaultValue={image.media_kind}><option value="real">Real shop photo</option><option value="concept">Concept image</option></select></label>
                  <label>Order<input type="number" min="0" name="display_order" max="10000" step="1" defaultValue={image.display_order} /></label>
                  <label>Horizontal focus<input type="number" min="0" max="100" name="focal_x" step="0.01" defaultValue={image.focal_x} /></label>
                  <label>Vertical focus<input type="number" min="0" max="100" name="focal_y" step="0.01" defaultValue={image.focal_y} /></label>
                  <div className="admin-checks admin-span-2">
                    <label><input type="checkbox" name="is_featured" defaultChecked={image.is_featured} /> Homepage image</label>
                    <label><input type="checkbox" name="is_active" defaultChecked={image.is_active} /> Active</label>
                  </div>
                  <div className="admin-form-actions admin-span-2"><AdminSubmitButton>Save image</AdminSubmitButton><AdminCancelButton /></div>
                </AdminActionForm>
                <AdminActionForm className="admin-destructive-row" action={deleteGalleryImageWithFeedback}>
                  <input type="hidden" name="id" value={image.id} />
                  <AdminDeleteButton label="Delete image" confirmMessage="Remove this image from Gallery? The file stays in storage so History can restore it." />
                </AdminActionForm>
              </details>
            </article>
          );
        })}
        {imageList.length === 0 && <div className="admin-empty-state"><ImagePlus size={28} /><h2>No shop images yet</h2><p>Upload one image and mark it as the homepage image.</p></div>}
      </section>
    </div>
  );
}
