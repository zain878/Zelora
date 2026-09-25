// A neutral, on-brand placeholder shown if a product image fails to load
// (e.g. a typo'd local file path once real photos are added). Keeps a
// broken photo from ever showing the browser's default broken-image icon.
export const FALLBACK_PRODUCT_IMAGE =
  'https://placehold.co/700x900/e7ddca/262220?text=Zelor%C3%A0'

export function handleImageError(event) {
  event.currentTarget.onerror = null
  event.currentTarget.src = FALLBACK_PRODUCT_IMAGE
}
