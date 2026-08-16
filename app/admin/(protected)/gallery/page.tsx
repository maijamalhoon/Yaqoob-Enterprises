import Image from "next/image";
import { Eye, EyeOff, ImagePlus, Star } from "lucide-react";
import { AdminSubmitButton } from "@/components/admin-form-buttons";
import { GalleryUploadForm } from "@/components/gallery-upload-form";
import { requireAdmin } from "@/lib/admin";
import { assertQuerySucceeded } from "@/lib/supabase/query-error";
import { publicStorageUrl } from "@/lib/supabase/storage";
import { archiveGalleryImage, updateGalleryImage } from "./actions";

export default async function AdminGalleryPage() {
  const { supabase } = await requireAdmin();
  const { data: images, error } = await supabase.from("gallery_images").select("*").order("display_order");
  assertQuerySucceeded(error, "gallery images");
  const imageList = images || [];
  const activeImages = imageList.filter((image) => image.is_active);
  const featuredImages = activeImages.filter((image) => image.is_featured && image.media_kind === "real");
  const featuredImage = featuredImages[0];

  return (
    <div className="admin-content admin-control-page">
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">Website media</span>
          <h1>Homepage image</h1>
          <p>Upload shop photos and choose exactly which image appears in the homepage hero.</p>
        </div>
        <div className="admin-heading-metrics">
          <span><strong>{activeImages.length}</strong> active</span>
          <span className={featuredImages.length === 1 ? "is-good" : "is-warning"}><strong>{featuredImages.length}</strong> featured</span>
        </div>
      </div>

      <details className="admin-panel admin-create-panel admin-upload-panel">
        <summary><span><ImagePlus size={17} /> Upload shop image</span><small>Prepared in your browser</small></summary>
        <GalleryUploadForm defaultFeatured={!featuredImage} defaultOrder={imageList.length} />
      </details>

      <section className="admin-media-grid">
        {imageList.map((image) => {
          const url = publicStorageUrl("shop-media", image.storage_path);
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
                <form className="admin-form-grid admin-form-grid--focused" action={updateGalleryImage}>
                  <input type="hidden" name="id" value={image.id} />
                  <label className="admin-span-2">Alt text<input name="alt_text" maxLength={180} defaultValue={image.alt_text} required /></label>
                  <label>Type<select name="media_kind" defaultValue={image.media_kind}><option value="real">Real shop photo</option><option value="concept">Concept image</option></select></label>
                  <label>Order<input type="number" min="0" max="10000" name="display_order" defaultValue={image.display_order} /></label>
                  <label>Horizontal focus<input type="number" min="0" max="100" name="focal_x" defaultValue={image.focal_x} /></label>
                  <label>Vertical focus<input type="number" min="0" max="100" name="focal_y" defaultValue={image.focal_y} /></label>
                  <div className="admin-checks admin-span-2">
                    <label><input type="checkbox" name="is_featured" defaultChecked={image.is_featured} /> Homepage image</label>
                    <label><input type="checkbox" name="is_active" defaultChecked={image.is_active} /> Active</label>
                  </div>
                  <div className="admin-form-actions admin-span-2"><AdminSubmitButton>Save image</AdminSubmitButton></div>
                </form>
                {image.is_active && (
                  <form className="admin-destructive-row" action={archiveGalleryImage}>
                    <input type="hidden" name="id" value={image.id} />
                    <AdminSubmitButton
                      variant="secondary"
                      pendingLabel="Archiving…"
                      confirmMessage="Archive this image? It will be hidden from the website and can be restored by enabling Active later."
                    >
                      Archive image
                    </AdminSubmitButton>
                  </form>
                )}
              </details>
            </article>
          );
        })}
        {imageList.length === 0 && <div className="admin-empty-state"><ImagePlus size={28} /><h2>No shop images yet</h2><p>Upload one image and mark it as the homepage image.</p></div>}
      </section>
    </div>
  );
}
