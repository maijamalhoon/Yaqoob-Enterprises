"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export type AdminFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialState: AdminFormState = { status: "idle", message: "" };

export function AdminActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
}: {
  action: (previousState: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [result, formAction] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [messageHidden, setMessageHidden] = useState(false);

  useEffect(() => {
    if (result.status === "success" && resetOnSuccess) {
      formRef.current?.reset();
    }
  }, [result, resetOnSuccess]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className={className}
      onInput={() => setMessageHidden(true)}
      onChange={() => setMessageHidden(true)}
      onSubmit={() => setMessageHidden(false)}
    >
      {children}
      {result.status !== "idle" && !messageHidden && (
        <p
          role={result.status === "error" ? "alert" : "status"}
          className={"admin-action-result admin-action-result--" + result.status}
        >
          {result.message}
        </p>
      )}
    </form>
  );
}
