import test from "node:test";
import assert from "node:assert/strict";
import { parseAdminAnnouncement, validateAnnouncementLink } from "../lib/admin-announcement-fields.ts";

function form(fields) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}
const valid = { title: "Holiday Hours", message: "We will close early on Friday.", display_order: "3", is_active: "on" };

test("announcement payload accepts public and draft notices", () => {
  const active = parseAdminAnnouncement(form({ ...valid, link_url: "/rates", link_label: "Rates" }));
  assert.equal(active.link_url, "/rates");
  assert.equal(active.link_label, "Rates");
  assert.equal(active.is_active, true);
  const draft = parseAdminAnnouncement(form({ ...valid, is_active: "" }));
  assert.equal(draft.is_active, false);
  assert.equal(draft.link_url, null);
});

test("allows secure external URLs and blocks dangerous link protocols", () => {
  assert.equal(validateAnnouncementLink("https://wa.me/923492568864"), "https://wa.me/923492568864");
  for (const value of ["javascript:alert(1)", "data:text/html;base64,AAAA", "//evil.example", "http://evil.example", "/path\\evil"]) {
    assert.throws(() => validateAnnouncementLink(value), /secure https/);
  }
});

test("rejects incomplete, oversized and invalid announcement fields", () => {
  assert.throws(() => parseAdminAnnouncement(form({ ...valid, title: "X" })), /title/);
  assert.throws(() => parseAdminAnnouncement(form({ ...valid, message: "No" })), /message/);
  assert.throws(() => parseAdminAnnouncement(form({ ...valid, link_label: "Click" })), /link URL/);
  assert.throws(() => parseAdminAnnouncement(form({ ...valid, display_order: "-1" })), /order/);
  assert.throws(() => parseAdminAnnouncement(form({ ...valid, display_order: "1.7" })), /order/);
  assert.throws(() => parseAdminAnnouncement(form({ ...valid, display_order: "10001" })), /order/);
});
