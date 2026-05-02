export function formatCurrency(value?: number | string | null) {
  const amount = Number(value ?? 0);
  return `Rs. ${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })}`;
}