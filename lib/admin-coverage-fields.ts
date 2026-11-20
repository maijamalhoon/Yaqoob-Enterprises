export type AdminCoverageFields = {
  name: string;
  notes: string;
  display_order: number;
  delivery_available: boolean;
  doorstep_biometric_available: boolean;
  pickup_available: boolean;
  extra_charge_may_apply: boolean;
  is_active: boolean;
};

function read(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function enabled(form: FormData, key: string) {
  return form.get(key) === "on" || form.get(key) === "true";
}

export function parseAdminCoverage(form: FormData, isCreate: boolean): AdminCoverageFields {
  const name = read(form, "name");
  const notes = read(form, "notes");
  const rawOrder = read(form, "display_order");

  if (name.length < 2 || name.length > 100) throw new Error("Area name must be between 2 and 100 characters.");
  if (notes.length > 2000) throw new Error("Area notes must be under 2000 characters.");
  if (!/^\d{1,5}$/.test(rawOrder) || Number(rawOrder) > 10_000) {
    throw new Error("Display order must be a whole number from 0 to 10000.");
  }
  return {
    name,
    notes,
    display_order: Number(rawOrder),
    delivery_available: enabled(form, "delivery_available"),
    doorstep_biometric_available: enabled(form, "doorstep_biometric_available"),
    pickup_available: enabled(form, "pickup_available"),
    extra_charge_may_apply: enabled(form, "extra_charge_may_apply"),
    is_active: isCreate ? true : enabled(form, "is_active"),
  };
}
