export function formatDate(value?: string | Date | null) {
  if (!value) return "";

  const date = typeof value === "string" ? new Date(value) : value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function getMonthLabel(month: number, year?: number) {
  const date = new Date(year ?? new Date().getFullYear(), month - 1, 1);
  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: year ? "numeric" : undefined
  });
}
