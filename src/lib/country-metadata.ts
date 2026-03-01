// Country metadata including flags, names, and currencies
// Single source of truth for all country-related data

/**
 * Country flag emojis using Unicode
 */
export const COUNTRY_FLAGS: Record<string, string> = {
  nl: "🇳🇱",
  de: "🇩🇪",
  ch: "🇨🇭",
  us: "🇺🇸",
  gb: "🇬🇧",
  gr: "🇬🇷",
  uk: "🇬🇧",
  fr: "🇫🇷",
  it: "🇮🇹",
  es: "🇪🇸",
  pt: "🇵🇹",
  ie: "🇮🇪",
  sg: "🇸🇬",
  ae: "🇦🇪",
  au: "🇦🇺",
  bg: "🇧🇬",
  ca: "🇨🇦",
  hk: "🇭🇰",
  jp: "🇯🇵",
  dk: "🇩🇰",
  kr: "🇰🇷",
  no: "🇳🇴",
  nz: "🇳🇿",
  se: "🇸🇪",
  mx: "🇲🇽",
}

/**
 * Country display names (localized English)
 */
export const COUNTRY_NAMES: Record<string, string> = {
  nl: "Netherlands",
  de: "Germany",
  ch: "Switzerland",
  us: "United States",
  gb: "United Kingdom",
  gr: "Greece",
  uk: "United Kingdom",
  fr: "France",
  it: "Italy",
  es: "Spain",
  pt: "Portugal",
  ie: "Ireland",
  sg: "Singapore",
  ae: "United Arab Emirates",
  au: "Australia",
  bg: "Bulgaria",
  ca: "Canada",
  hk: "Hong Kong",
  jp: "Japan",
  dk: "Denmark",
  kr: "South Korea",
  no: "Norway",
  nz: "New Zealand",
  se: "Sweden",
  mx: "Mexico",
}

/**
 * Currency codes by country (ISO 4217)
 */
export const CURRENCY_BY_COUNTRY: Record<string, string> = {
  nl: "EUR",
  de: "EUR",
  fr: "EUR",
  it: "EUR",
  es: "EUR",
  pt: "EUR",
  ie: "EUR",
  ch: "CHF",
  us: "USD",
  gb: "GBP",
  gr: "EUR",
  uk: "GBP",
  sg: "SGD",
  ae: "AED",
  au: "AUD",
  bg: "BGN",
  ca: "CAD",
  hk: "HKD",
  jp: "JPY",
  dk: "DKK",
  kr: "KRW",
  no: "NOK",
  nz: "NZD",
  se: "SEK",
  mx: "MXN",
}

/**
 * Currency symbols for display
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  CHF: "CHF",
  CAD: "C$",
  AUD: "A$",
  SGD: "S$",
  HKD: "HK$",
  AED: "AED",
  JPY: "¥",
  BGN: "BGN",
  DKK: "kr",
  KRW: "₩",
  NOK: "kr",
  NZD: "NZ$",
  SEK: "kr",
  MXN: "MX$",
}

/**
 * Get flag emoji for a country code
 */
export function getCountryFlag(countryCode: string): string {
  return COUNTRY_FLAGS[countryCode.toLowerCase()] || "🏳️"
}

/**
 * Get display name for a country code
 */
export function getCountryName(code: string): string {
  return COUNTRY_NAMES[code.toLowerCase()] || code.toUpperCase()
}

/**
 * Get currency symbol for a currency code
 */
export function getCurrencySymbol(code: string): string {
  return CURRENCY_SYMBOLS[code.toUpperCase()] || code
}

/**
 * Extended country metadata
 */
export interface CountryMetadata {
  code: string
  name: string
  flag: string
  currency: string
}

/**
 * Get complete metadata for a country
 */
export function getCountryMetadata(countryCode: string): CountryMetadata | null {
  const code = countryCode.toLowerCase()
  const flag = getCountryFlag(code)

  return {
    code,
    name: getCountryName(code),
    flag,
    currency: CURRENCY_BY_COUNTRY[code] || "EUR",
  }
}
