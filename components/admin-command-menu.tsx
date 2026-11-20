"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Command, CornerDownLeft, Search, X } from "lucide-react";
import { adminNavigationItems } from "@/lib/admin-navigation";

/** Native modal dialog: single keyboard-accessible search for every Admin section. */
export function AdminCommandMenu() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const normalizedQuery = query.trim().toLowerCase();
  const matches = adminNavigationItems.filter((item) =>
    !normalizedQuery || [item.label, item.description, item.section, item.keywords]
      .some((value) => value.toLowerCase().includes(normalizedQuery)),
  );

  function openMenu() {
    if (dialogRef.current?.open) return;
    setQuery("");
    setSelected(0);
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function closeMenu() {
    if (dialogRef.current?.open) dialogRef.current.close();
    setOpen(false);
    setQuery("");
    setSelected(0);
  }

  function navigate(href: string) {
    closeMenu();
    router.push(href);
  }

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) {
          dialogRef.current.close();
          setOpen(false);
        } else {
          dialogRef.current?.showModal();
          setOpen(true);
          setQuery("");
          setSelected(0);
        }
      }
    }
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      <button className="admin-command-trigger" type="button" onClick={openMenu} aria-label="Search admin pages">
        <Search size={17} strokeWidth={1.9} aria-hidden="true" />
        <span>Search</span>
        <kbd>Ctrl K</kbd>
      </button>
      <dialog className="admin-command-dialog" ref={dialogRef}
        aria-labelledby="admin-command-heading" onClose={() => { setOpen(false); setQuery(""); setSelected(0); }}>
        <div className="admin-command-dialog__content">
          <div className="admin-command-dialog__header">
            <Search size={21} aria-hidden="true" />
            <input ref={inputRef} type="search" value={query}
              role="combobox" aria-label="Find an admin section"
              aria-autocomplete="list" aria-controls="admin-command-list" aria-expanded={open}
              aria-activedescendant={matches[selected] ? "admin-command-" + matches[selected].href.replaceAll("/", "-") : undefined}
              placeholder="Search pages, reports or settings..."
              onChange={(event) => { setQuery(event.target.value); setSelected(0); }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") { event.preventDefault(); setSelected((n) => Math.min(n + 1, matches.length - 1)); }
                if (event.key === "ArrowUp") { event.preventDefault(); setSelected((n) => Math.max(0, n - 1)); }
                if (event.key === "Enter" && matches[selected]) { event.preventDefault(); navigate(matches[selected].href); }
              }}/>
            <button type="button" className="admin-command-dialog__close" onClick={closeMenu} aria-label="Close search"><X size={18} /></button>
          </div>
          <div className="admin-command-dialog__label" id="admin-command-heading">
            <span>Jump to</span><span>{matches.length} {matches.length === 1 ? "page" : "pages"}</span>
          </div>
          <div id="admin-command-list" className="admin-command-dialog__list" role="listbox" aria-label="Matching admin pages">
            {matches.map((item, index) => (
              <button key={item.href} type="button" role="option"
                id={"admin-command-" + item.href.replaceAll("/", "-")}
                aria-selected={selected === index}
                className={selected === index ? "is-selected" : ""}
                onMouseEnter={() => setSelected(index)}
                onClick={() => navigate(item.href)}>
                <span className="admin-command-dialog__result">
                  <strong>{item.label}</strong><small>{item.description}</small>
                </span>
                <span className="admin-command-dialog__section">{item.section}</span>
                {selected === index && <CornerDownLeft size={16} aria-hidden="true" />}
              </button>
            ))}
            {matches.length === 0 && <p className="admin-command-dialog__empty">No matching pages. Try “services”, “backup” or “analytics”.</p>}
          </div>
          <div className="admin-command-dialog__footer">
            <span><Command size={14} aria-hidden="true" /> All admin sections</span>
            <span><kbd>↑</kbd><kbd>↓</kbd> select <kbd>↵</kbd> open <kbd>Esc</kbd> close</span>
          </div>
        </div>
      </dialog>
    </>
  );
}
