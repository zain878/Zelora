// Small helpers for working with the placeholder price strings in
// products.js (e.g. "$320", "$1,180") without pulling in a currency library.

export function parsePrice(priceString) {
  const numeric = Number(String(priceString).replace(/[^0-9.]/g, ''))
  return Number.isNaN(numeric) ? 0 : numeric
}

export function formatPrice(amount) {
  return `$${amount.toLocaleString('en-US')}`
}
