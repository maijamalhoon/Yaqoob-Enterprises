import test from "node:test";
import assert from "node:assert/strict";
import { galleryImageFields, galleryMediaKind } from "../lib/admin-gallery-fields.ts";

function form(fields) {
  const d = new FormData();
  for (const [k, v] of Object.entries(fields)) d.set(k, v);
  return d;
}

const valid = {
  alt_text: "Front of the printing shop",
  media_kind: "real",
  display_order: "4",
  focal_x: "25.5",
  focal_y: "70",
};

test("gallery details are validated and normalized", () => {
  assert.deepEqual(galleryImageFields(form(valid)), {
    alt_text: "Front of the printing shop",
    media_kind: "real", display_order: 4, focal_x: 25.5, focal_y: 70,
  });
  assert.equal(galleryMediaKind(form({ ...valid, media_kind: "concept" })), "concept");
});

test("rejects unsupported image kinds and bad alt descriptions", () => {
  assert.throws(() => galleryImageFields(form({ ...valid, media_kind: "svg" })), /valid image type/);
  assert.throws(() => galleryImageFields(form({ ...valid, alt_text: "" })), /description/);
  assert.throws(() => galleryImageFields(form({ ...valid, alt_text: "x".repeat(181) })), /description/);
});

test("rejects malformed image positions or ordering", () => {
  for (const display_order of ["-1", "2.5", "10001", "abc", ""]) {
    assert.throws(() => galleryImageFields(form({ ...valid, display_order })), /display order/);
  }
  for (const focal_x of ["-4", "101", "Infinity", "7.123"]) {
    assert.throws(() => galleryImageFields(form({ ...valid, focal_x })), /focal position/);
  }
});
