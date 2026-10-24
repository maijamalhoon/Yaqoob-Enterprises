"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ExternalLink,
  History,
  House,
  Images,
  LogOut,
  MapPinned,
  Megaphone,
  Menu,
  Settings2,
  Wrench,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { AdminThemeToggle } from "@/components/admin-theme-toggle";

const navigationGroups = [
  {
    label: "Workspace",
    links: [
      ["Overview", "/admin", House],
      ["Services", "/admin/services", Wrench],
      ["Coverage", "/admin/coverage", MapPinned],
      ["Gallery", "/admin/gallery", Images],
      ["Announcements", "/admin/announcements", Megaphone],
    ],
  },
  {
    label: "Manage",
    links: [
      ["Settings", "/admin/settings", Settings2],
      ["Analytics", "/admin/analytics", BarChart3],
      ["History", "/admin/history", History],
    ],
  },
] as const;

const pageTitles = [
  ["/admin", "Overview"],
  ["/admin/services", "Services"],
  ["/admin/coverage", "Coverage"],
  ["/admin/gallery", "Gallery"],
  ["/admin/announcements", "Announcements"],
  ["/admin/settings", "Settings"],
  ["/admin/analytics", "Analytics"],
  ["/admin/history", "History"],
] as const;

function isActivePath(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");
}

function NavigationLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {navigationGroups.map((group) => (
        <div className="admin-nav__group" key={group.label}>
          <span className="admin-nav__group-label">{group.label}</span>
          <nav aria-label={group.label + " navigation"}>
            {group.links.map(([label, href, Icon]) => {
              const active = isActivePath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={active ? "is-active" : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={onNavigate}
                >
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </>
  );
}

export function AdminNav({
  businessName,
  displayName,
}: {
  businessName: string;
  displayName: string;
}) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentTitle = pageTitles.find(([href]) => isActivePath(pathname, href))?.[1] || "Admin Centre";

  function openMenu() {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
      setMenuOpen(true);
    }
  }

  function closeMenu() {
    if (dialogRef.current?.open) dialogRef.current.close();
    setMenuOpen(false);
  }

  return (
    <div className="admin-chrome">
      <aside className="admin-sidebar" aria-label="Admin sidebar">
        <div className="admin-sidebar__brand">
          <Logo compact inverse href="/admin" />
        </div>
        <NavigationLinks pathname={pathname} />
      </aside>

      <header className="admin-topbar">
        <button
          className="admin-menu-trigger"
          type="button"
          aria-label="Open admin navigation"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          onClick={openMenu}
        >
          <Menu size={20} strokeWidth={1.9} aria-hidden="true" />
        </button>
        <div className="admin-topbar__title" aria-live="polite">
          <span>{businessName}</span>
          <p>{currentTitle}</p>
        </div>
        <div className="admin-topbar__actions">
          <AdminThemeToggle />
          <span className="admin-account-name">{displayName}</span>
          <Link href="/" target="_blank" rel="noopener noreferrer" aria-label="View website in a new tab">
            <ExternalLink size={17} strokeWidth={1.9} aria-hidden="true" />
            <span>View site</span>
          </Link>
          <form action="/admin/logout" method="post">
            <button type="submit" aria-label="Sign out">
              <LogOut size={17} strokeWidth={1.9} aria-hidden="true" />
              <span>Sign out</span>
            </button>
          </form>
        </div>
      </header>

      <dialog
        className="admin-drawer"
        ref={dialogRef}
        aria-labelledby="admin-drawer-title"
        onClose={() => setMenuOpen(false)}
      >
        <div className="admin-drawer__header">
          <div>
            <p id="admin-drawer-title">Admin navigation</p>
            <span>{businessName}</span>
          </div>
          <button className="admin-icon-button" type="button" aria-label="Close admin navigation" onClick={closeMenu}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <NavigationLinks pathname={pathname} onNavigate={closeMenu} />
      </dialog>
    </div>
  );
}
