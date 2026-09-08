"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export function AnalyticsRefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={isPending}
      className="admin-heading-action button button--secondary"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.45rem",
        minHeight: "2.4rem",
        padding: "0.45rem 0.85rem",
        fontSize: "0.78rem",
        fontWeight: 700,
        borderRadius: "0.62rem",
        cursor: isPending ? "wait" : "pointer",
        opacity: isPending ? 0.75 : 1,
      }}
      aria-label="Refresh analytics data"
    >
      <RefreshCw
        size={14}
        style={{
          animation: isPending ? "spin 1s linear infinite" : "none",
          transition: "transform 140ms ease",
        }}
      />
      <span>{isPending ? "Updating..." : "Refresh data"}</span>
    </button>
  );
}
