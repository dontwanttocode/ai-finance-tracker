export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount == null || isNaN(Number(amount))) return '₹0.00'
  return `₹${Number(amount).toFixed(2)}`
}
