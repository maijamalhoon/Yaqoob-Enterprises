"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronRight,
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
import { AdminCommandMenu } from "@/components/admin-command-menu";
import { adminNavigationGroups, getAdminPage, isActiveAdminPath } from "@/lib/admin-navigation";
import type { LucideIcon } from "lucide-react";

const navigationIcons: Record<string, LucideIcon> = {
  "/admin": House,
  "/admin/analytics": BarChart3,
  "/admin/services": Wrench,
  "/admin/coverage": MapPinned,
  "/admin/gallery": Images,
  "/admin/announcements": Megaphone,
  "/admin/settings": Settings2,
  "/admin/history": History,
};

function NavigationLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {adminNavigationGroups.map((group) => (
        <div className="admin-nav__group" key={group.label}>
          <span className="admin-nav__group-label">{group.label}</span>
          <nav aria-label={group.label + " navigation"}>
            {group.links.map(({ label, href }) => {
              const Icon = navigationIcons[href] || House;
              const active = isActiveAdminPath(pathname, href);
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
  const currentPage = getAdminPage(pathname);
  const currentTitle = currentPage?.label || "Admin Centre";
  const currentSection = currentPage?.section || "Workspace";

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
          <span className="admin-sidebar__brand-tag">Admin</span>
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
        <div className="admin-topbar__location" aria-label="Current section" aria-live="polite">
          <span>{currentSection}</span>
          <ChevronRight size={14} aria-hidden="true" />
          <strong>{currentTitle}</strong>
        </div>
        <div className="admin-topbar__actions">
          <AdminCommandMenu />
          <span className="admin-user-chip" title={displayName} aria-label={"Signed in as " + displayName}>
            {displayName.trim().charAt(0).toUpperCase() || "A"}
          </span>
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
