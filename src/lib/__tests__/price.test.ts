/* eslint-env jest */
import { describe, test, expect } from '@jest/globals';
import { parseIndianPriceToNumber, LAKH, CRORE, isPriceWithinRange } from '@/lib/price';

describe('parseIndianPriceToNumber', () => {
  test('parses crore with decimals', () => {
    expect(parseIndianPriceToNumber('2.2 Crore Onwards')).toBe(Math.round(2.2 * CRORE));
    expect(parseIndianPriceToNumber('5.83 Crore Onwards')).toBe(Math.round(5.83 * CRORE));
    expect(parseIndianPriceToNumber('6.90 Crores Onwards')).toBe(Math.round(6.90 * CRORE));
  });

  test('parses lakh variants and case-insensitivity', () => {
    expect(parseIndianPriceToNumber('75 Lakhs Onwards')).toBe(75 * LAKH);
    expect(parseIndianPriceToNumber('74 lakhs Onwards')).toBe(74 * LAKH);
    expect(parseIndianPriceToNumber('90 Lac')).toBe(90 * LAKH);
    expect(parseIndianPriceToNumber('65 L')).toBe(65 * LAKH);
  });

  test('parses crore + lakh combo', () => {
    expect(parseIndianPriceToNumber('₹4 Crore 80 Lakhs')).toBe(4 * CRORE + 80 * LAKH);
    expect(parseIndianPriceToNumber('3 crore 25 lakh')).toBe(3 * CRORE + 25 * LAKH);
  });

  test('parses compact crore/lakh spellings', () => {
    expect(parseIndianPriceToNumber('1Crore Onwards')).toBe(1 * CRORE);
    expect(parseIndianPriceToNumber('1.3 Cr')).toBe(Math.round(1.3 * CRORE));
    expect(parseIndianPriceToNumber('85 Lk')).toBe(85 * LAKH);
  });

  test('parses raw rupees numbers as fallback', () => {
    expect(parseIndianPriceToNumber('₹25,000,000')).toBe(25_000_000);
    expect(parseIndianPriceToNumber('25000000')).toBe(25_000_000);
  });

  test('returns null on invalid input', () => {
    expect(parseIndianPriceToNumber('Price on Request')).toBeNull();
    expect(parseIndianPriceToNumber('N/A')).toBeNull();
    expect(parseIndianPriceToNumber('')).toBeNull();
    expect(parseIndianPriceToNumber(null)).toBeNull();
  });
});

describe('isPriceWithinRange', () => {
  test('validates within min/max bounds', () => {
    const price = parseIndianPriceToNumber('2 Cr'); // 20,000,000
    expect(isPriceWithinRange(price, 10_000_000, 30_000_000)).toBe(true);
    expect(isPriceWithinRange(price, 20_000_001, 30_000_000)).toBe(false);
    expect(isPriceWithinRange(price, 1, 19_999_999)).toBe(false);
  });
});