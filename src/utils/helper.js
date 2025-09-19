export function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

export function randomId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}
