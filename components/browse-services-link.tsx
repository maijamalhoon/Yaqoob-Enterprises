"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

interface BrowseServicesLinkProps {
  className?: string;
  iconClassName?: string;
  children?: ReactNode;
}

export function BrowseServicesLink({
  className,
  iconClassName,
  children = "Browse services",
}: BrowseServicesLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById("services");
    if (!target) return;

    e.preventDefault();

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Smoothly scroll to the services showcase
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });

    // Update the URL hash smoothly without triggering an abrupt jump
    if (typeof window !== "undefined" && window.history.pushState) {
      window.history.pushState(null, "", "#services");
      window.dispatchEvent(new Event("hashchange"));
    } else if (typeof window !== "undefined") {
      window.location.hash = "services";
    }

    // Trigger subtle, elegant highlight pulse animation on target
    target.classList.remove("services-highlight-pulse");
    void target.offsetWidth; // Force reflow
    target.classList.add("services-highlight-pulse");
  };

  return (
    <Link
      href="#services"
      className={className}
      onClick={handleClick}
      aria-label="Browse services showcase"
    >
      <span>{children}</span>
      <span className={iconClassName} aria-hidden="true">
        <ArrowDown size={15} />
      </span>
    </Link>
  );
}
