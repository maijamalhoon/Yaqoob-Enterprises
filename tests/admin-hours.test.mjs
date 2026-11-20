import test from "node:test";
import assert from "node:assert/strict";
import { parseAdminOpeningHours } from "../lib/admin-hours.ts";

function form(values) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

test("normal opening hours create one period", () => {
  const result = parseAdminOpeningHours(form({ first_opens_at: "09:00", first_closes_at: "18:30" }));
  assert.deepEqual(result, { isClosed: false, periods: [{ opens_at: "09:00", closes_at: "18:30", closes_next_day: false }] });
});

test("overnight closing is preserved", () => {
  const result = parseAdminOpeningHours(form({ first_opens_at: "19:00", first_closes_at: "01:00" }));
  assert.equal(result.periods[0].closes_next_day, true);
});

test("two disjoint periods are accepted and sorted", () => {
  const result = parseAdminOpeningHours(form({
    first_opens_at: "08:00", first_closes_at: "13:00",
    second_opens_at: "15:00", second_closes_at: "22:00",
  }));
  assert.deepEqual(result.periods.map(p => p.opens_at), ["08:00", "15:00"]);
});

test("overlapping periods are rejected", () => {
  assert.throws(() => parseAdminOpeningHours(form({
    first_opens_at: "09:00", first_closes_at: "15:00",
    second_opens_at: "14:00", second_closes_at: "18:00",
  })), /overlap/);
});

test("overnight first period cannot overlap a second", () => {
  assert.throws(() => parseAdminOpeningHours(form({
    first_opens_at: "18:00", first_closes_at: "02:00",
    second_opens_at: "19:00", second_closes_at: "23:00",
  })), /overnight/);
});

test("closed day ignores unfinished time inputs", () => {
  const result = parseAdminOpeningHours(form({ is_closed: "on", first_opens_at: "10:00", first_closes_at: "" }));
  assert.deepEqual(result, { isClosed: true, periods: [] });
});

test("invalid and incomplete time inputs are rejected", () => {
  assert.throws(() => parseAdminOpeningHours(form({ first_opens_at: "25:00", first_closes_at: "18:00" })), /valid 24-hour/);
  assert.throws(() => parseAdminOpeningHours(form({ first_opens_at: "10:00" })), /both opening and closing/);
  assert.throws(() => parseAdminOpeningHours(form({ second_opens_at: "15:00", second_closes_at: "18:00" })), /first period/);
  assert.throws(() => parseAdminOpeningHours(form({})), /Add an opening period/);
});
