export function businessLocationLabel(address: string) {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  while (parts.length > 0 && /^(pakistan|pk)$/i.test(parts.at(-1) || "")) {
    parts.pop();
  }

  if (parts.length >= 2) return parts.slice(-2).join(", ");
  return parts[0] || "Local area";
}

export function businessCity(address: string) {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !/^(pakistan|pk)$/i.test(part));

  return parts.at(-1) || "Karachi";
}
