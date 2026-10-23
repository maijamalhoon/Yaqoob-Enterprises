"use client";

import { useEffect, useRef, useState } from "react";

type PendingAction = {
  form: HTMLFormElement;
  submitter: HTMLButtonElement | HTMLInputElement | null;
  message: string;
};

export function DestructiveActionGuard() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pendingActionRef = useRef<PendingAction | null>(null);
  const approvedFormRef = useRef<HTMLFormElement | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function confirmDestructiveSubmit(event: SubmitEvent) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (approvedFormRef.current === form) {
        approvedFormRef.current = null;
        return;
      }

      const submitter = event.submitter instanceof HTMLElement ? event.submitter : null;
      const destructiveControl = submitter?.closest<HTMLElement>("[data-confirm], .danger-button")
        || form.querySelector<HTMLElement>("[data-confirm], .danger-button");
      if (!destructiveControl) return;

      const actionLabel = destructiveControl.textContent?.trim().toLowerCase() || "continue";
      const confirmation = destructiveControl.dataset.confirm
        || "Are you sure you want to " + actionLabel + "? This action cannot be undone.";

      event.preventDefault();
      event.stopImmediatePropagation();
      pendingActionRef.current = {
        form,
        submitter: submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement ? submitter : null,
        message: confirmation,
      };
      setMessage(confirmation);
      dialogRef.current?.showModal();
    }

    document.addEventListener("submit", confirmDestructiveSubmit, true);
    return () => document.removeEventListener("submit", confirmDestructiveSubmit, true);
  }, []);

  function cancelAction() {
    pendingActionRef.current = null;
    setMessage("");
    if (dialogRef.current?.open) dialogRef.current.close();
  }

  function confirmAction() {
    const pendingAction = pendingActionRef.current;
    pendingActionRef.current = null;
    setMessage("");
    if (dialogRef.current?.open) dialogRef.current.close();
    if (!pendingAction || !pendingAction.form.isConnected) return;

    approvedFormRef.current = pendingAction.form;
    if (
      pendingAction.submitter
      && pendingAction.submitter.isConnected
      && !pendingAction.submitter.disabled
    ) {
      pendingAction.form.requestSubmit(pendingAction.submitter);
    } else {
      pendingAction.form.requestSubmit();
    }
  }

  return (
    <dialog
      className="admin-confirm-dialog"
      ref={dialogRef}
      aria-labelledby="admin-confirm-title"
      aria-describedby="admin-confirm-message"
      onClose={() => {
        pendingActionRef.current = null;
        setMessage("");
      }}
    >
      <h2 id="admin-confirm-title">Confirm this action</h2>
      <p id="admin-confirm-message">{message}</p>
      <div className="admin-confirm-dialog__actions">
        <button className="button button--secondary" type="button" autoFocus onClick={cancelAction}>
          Cancel
        </button>
        <button className="danger-button" type="button" onClick={confirmAction}>
          Continue
        </button>
      </div>
    </dialog>
  );
}
