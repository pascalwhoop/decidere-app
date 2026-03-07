import type { CalculationContext } from '../../../schema/src/config-types'

/**
 * Austria Full-Year Tax Calculation (14-salary system)
 *
 * Austria pays employees 14 times per year (regular monthly × 12 + holiday bonus + Christmas bonus).
 * The 13th and 14th month payments ("Sonderzahlungen") receive preferential tax treatment:
 * - Social security at reduced rates (17.07% employee vs 18.07% regular)
 * - First EUR 620 tax-free, then 6% flat rate up to EUR 25,000
 * - Higher graduated rates above EUR 25,000
 *
 * Inputs:
 *   gross_annual: Total annual compensation (14 months)
 *   sv_base_rate: Employee SV rate excluding unemployment (pension + health + AK + WF)
 *   sv_base_rate_special: Employee SV rate for special payments excluding unemployment
 *   unemployment_rate: Full unemployment insurance rate (2.95%)
 *   sv_cap_monthly: Monthly SV cap (EUR 6,930 for 2026)
 *   sv_cap_special_annual: Annual SV cap for special payments (EUR 13,860 for 2026)
 *   transport_credit: Verkehrsabsetzbetrag (EUR 496 for 2026)
 *   werbungskosten: Standard business expense deduction (EUR 132 for 2026)
 *   alv_tier1_limit: Unemployment insurance tier 1 upper limit (EUR 2,225 for 2026)
 *   alv_tier2_limit: Unemployment insurance tier 2 upper limit (EUR 2,427 for 2026)
 *   alv_tier3_limit: Unemployment insurance tier 3 upper limit (EUR 2,630 for 2026)
 *
 * Returns: Total annual income tax.
 * Source: Austrian Income Tax Act (EStG) 2026, PwC Austria tax summaries
 */
export function austriaFullYearTax(
  inputs: Record<string, any>,
  context: CalculationContext
): number {
  const {
    gross_annual,
    sv_base_rate,
    sv_base_rate_special,
    unemployment_rate,
    sv_cap_monthly,
    sv_cap_special_annual,
    transport_credit,
    werbungskosten,
    alv_tier1_limit,
    alv_tier2_limit,
    alv_tier3_limit,
  } = inputs

  const taxableFraction = inputs.taxable_fraction ?? 1.0

  const monthlyGross = gross_annual / 14
  const regularAnnual = monthlyGross * 12
  const specialAnnual = monthlyGross * 2

  // Tiered unemployment insurance reduction for low earners (ASVG 2026)
  let effectiveAlvRate: number
  if (monthlyGross <= alv_tier1_limit) {
    effectiveAlvRate = 0
  } else if (monthlyGross <= alv_tier2_limit) {
    effectiveAlvRate = 0.01
  } else if (monthlyGross <= alv_tier3_limit) {
    effectiveAlvRate = 0.02
  } else {
    effectiveAlvRate = unemployment_rate
  }

  // Social security on regular payments
  const svRegularRate = sv_base_rate + effectiveAlvRate
  const svBaseMonthly = Math.min(monthlyGross, sv_cap_monthly)
  const svRegularAnnual = svBaseMonthly * svRegularRate * 12

  // Social security on special payments (reduced rate)
  const svSpecialRate = sv_base_rate_special + effectiveAlvRate
  const svSpecialBase = Math.min(specialAnnual, sv_cap_special_annual)
  const svSpecialAnnual = svSpecialBase * svSpecialRate

  const totalSV = svRegularAnnual + svSpecialAnnual

  context.nodes['sv_regular'] = Math.round(svRegularAnnual * 100) / 100
  context.nodes['sv_special'] = Math.round(svSpecialAnnual * 100) / 100
  context.nodes['total_social_security'] = Math.round(totalSV * 100) / 100

  // Progressive income tax on regular payments
  const taxableRegularGross = regularAnnual * taxableFraction
  const taxableRegular = Math.max(0, taxableRegularGross - svRegularAnnual - werbungskosten)
  const regularTaxGross = computeAustrianProgressiveTax2026(taxableRegular)
  const regularTax = Math.max(0, regularTaxGross - transport_credit)

  context.nodes['regular_income_tax'] = Math.round(regularTax * 100) / 100

  // Flat-rate tax on special payments (Sonderzahlungen)
  const specialTaxableGross = specialAnnual * taxableFraction
  const specialAfterSV = specialTaxableGross - svSpecialAnnual
  const specialTaxBase = Math.max(0, specialAfterSV - 620)

  let specialTax = 0
  if (specialTaxBase > 0) {
    if (specialTaxBase <= 25000) {
      specialTax = specialTaxBase * 0.06
    } else if (specialTaxBase <= 50000) {
      specialTax = 25000 * 0.06 + (specialTaxBase - 25000) * 0.27
    } else if (specialTaxBase <= 83333) {
      specialTax = 25000 * 0.06 + 25000 * 0.27 + (specialTaxBase - 50000) * 0.3575
    } else {
      specialTax =
        25000 * 0.06 +
        25000 * 0.27 +
        33333 * 0.3575 +
        (specialTaxBase - 83333) * 0.50
    }
  }

  context.nodes['special_payment_tax'] = Math.round(specialTax * 100) / 100

  const totalIncomeTax = regularTax + specialTax
  context.nodes['total_income_tax'] = Math.round(totalIncomeTax * 100) / 100

  if (taxableFraction < 1.0) {
    const taxFreeAllowance = gross_annual * (1 - taxableFraction)
    context.nodes['zuzugsfreibetrag_allowance'] = Math.round(taxFreeAllowance * 100) / 100
  }

  return Math.round(totalIncomeTax * 100) / 100
}

/**
 * Austrian progressive income tax for 2026 (EStG, inflation-adjusted by 1.73%)
 * Source: https://www.usp.gv.at/en/themen/steuern-finanzen/einkommensteuer-ueberblick/weitere-informationen-est/tarifstufen.html
 *
 * Brackets: 0% to €13,539 | 20% to €21,992 | 30% to €36,458 |
 *           40% to €70,365 | 48% to €104,859 | 50% to €1,000,000 | 55% above
 */
function computeAustrianProgressiveTax2026(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0

  const x = Math.floor(taxableIncome)

  if (x <= 13539) return 0

  let tax = 0

  if (x <= 21992) return Math.round((x - 13539) * 0.20 * 100) / 100
  tax += (21992 - 13539) * 0.20

  if (x <= 36458) return Math.round((tax + (x - 21992) * 0.30) * 100) / 100
  tax += (36458 - 21992) * 0.30

  if (x <= 70365) return Math.round((tax + (x - 36458) * 0.40) * 100) / 100
  tax += (70365 - 36458) * 0.40

  if (x <= 104859) return Math.round((tax + (x - 70365) * 0.48) * 100) / 100
  tax += (104859 - 70365) * 0.48

  if (x <= 1000000) return Math.round((tax + (x - 104859) * 0.50) * 100) / 100
  tax += (1000000 - 104859) * 0.50

  return Math.round((tax + (x - 1000000) * 0.55) * 100) / 100
}
