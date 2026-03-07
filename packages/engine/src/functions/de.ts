import type { CalculationContext } from '../../../schema/src/config-types'

/**
 * German Ehegattensplitting (income splitting)
 * Used for married couples filing jointly (§32a EStG)
 *
 * Splits taxable income by the splitting factor, computes tax on the portion,
 * then multiplies back — effectively averaging the marginal rate across the couple.
 */
export function incomeSplittingTax(
  inputs: Record<string, number>,
  context: CalculationContext
): number {
  const { taxable_income, splitting_factor } = inputs as any

  const taxYear = context.config?.meta?.year || 2024

  const computeTax =
    taxYear === 2026
      ? computeGermanTax2026
      : taxYear === 2025
        ? computeGermanTax2025
        : computeGermanTax2024

  if (!splitting_factor || splitting_factor === 1) {
    return computeTax(taxable_income)
  }

  const splitIncome = taxable_income / splitting_factor
  return computeTax(splitIncome) * splitting_factor
}

/**
 * German income tax formula for 2026 (§32a EStG)
 * Source: https://www.finanz-tools.de/einkommensteuer/berechnung-formeln/2026
 *
 * Changes from 2025: basic allowance €12,348, zone boundaries 17,799 / 69,878
 */
function computeGermanTax2026(taxableIncome: number): number {
  const x = Math.floor(taxableIncome)

  if (x <= 12348) return 0

  if (x <= 17799) {
    const y = (x - 12348) / 10000
    return Math.floor((914.51 * y + 1400) * y)
  }

  if (x <= 69878) {
    const z = (x - 17799) / 10000
    return Math.floor((173.20 * z + 2397) * z + 1034)
  }

  if (x <= 277825) {
    return Math.floor(0.42 * x - 11136)
  }

  return Math.floor(0.45 * x - 19471)
}

/**
 * German income tax formula for 2025 (§32a EStG)
 * Source: https://www.gesetze-im-internet.de/estg/__32a.html
 *         https://lsth.bundesfinanzministerium.de/lsth/2025/A-Einkommensteuergesetz/IV-Tarif-31-34b/Paragraf-32a/inhalt.html
 *
 * Changes from 2024: basic allowance €12,096, zone boundaries 17,443 / 68,480
 */
function computeGermanTax2025(taxableIncome: number): number {
  const x = Math.floor(taxableIncome)

  if (x <= 12096) return 0

  if (x <= 17443) {
    const y = (x - 12096) / 10000
    return Math.floor((932.30 * y + 1400) * y)
  }

  // Zone 3: (176.64 · z + 2,397) · z + 1,015.13  where z = (zvE - 17,443) / 10,000
  if (x <= 68480) {
    const z = (x - 17443) / 10000
    return Math.floor((176.64 * z + 2397) * z + 1015.13)
  }

  if (x <= 277825) {
    return Math.floor(0.42 * x - 10911.92)
  }

  return Math.floor(0.45 * x - 19246.67)
}

/**
 * German income tax formula for 2024 (§32a EStG)
 * Source: https://www.finanz-tools.de/einkommensteuer/berechnung-formeln/2024
 *
 * Basic allowance retroactively raised to €11,784 for 2024
 */
function computeGermanTax2024(taxableIncome: number): number {
  const x = Math.floor(taxableIncome)

  if (x <= 11784) return 0

  if (x <= 17005) {
    const y = (x - 11784) / 10000
    return Math.floor((954.80 * y + 1400) * y)
  }

  if (x <= 66760) {
    const z = (x - 17005) / 10000
    return Math.floor((181.19 * z + 2397) * z + 991.21)
  }

  if (x <= 277825) {
    return Math.floor(0.42 * x - 10636.31)
  }

  return Math.floor(0.45 * x - 18971.06)
}
