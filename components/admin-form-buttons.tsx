"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Trash2 } from "lucide-react";

export function AdminSubmitButton({
  children,
  variant = "primary",
  pendingLabel = "Saving…",
  confirmMessage,
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
  pendingLabel?: string;
  confirmMessage?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  const buttonClass = ("button button--" + variant + " admin-submit-button " + className).trim();

  return (
    <>
      <button
        className={buttonClass}
        type="submit"
        disabled={pending}
        aria-busy={pending}
        data-confirm={confirmMessage}
      >
        {pending && <LoaderCircle className="admin-spin" size={16} aria-hidden="true" />}
        {pending ? pendingLabel : children}
      </button>
    </>
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
    <>
      <button
        className="danger-button"
        type="submit"
        disabled={pending}
        aria-busy={pending}
        data-confirm={confirmMessage}
      >
        {pending ? <LoaderCircle className="admin-spin" size={16} aria-hidden="true" /> : <Trash2 size={16} aria-hidden="true" />}
        {pending ? "Deleting…" : label}
      </button>
    </>
  );
}

export function AdminCancelButton({ label = "Cancel" }: { label?: string }) {
  return (
    <button
      className="button button--secondary admin-cancel-button"
      type="button"
      onClick={(event) => {
        const form = event.currentTarget.closest("form");
        if (!form) return;
        form.reset();
        const disclosure = form.closest("details");
        if (disclosure) {
          disclosure.open = false;
          disclosure.querySelector<HTMLElement>("summary")?.focus();
        }
      }}
    >
      {label}
    </button>
  );
}
