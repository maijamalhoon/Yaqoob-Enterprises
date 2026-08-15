"use client";

import { useEffect } from "react";

export function DestructiveActionGuard() {
  useEffect(() => {
    function confirmDestructiveSubmit(event: SubmitEvent) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      const submitter = event.submitter instanceof HTMLElement ? event.submitter : null;
      const destructiveControl = submitter?.closest<HTMLElement>("[data-confirm], .danger-button")
        || form.querySelector<HTMLElement>("[data-confirm], .danger-button");
      if (!destructiveControl) return;

      const actionLabel = destructiveControl.textContent?.trim().toLowerCase() || "continue";
      const message = destructiveControl.dataset.confirm
        || `Are you sure you want to ${actionLabel}? This action cannot be undone.`;

      if (!window.confirm(message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }

    document.addEventListener("submit", confirmDestructiveSubmit, true);
    return () => document.removeEventListener("submit", confirmDestructiveSubmit, true);
  }, []);

  return null;
}
