"use client";

import { type FormEvent, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  completeGalleryUpload,
  createGalleryUpload,
  discardGalleryUpload,
} from "@/app/admin/(protected)/gallery/actions";
import { OptimizedImageInput } from "@/components/optimized-image-input";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type Feedback = { kind: "error" | "success"; message: string } | null;

export function GalleryUploadForm({
  defaultFeatured,
  defaultOrder,
}: {
  defaultFeatured: boolean;
  defaultOrder: number;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [inputKey, setInputKey] = useState(0);
  const [preparing, setPreparing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!file || preparing || submitting) return;

    const formData = new FormData(form);
    formData.delete("file");

    setSubmitting(true);
    setFeedback(null);
    let uploadPath: string | null = null;
    let completionStarted = false;

    try {
      const signedUpload = await createGalleryUpload({ contentType: file.type, size: file.size });
      if (!signedUpload.ok) {
        setFeedback({ kind: "error", message: signedUpload.message });
        return;
      }

      uploadPath = signedUpload.path;
      const supabase = createBrowserSupabaseClient();
      const { error: uploadError } = await supabase.storage
        .from("shop-media")
        .uploadToSignedUrl(signedUpload.path, signedUpload.token, file, {
          cacheControl: "31536000",
          contentType: file.type,
        });

      if (uploadError) {
        setFeedback({ kind: "error", message: "The image upload failed. Check the connection and try again." });
        return;
      }

      formData.set("storage_path", signedUpload.path);
      completionStarted = true;
      const completed = await completeGalleryUpload(formData);
      if (!completed.ok) {
        completionStarted = false;
        setFeedback({ kind: "error", message: completed.message });
        return;
      }

      uploadPath = null;
      form.reset();
      const featuredControl = form.elements.namedItem("is_featured");
      if (featuredControl instanceof HTMLInputElement) featuredControl.checked = false;
      const orderControl = form.elements.namedItem("display_order");
      if (orderControl instanceof HTMLInputElement) {
        const submittedOrder = Number(formData.get("display_order"));
        orderControl.value = String(Number.isSafeInteger(submittedOrder) ? Math.min(10_000, submittedOrder + 1) : defaultOrder + 1);
      }
      setFile(null);
      setInputKey((value) => value + 1);
      setFeedback({
        kind: "success",
        message: "Image uploaded successfully.",
      });
      router.refresh();
    } catch {
      setFeedback({
        kind: "error",
        message: completionStarted
          ? "The upload may have completed, but confirmation was interrupted. Refresh the gallery before uploading it again."
          : "The upload could not be completed. Please try again.",
      });
    } finally {
      // A failed completion response cannot prove whether its database write committed.
      if (uploadPath && !completionStarted) {
        try {
          await discardGalleryUpload(uploadPath);
        } catch {
          // The object is namespaced to this administrator and can be cleaned up later.
        }
      }
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-form-grid admin-form-grid--focused" onSubmit={submit}>
      <label className="admin-span-2">
        Image
        <OptimizedImageInput
          key={inputKey}
          disabled={submitting}
          onBusyChange={setPreparing}
          onFileReady={setFile}
        />
      </label>
      <label>Type<select name="media_kind" defaultValue="real"><option value="real">Real shop photo</option><option value="concept">Concept image</option></select></label>
      <label>Order<input type="number" min="0" max="10000" name="display_order" defaultValue={defaultOrder} /></label>
      <label className="admin-span-2">Alt text<input name="alt_text" maxLength={180} required placeholder="Short description of the photo" /></label>
      <label>Horizontal focus<input type="number" min="0" max="100" name="focal_x" defaultValue="50" /></label>
      <label>Vertical focus<input type="number" min="0" max="100" name="focal_y" defaultValue="50" /></label>
      <label className="checkbox-line admin-span-2"><input type="checkbox" name="is_featured" defaultChecked={defaultFeatured} /> Use as homepage hero image</label>
      {feedback && (
        <p className="form-message admin-span-2" role={feedback.kind === "error" ? "alert" : "status"}>
          {feedback.message}
        </p>
      )}
      <div className="admin-form-actions admin-span-2">
        <button
          className="button button--primary admin-submit-button"
          type="submit"
          disabled={!file || preparing || submitting}
          aria-disabled={!file || preparing || submitting}
        >
          {submitting && <LoaderCircle className="admin-spin" size={16} aria-hidden="true" />}
          {submitting ? "Uploading…" : "Upload image"}
        </button>
      </div>
    </form>
  );
}
