// Catches common typos of well-known email providers (e.g. "gail.com" for
// "gmail.com") so we can gently suggest a fix. This is intentionally simple
// front-end string matching — not a real mailbox/deliverability check, which
// would need a backend or third-party service.

const COMMON_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'live.com',
  'aol.com',
]

function levenshteinDistance(a, b) {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => {
    const row = new Array(b.length + 1).fill(0)
    row[0] = i
    return row
  })
  for (let j = 0; j <= b.length; j += 1) rows[0][j] = j

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1, // deletion
        rows[i][j - 1] + 1, // insertion
        rows[i - 1][j - 1] + cost, // substitution
      )
    }
  }

  return rows[a.length][b.length]
}

// Returns a corrected email string if the domain looks like a near-miss of
// a common provider, otherwise null.
export function suggestEmailCorrection(email) {
  const trimmed = email.trim().toLowerCase()
  const atIndex = trimmed.lastIndexOf('@')
  if (atIndex === -1 || atIndex === trimmed.length - 1) return null

  const local = trimmed.slice(0, atIndex)
  const domain = trimmed.slice(atIndex + 1)
  if (!domain.includes('.')) return null

  let closestDomain = null
  let closestDistance = Infinity

  COMMON_DOMAINS.forEach((candidate) => {
    if (candidate === domain) return
    const distance = levenshteinDistance(domain, candidate)
    if (distance < closestDistance) {
      closestDistance = distance
      closestDomain = candidate
    }
  })

  // A distance of 1–2 covers a missing/extra/swapped letter (gail -> gmail,
  // gmial -> gmail) without flagging genuinely different domains.
  if (closestDomain && closestDistance >= 1 && closestDistance <= 2) {
    return `${local}@${closestDomain}`
  }

  return null
}
