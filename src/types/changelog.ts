export interface ChangelogCountry {
  /** ISO 3166-1 alpha-2 code, e.g. "nl" */
  code: string
  /** Display name, e.g. "Netherlands" */
  name: string
}

export interface ChangelogVariant {
  /** ISO 3166-1 alpha-2 code of the country */
  country_code: string
  /** Display name of the country */
  country: string
  /** Variant label, e.g. "30% Ruling", "Beckham Law", "Non-resident (22% flat)" */
  label: string
}

export interface NewYearData {
  /** The tax year being added, e.g. 2026 */
  year: number
  /** Countries that now have data for this year */
  countries: ChangelogCountry[]
}

export interface ChangelogEntry {
  /** Semver without "v" prefix, e.g. "0.2.10" */
  version: string
  /** ISO 8601 date string, e.g. "2026-02-25" */
  date: string
  /**
   * Optional hero summary for major or landmark releases.
   * Keep to one sentence. Omit for minor releases.
   */
  highlight?: string
  /** Entirely new countries added to the calculator */
  new_countries?: ChangelogCountry[]
  /** New expat/special-regime variants added for existing countries */
  new_variants?: ChangelogVariant[]
  /**
   * New tax year data for countries that were already supported.
   * Group by year — most releases will add one year at a time.
   */
  new_year_data?: NewYearData[]
  /**
   * User-visible UI or UX improvements.
   * Write in plain English, no developer jargon, no PR numbers.
   * Example: "Side-by-side grid layout for clearer country comparisons"
   */
  improvements?: string[]
  /**
   * Fixes that affected users' numbers or experience.
   * Skip internal CI/lint/tooling fixes entirely.
   * Example: "Corrected Spain Beckham Law bracket threshold"
   */
  fixes?: string[]
}

export interface ChangelogData {
  versions: ChangelogEntry[]
}
