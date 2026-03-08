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
  at: "🇦🇹",
  fi: "🇫🇮",
  pl: "🇵🇱",
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
  at: "Austria",
  fi: "Finland",
  pl: "Poland",
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
  at: "EUR",
  fi: "EUR",
  pl: "PLN",
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
  PLN: "zł",
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

/**
 * Format a country label with optional region info
 * @param countryCode Country code (e.g., "us", "ch")
 * @param formValues Optional form values containing region selections
 * @param inputDefs Optional input definitions to look up region labels
 * @returns Formatted label like "🇺🇸 US - California" or "🇺🇸 US"
 */
export function formatCountryLabel(
  countryCode: string,
  formValues?: Record<string, string>,
  inputDefs?: Record<string, { type: string; options?: Record<string, { label: string }> }>
): string {
  const flag = getCountryFlag(countryCode)
  const code = countryCode.toUpperCase()

  // Check for region info in multiple possible fields (state, region_level_1, etc.)
  let regionKey: string | undefined
  let regionInputKey: string | undefined

  // Priority: state > region_level_1 > region_level_2
  if (formValues?.state) {
    regionKey = formValues.state
    regionInputKey = 'state'
  } else if (formValues?.region_level_1) {
    regionKey = formValues.region_level_1
    regionInputKey = 'region_level_1'
  } else if (formValues?.region_level_2) {
    regionKey = formValues.region_level_2
    regionInputKey = 'region_level_2'
  }

  if (!regionKey || !regionInputKey) {
    return `${flag} ${code}`
  }

  // Try to get the label from input definitions, fallback to formatted key
  let regionLabel = inputDefs?.[regionInputKey]?.options?.[regionKey]?.label
    || regionKey.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  // Clean up labels like "California (CA)" to just "California"
  regionLabel = regionLabel.replace(/\s*\([^)]+\)$/, '')

  return `${flag} ${code} - ${regionLabel}`
}
