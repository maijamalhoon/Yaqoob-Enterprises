"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, Images, MapPinned, Settings, Wrench } from "lucide-react";
import { Logo } from "@/components/logo";

const links = [
  ["Dashboard", "/admin", Home],
  ["Services", "/admin/services", Wrench],
  ["Coverage", "/admin/coverage", MapPinned],
  ["Gallery", "/admin/gallery", Images],
  ["Analytics", "/admin/analytics", BarChart3],
  ["Settings", "/admin/settings", Settings],
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="admin-nav">
      <Logo compact inverse href="/admin" />
      <nav aria-label="Admin navigation">
        {links.map(([label, href, Icon]) => {
          const active = href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={active ? "is-active" : undefined}
              aria-current={active ? "page" : undefined}
              title={label}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <Link className="admin-view-site" href="/" target="_blank" rel="noopener noreferrer">View public website</Link>
      <form action="/admin/logout" method="post"><button type="submit">Sign out</button></form>
    </aside>
  );
}
