import assert from "node:assert/strict";
import test from "node:test";
import { normalizeServiceDetailPath, rankServicePageViews } from "../lib/admin-service-interest.ts";

test("recognizes only actual service detail URLs", () => {
  assert.equal(normalizeServiceDetailPath("/services/printing/book-binding"), "/services/printing/book-binding");
  assert.equal(normalizeServiceDetailPath("/services/printing/book-binding?utm_source=google"), "/services/printing/book-binding");
  assert.equal(normalizeServiceDetailPath("/services/printing"), null);
  assert.equal(normalizeServiceDetailPath("/services"), null);
  assert.equal(normalizeServiceDetailPath(null), null);
});
test("ranks actual services, not service categories or landing pages", () => {
  const categories=[{id:"c1",slug:"printing",title:"Printing"}];
  const services=[{category_id:"c1",slug:"book-binding",title:"Book Binding"}];
  const events=[{page_path:"/services/printing/book-binding"},{page_path:"/services/printing/book-binding"},{page_path:"/services/printing"}];
  assert.deepEqual(rankServicePageViews(events,categories,services),[["Book Binding · Printing",2]]);
});
test("unlisted URLs stay transparently labeled by their path", () => {
  assert.deepEqual(rankServicePageViews([{page_path:"/services/other/unknown"}],[],[]), [["/services/other/unknown",1]]);
});
