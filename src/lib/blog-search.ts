export function normalizeBlogSearchQuery(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) {
    return ''
  }

  const lower = trimmed.toLowerCase()

  const corrections: Record<string, string> = {
    commerical: 'commercial',
    commericcal: 'commercial',
    commericial: 'commercial',
    commertial: 'commercial',
    commmercial: 'commercial',
  }

  if (corrections[lower]) {
    return corrections[lower]
  }

  if (lower.includes('commer') || lower.includes('comercial')) {
    return 'commercial'
  }

  return trimmed
}

