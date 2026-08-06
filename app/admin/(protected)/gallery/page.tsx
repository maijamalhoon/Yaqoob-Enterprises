import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { deleteGalleryImage, updateGalleryImage, uploadGalleryImage } from "../actions";

export default async function AdminGalleryPage() {
  const { supabase } = await requireAdmin();
  const { data: images } = await supabase.from("gallery_images").select("*").order("display_order");

  return (
    <div className="admin-content">
      <div className="admin-page-heading"><div><span className="eyebrow">Media</span><h1>Shop gallery</h1><p>Upload real images, choose the featured homepage image and control mobile/desktop focal points.</p></div></div>
      <section className="admin-panel">
        <h2>Upload image</h2>
        <form className="admin-form-grid" action={uploadGalleryImage}>
          <label className="admin-span-2">Image file<input type="file" name="file" accept="image/*" required /></label>
          <label>Image type<select name="media_kind"><option value="real">Real shop photo</option><option value="concept">Concept preview</option></select></label>
          <label>Display order<input type="number" name="display_order" defaultValue={images?.length || 0} /></label>
          <label className="admin-span-2">Alt text<input name="alt_text" required placeholder="Describe what is visible in the image" /></label>
          <label className="admin-span-2">Caption<input name="caption" /></label>
          <label>Horizontal focus (0–100)<input type="number" min="0" max="100" name="focal_x" defaultValue="50" /></label>
          <label>Vertical focus (0–100)<input type="number" min="0" max="100" name="focal_y" defaultValue="50" /></label>
          <label className="checkbox-line admin-span-2"><input type="checkbox" name="is_featured" /> Featured homepage image</label>
          <button className="button button--primary" type="submit"><ImagePlus size={17} /> Upload image</button>
        </form>
      </section>
      <section className="admin-gallery-grid">
        {images?.map((image) => {
          const url = `https://kzikyufuyanfjlddyepo.supabase.co/storage/v1/object/public/shop-media/${image.storage_path}`;
          return (
            <article className="admin-gallery-card" key={image.id}>
              <div className="admin-gallery-preview"><Image src={url} alt={image.alt_text} fill sizes="(max-width:900px) 100vw, 30vw" style={{ objectPosition: `${image.focal_x}% ${image.focal_y}%` }} /></div>
              <form className="admin-form-grid" action={updateGalleryImage}>
                <input type="hidden" name="id" value={image.id} />
                <label className="admin-span-2">Alt text<input name="alt_text" defaultValue={image.alt_text} /></label>
                <label className="admin-span-2">Caption<input name="caption" defaultValue={image.caption} /></label>
                <label>Type<select name="media_kind" defaultValue={image.media_kind}><option value="real">Real</option><option value="concept">Concept</option></select></label>
                <label>Order<input type="number" name="display_order" defaultValue={image.display_order} /></label>
                <label>X focus<input type="number" min="0" max="100" name="focal_x" defaultValue={image.focal_x} /></label>
                <label>Y focus<input type="number" min="0" max="100" name="focal_y" defaultValue={image.focal_y} /></label>
                <div className="admin-checks admin-span-2"><label><input type="checkbox" name="is_featured" defaultChecked={image.is_featured} /> Featured</label><label><input type="checkbox" name="is_active" defaultChecked={image.is_active} /> Active</label></div>
                <button className="button button--primary" type="submit">Save image</button>
              </form>
              <form action={deleteGalleryImage}><input type="hidden" name="id" value={image.id} /><input type="hidden" name="storage_path" value={image.storage_path} /><button className="danger-button" type="submit"><Trash2 size={16} /> Delete image</button></form>
            </article>
          );
        })}
        {(!images || images.length === 0) && <div className="admin-empty-state"><ImagePlus size={30} /><h2>No uploaded images yet</h2><p>The public website currently uses the temporary concept image bundled with the code.</p></div>}
      </section>
    </div>
  );
}
