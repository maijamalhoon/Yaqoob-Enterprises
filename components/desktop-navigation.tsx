"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function DesktopNavigation() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  const active = pathname.startsWith("/services")
    ? "services"
    : pathname === "/contact"
      ? "contact"
      : pathname === "/" && hash === "#services"
        ? "services"
        : pathname === "/" && hash === "#get-in-touch"
          ? "contact"
          : pathname === "/"
            ? "home"
            : "";

  return (
    <nav className="desktop-nav" aria-label="Primary navigation">
      <Link className={active === "home" ? "is-active" : undefined} aria-current={active === "home" ? "page" : undefined} href="/">Home</Link>
      <Link className={active === "services" ? "is-active" : undefined} aria-current={active === "services" ? (pathname.startsWith("/services") ? "page" : "location") : undefined} href="/#services">Services</Link>
      <Link className={active === "contact" ? "is-active" : undefined} aria-current={active === "contact" ? (pathname === "/contact" ? "page" : "location") : undefined} href="/#get-in-touch">Get in touch</Link>
    </nav>
  );
}
