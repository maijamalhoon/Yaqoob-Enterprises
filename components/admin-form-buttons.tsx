"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Trash2 } from "lucide-react";

export function AdminSubmitButton({
  children,
  variant = "primary",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      className={`button button--${variant} admin-submit-button`}
      type="submit"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending && <LoaderCircle className="admin-spin" size={16} aria-hidden="true" />}
      {pending ? "Saving…" : children}
    </button>
  );
}

export function AdminDeleteButton({
  label,
  confirmMessage,
}: {
  label: string;
  confirmMessage: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      className="danger-button"
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      data-confirm={confirmMessage}
    >
      {pending ? <LoaderCircle className="admin-spin" size={16} aria-hidden="true" /> : <Trash2 size={16} aria-hidden="true" />}
      {pending ? "Deleting…" : label}
    </button>
  );
}
