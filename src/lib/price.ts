/**
 * Utility helpers for parsing and normalizing Indian price text values.
 * Converts strings like "2.2 Crore Onwards", "75 Lakhs", "₹4 Crore 80 Lakhs"
 * into numeric rupees for reliable server-side filtering.
 */

/** Constant multipliers in rupees */
export const LAKH = 100_000; // 1 Lakh
export const CRORE = 10_000_000; // 1 Crore

/**
 * Normalize common Indian price units and remove decorations.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[,]/g, '')
    .replace(/₹/g, '')
    .replace(/rs\.?\s*/g, '')
    .replace(/onwards|starting|starts\s*at|from|approx\.?/g, '')
    .replace(/crores?/g, 'crore')
    .replace(/lacs?|lakhs?/g, 'lakh')
    .replace(/\bcr\.?\b/g, 'crore')
    .replace(/\blk\.?\b/g, 'lakh')
    .replace(/\bl\b/g, 'lakh')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse a price string containing both crore and lakh parts, e.g. "4 crore 80 lakh".
 */
function parseCroreLakhCombo(s: string): number | null {
  const combo = s.match(/(\d+(?:\.\d+)?)\s*crore(?:\s+(\d+(?:\.\d+)?)\s*lakh)?/);
  if (!combo) return null;
  const crore = parseFloat(combo[1]);
  const lakh = combo[2] ? parseFloat(combo[2]) : 0;
  if (isNaN(crore) || isNaN(lakh)) return null;
  return Math.round(crore * CRORE + lakh * LAKH);
}

/**
 * Parse a price string containing only lakh part.
 */
function parseOnlyLakh(s: string): number | null {
  const m = s.match(/(\d+(?:\.\d+)?)\s*lakh\b/);
  if (!m) return null;
  const lakh = parseFloat(m[1]);
  if (isNaN(lakh)) return null;
  return Math.round(lakh * LAKH);
}

/**
 * Parse a price string containing only crore part.
 */
function parseOnlyCrore(s: string): number | null {
  const m = s.match(/(\d+(?:\.\d+)?)\s*crore\b/);
  if (!m) return null;
  const crore = parseFloat(m[1]);
  if (isNaN(crore)) return null;
  return Math.round(crore * CRORE);
}

/**
 * Parse raw numbers in rupees (fallback), e.g. "25000000".
 */
function parseRawRupees(s: string): number | null {
  const n = parseFloat(s);
  if (isNaN(n)) return null;
  return Math.round(n);
}

/**
 * Parse Indian price text to a numeric rupee value.
 * Returns null when parsing fails or input is not meaningful.
 */
export function parseIndianPriceToNumber(input?: string | null): number | null {
  if (!input) return null;
  const s = normalize(input);
  if (!s) return null;

  // Try combo first (crore + lakh)
  const combo = parseCroreLakhCombo(s);
  if (combo !== null) return combo;

  // Then only crore or only lakh
  const crore = parseOnlyCrore(s);
  if (crore !== null) return crore;

  const lakh = parseOnlyLakh(s);
  if (lakh !== null) return lakh;

  // Finally raw numeric rupees
  const raw = parseRawRupees(s);
  if (raw !== null) return raw;

  return null;
}

/**
 * Check if a parsed price falls within the given numeric range.
 */
export function isPriceWithinRange(parsedPrice: number | null, min?: number | null, max?: number | null): boolean {
  if (parsedPrice === null) return false;
  if (typeof min === 'number' && !isNaN(min) && parsedPrice < min) return false;
  if (typeof max === 'number' && !isNaN(max) && parsedPrice > max) return false;
  return true;
}