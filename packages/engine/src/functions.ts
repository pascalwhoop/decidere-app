import type { CalculationContext, BracketEntry } from '../../schema/src/config-types'

/**
 * Built-in functions for complex tax calculations that can't be expressed in pure YAML
 */

export function resolveFunctions(): Map<string, Function> {
  const functions = new Map<string, Function>()

  functions.set('income_splitting_tax', incomeSplittingTax)
  functions.set('family_quotient_tax', familyQuotientTax)
  functions.set('alternative_minimum_tax', alternativeMinimumTax)
  functions.set('swiss_federal_tax', swissFederalTax)
  functions.set('austria_full_year_tax', austriaFullYearTax)

  return functions
}

/**
 * German Ehegattensplitting (income splitting)
 * Used for married couples filing jointly
 *
 * Splits taxable income in half, computes tax, then doubles the result
 */
function incomeSplittingTax(
  inputs: Record<string, number>,
  context: CalculationContext
): number {
  const { taxable_income, splitting_factor } = inputs as any

  // Detect tax year from config metadata
  const taxYear = context.config?.meta?.year || 2024

  // Select appropriate tax function based on year
  const computeTax =
    taxYear === 2026
      ? computeGermanTax2026
      : taxYear === 2025
        ? computeGermanTax2025
        : computeGermanTax2024

  if (!splitting_factor || splitting_factor === 1) {
    // No splitting - compute normally
    return computeTax(taxable_income)
  }

  // Split taxable income
  const splitIncome = taxable_income / splitting_factor

  // Compute tax on split income
  const splitTax = computeTax(splitIncome)

  // Multiply result by splitting factor
  return splitTax * splitting_factor
}

/**
 * French Quotient Familial (family quotient)
 * Divides income by family units, computes tax, multiplies back
 *
 * Note: brackets parameter must be specified in config but is read from context.parameters
 * This is because the evaluator can only pass numbers, not arrays
 */
function familyQuotientTax(
  inputs: Record<string, any>,
  context: CalculationContext
): number {
  const { gross, family_units, brackets: bracketsRef } = inputs

  if (typeof gross !== 'number' || isNaN(gross)) {
    throw new Error(`Invalid gross income: ${gross} (type: ${typeof gross})`)
  }

  if (typeof family_units !== 'number' || isNaN(family_units)) {
    throw new Error(`Invalid family_units: ${family_units} (type: ${typeof family_units})`)
  }

  if (!bracketsRef) {
    throw new Error(`familyQuotientTax requires a brackets input reference`)
  }

  const brackets = getBrackets(bracketsRef, context)

  if (!Array.isArray(brackets) || brackets.length === 0) {
    throw new Error(`brackets not found in parameters or is empty`)
  }

  if (!family_units || family_units === 1) {
    return computeProgressiveBracketTax(gross, brackets)
  }

  const quotient = gross / family_units
  const quotientTax = computeProgressiveBracketTax(quotient, brackets)

  return quotientTax * family_units
}

/**
 * US Alternative Minimum Tax
 * Computes both regular tax and AMT, returns the maximum
 */
function alternativeMinimumTax(
  inputs: Record<string, number>,
  context: CalculationContext
): number {
  const {
    gross,
    regular_brackets: regularRef,
    amt_brackets: amtRef,
    amt_exemption,
  } = inputs as any

  // Compute regular tax
  const regularTax = computeBracketTax(gross, getBrackets(regularRef, context))

  // Compute AMT
  const amtBase = Math.max(0, gross - (amt_exemption || 0))
  const amt = computeBracketTax(amtBase, getBrackets(amtRef, context))

  // Return the higher of the two
  return Math.max(regularTax, amt)
}

/**
 * Swiss Federal Tax
 * Uses different rate schedules for single vs married
 */
function swissFederalTax(
  inputs: Record<string, number>,
  context: CalculationContext
): number {
  const { gross, filing_status, single_brackets: singleRef, married_brackets: marriedRef } =
    inputs as any

  const bracketsRef = filing_status === 'married' ? marriedRef : singleRef

  return computeBracketTax(gross, getBrackets(bracketsRef, context))
}

// Helper functions

function getBrackets(
  bracketsRef: any,
  context: CalculationContext
): BracketEntry[] {
  if (Array.isArray(bracketsRef)) {
    return bracketsRef as BracketEntry[]
  }

  if (typeof bracketsRef === 'string') {
    const ref = bracketsRef.startsWith('$') ? bracketsRef.slice(1) : bracketsRef
    const brackets = context.parameters[ref]

    if (!Array.isArray(brackets)) {
      throw new Error(`Brackets not found: ${ref}`)
    }

    return brackets as BracketEntry[]
  }

  throw new Error(`Invalid brackets reference: ${JSON.stringify(bracketsRef)}`)
}

function computeBracketTax(income: number, brackets: BracketEntry[]): number {
  return computeProgressiveBracketTax(income, brackets)
}

/**
 * Standard progressive bracket tax calculation
 * Used by French quotient familial and other systems
 */
function computeProgressiveBracketTax(income: number, brackets: BracketEntry[]): number {
  if (income <= 0) return 0

  let tax = 0
  let previousThreshold = 0

  for (const bracket of brackets) {
    if (income <= bracket.threshold) {
      // Income is in this bracket
      if (bracket.rate > 0) {
        tax += (income - previousThreshold) * bracket.rate
      }
      break
    } else {
      // Income exceeds this bracket, tax the full bracket
      if (bracket.rate > 0 && bracket.threshold > previousThreshold) {
        tax += (bracket.threshold - previousThreshold) * bracket.rate
      }
      previousThreshold = bracket.threshold
    }
  }

  // If income exceeds all brackets, apply the last bracket's rate to remaining income
  const lastBracket = brackets[brackets.length - 1]
  if (income > lastBracket.threshold) {
    tax += (income - lastBracket.threshold) * lastBracket.rate
  }

  return Math.round(tax)
}

/**
 * German tax formula for 2026
 * Based on official BMF formula (§32a EStG) with continuous progression zones
 * Source: https://www.finanz-tools.de/einkommensteuer/berechnung-formeln/2026
 *
 * Key changes from 2025:
 * - Basic allowance raised to €12,348 (from €12,096)
 * - Zone thresholds adjusted: €17,799 (zone 2 end), €69,878 (zone 3 end)
 * - Solidarity surcharge exemption threshold increased to €20,350 (single)
 */
function computeGermanTax2026(taxableIncome: number): number {
  const x = Math.floor(taxableIncome)

  // Zone 1: Below basic allowance (€12,348)
  if (x <= 12348) {
    return 0
  }

  // Zone 2: Linear progression (€12,349 - €17,799)
  // Formula: E = (914.51 · y + 1,400) · y where y = (income - 12,348) / 10,000
  if (x <= 17799) {
    const y = (x - 12348) / 10000
    return Math.floor((914.51 * y + 1400) * y)
  }

  // Zone 3: Linear progression (€17,800 - €69,878)
  // Formula: E = (173.20 · z + 2,397) · z + 1,034 where z = (income - 17,799) / 10,000
  if (x <= 69878) {
    const z = (x - 17799) / 10000
    return Math.floor((173.20 * z + 2397) * z + 1034)
  }

  // Zone 4: Linear rate 42% (€69,879 - €277,825)
  if (x <= 277825) {
    return Math.floor(0.42 * x - 11136)
  }

  // Zone 5: Linear rate 45% (≥ €277,826)
  return Math.floor(0.45 * x - 19471)
}

/**
 * German tax formula for 2024
 * Based on official BMF formula (§32a EStG) with continuous progression zones
 * Source: https://www.finanz-tools.de/einkommensteuer/berechnung-formeln/2024
 *
 * The basic allowance was retroactively raised to €11,784 for 2024
 */
function computeGermanTax2024(taxableIncome: number): number {
  const x = Math.floor(taxableIncome)

  // Zone 1: Below basic allowance (€11,784 - retroactively raised)
  if (x <= 11784) {
    return 0
  }

  // Zone 2: Linear progression (€11,785 - €17,005)
  if (x <= 17005) {
    const y = (x - 11784) / 10000
    return Math.floor((954.80 * y + 1400) * y)
  }

  // Zone 3: Linear progression (€17,006 - €66,760)
  if (x <= 66760) {
    const z = (x - 17005) / 10000
    return Math.floor((181.19 * z + 2397) * z + 991.21)
  }

  // Zone 4: Linear rate 42% (€66,761 - €277,825)
  if (x <= 277825) {
    return Math.floor(0.42 * x - 10636.31)
  }

  // Zone 5: Linear rate 45% (≥ €277,826)
  return Math.floor(0.45 * x - 18971.06)
}

/**
 * German tax formula for 2025
 * Based on official BMF formula (§32a EStG) with continuous progression zones
 * Source: https://taxrep.us/tax_guide/german-income-tax-guide/german-income-tax-rates-brackets/
 *
 * Key changes from 2024:
 * - Basic allowance raised to €12,096
 * - Zone thresholds adjusted: €17,443 (zone 2), €68,480 (zone 3)
 * - Solidarity surcharge exemption threshold increased to €19,950 (single)
 */
function computeGermanTax2025(taxableIncome: number): number {
  const x = Math.floor(taxableIncome)

  // Zone 1: Below basic allowance (€12,096)
  if (x <= 12096) {
    return 0
  }

  // Zone 2: Linear progression (€12,097 - €17,443)
  // Formula: E = (932.30 · y + 1,400) · y where y = (income - 12,096) / 10,000
  if (x <= 17443) {
    const y = (x - 12096) / 10000
    return Math.floor((932.30 * y + 1400) * y)
  }

  // Zone 3: Linear progression (€17,444 - €68,480)
  // Formula: E = (177.23 · z + 2,397) · z + 1,025.84 where z = (income - 17,443) / 10,000
  if (x <= 68480) {
    const z = (x - 17443) / 10000
    return Math.floor((177.23 * z + 2397) * z + 1025.84)
  }

  // Zone 4: Linear rate 42% (€68,481 - €277,825)
  if (x <= 277825) {
    return Math.floor(0.42 * x - 10911.92)
  }

  // Zone 5: Linear rate 45% (≥ €277,826)
  return Math.floor(0.45 * x - 19246.67)
}

/**
 * Austria Full-Year Tax Calculation (14-salary system)
 *
 * Austria pays employees 14 times per year (regular monthly x 12 + holiday bonus + Christmas bonus).
 * The 13th and 14th month payments ("Sonderzahlungen") receive preferential tax treatment:
 * - Social security at reduced rates (17.07% employee vs 18.07% regular)
 * - First EUR 620 tax-free, then 6% flat rate up to EUR 25,000
 * - Higher graduated rates above EUR 25,000
 *
 * This function computes the complete annual tax burden including both
 * regular monthly tax (progressive brackets) and special payment tax (flat 6%).
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
 * The function stores intermediate values in context.nodes for breakdown.
 *
 * Source: Austrian Income Tax Act (EStG) 2026, PwC Austria tax summaries
 */
function austriaFullYearTax(
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

  // Optional: taxable_fraction for Zuzugsfreibetrag (default 1.0 = fully taxable)
  const taxableFraction = inputs.taxable_fraction ?? 1.0

  // Split annual gross into regular (12 months) and special payments (2 months)
  const monthlyGross = gross_annual / 14
  const regularAnnual = monthlyGross * 12  // 12 regular monthly payments
  const specialAnnual = monthlyGross * 2   // 13th + 14th month

  // === Determine effective unemployment insurance rate (tiered reduction for low earners) ===
  // Source: BDO Austria, ASVG 2026
  // - Up to EUR 2,225/month: 0% (full reduction of 2.95%)
  // - EUR 2,225.01 to EUR 2,427: 1% (reduction of 1.95%)
  // - EUR 2,427.01 to EUR 2,630: 2% (reduction of 0.95%)
  // - Above EUR 2,630: 2.95% (full rate)
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

  // === Social Security on Regular Payments ===
  // Total rate = base rate (pension + health + AK + WF) + effective unemployment rate
  const svRegularRate = sv_base_rate + effectiveAlvRate
  const svBaseMonthly = Math.min(monthlyGross, sv_cap_monthly)
  const svRegularAnnual = svBaseMonthly * svRegularRate * 12

  // === Social Security on Special Payments ===
  // Special payments use a reduced base rate + effective unemployment rate
  const svSpecialRate = sv_base_rate_special + effectiveAlvRate
  const svSpecialBase = Math.min(specialAnnual, sv_cap_special_annual)
  const svSpecialAnnual = svSpecialBase * svSpecialRate

  // Total social security
  const totalSV = svRegularAnnual + svSpecialAnnual

  // Store SV breakdown in context for output
  context.nodes['sv_regular'] = Math.round(svRegularAnnual * 100) / 100
  context.nodes['sv_special'] = Math.round(svSpecialAnnual * 100) / 100
  context.nodes['total_social_security'] = Math.round(totalSV * 100) / 100

  // === Income Tax on Regular Payments (progressive brackets) ===
  // Taxable income = regular gross - SV on regular - Werbungskostenpauschale
  // For Zuzugsfreibetrag: taxable_fraction reduces the gross before SV deduction
  const taxableRegularGross = regularAnnual * taxableFraction
  const taxableRegular = Math.max(0, taxableRegularGross - svRegularAnnual - werbungskosten)

  // Compute progressive tax on regular income using 2026 brackets
  const regularTaxGross = computeAustrianProgressiveTax2026(taxableRegular)

  // Apply Verkehrsabsetzbetrag (transport credit) - directly reduces tax
  const regularTax = Math.max(0, regularTaxGross - transport_credit)

  // Store for breakdown
  context.nodes['regular_income_tax'] = Math.round(regularTax * 100) / 100

  // === Income Tax on Special Payments (Sonderzahlungen) ===
  // Special payments: first EUR 620 tax-free, then 6% flat rate
  // SV on special payments is deducted first
  // For Zuzugsfreibetrag: taxable_fraction reduces the special payment gross
  const specialTaxableGross = specialAnnual * taxableFraction
  const specialAfterSV = specialTaxableGross - svSpecialAnnual
  const specialTaxBase = Math.max(0, specialAfterSV - 620)

  // Standard rate: 6% for amounts up to EUR 25,000
  // Higher rates for amounts above EUR 25,000 (rare for most employees)
  let specialTax = 0
  if (specialTaxBase > 0) {
    if (specialTaxBase <= 25000) {
      specialTax = specialTaxBase * 0.06
    } else if (specialTaxBase <= 50000) {
      specialTax = 25000 * 0.06 + (specialTaxBase - 25000) * 0.27
    } else if (specialTaxBase <= 83333) {
      specialTax = 25000 * 0.06 + 25000 * 0.27 + (specialTaxBase - 50000) * 0.3575
    } else {
      // Above EUR 83,333: excess added to regular income (taxed at marginal rate)
      // For simplification, we apply 50% to the excess
      specialTax =
        25000 * 0.06 +
        25000 * 0.27 +
        33333 * 0.3575 +
        (specialTaxBase - 83333) * 0.50
    }
  }

  // Store for breakdown
  context.nodes['special_payment_tax'] = Math.round(specialTax * 100) / 100

  // Total income tax (regular + special payments)
  const totalIncomeTax = regularTax + specialTax
  context.nodes['total_income_tax'] = Math.round(totalIncomeTax * 100) / 100

  // Store the tax-free allowance for Zuzugsfreibetrag variant display
  if (taxableFraction < 1.0) {
    const taxFreeAllowance = gross_annual * (1 - taxableFraction)
    context.nodes['zuzugsfreibetrag_allowance'] = Math.round(taxFreeAllowance * 100) / 100
  }

  // Return total income tax (SV is handled separately in the YAML config for breakdown)
  return Math.round(totalIncomeTax * 100) / 100
}

/**
 * Austrian progressive income tax calculation for 2026
 * Based on official brackets from EStG 2026 (inflation-adjusted by 1.73%)
 *
 * Brackets:
 *   0 - 13,539: 0%
 *   13,539 - 21,992: 20%
 *   21,992 - 36,458: 30%
 *   36,458 - 70,365: 40%
 *   70,365 - 104,859: 48%
 *   104,859 - 1,000,000: 50%
 *   Above 1,000,000: 55%
 *
 * Source: https://www.usp.gv.at/en/themen/steuern-finanzen/einkommensteuer-ueberblick/weitere-informationen-est/tarifstufen.html
 */
function computeAustrianProgressiveTax2026(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0

  const x = Math.floor(taxableIncome)

  if (x <= 13539) return 0

  let tax = 0

  // Bracket 1: 0 - 13,539 @ 0%
  // No tax

  // Bracket 2: 13,539 - 21,992 @ 20%
  if (x <= 21992) {
    tax = (x - 13539) * 0.20
    return Math.round(tax * 100) / 100
  }
  tax += (21992 - 13539) * 0.20  // = 1,690.60

  // Bracket 3: 21,992 - 36,458 @ 30%
  if (x <= 36458) {
    tax += (x - 21992) * 0.30
    return Math.round(tax * 100) / 100
  }
  tax += (36458 - 21992) * 0.30  // = 4,339.80

  // Bracket 4: 36,458 - 70,365 @ 40%
  if (x <= 70365) {
    tax += (x - 36458) * 0.40
    return Math.round(tax * 100) / 100
  }
  tax += (70365 - 36458) * 0.40  // = 13,562.80

  // Bracket 5: 70,365 - 104,859 @ 48%
  if (x <= 104859) {
    tax += (x - 70365) * 0.48
    return Math.round(tax * 100) / 100
  }
  tax += (104859 - 70365) * 0.48  // = 16,557.12

  // Bracket 6: 104,859 - 1,000,000 @ 50%
  if (x <= 1000000) {
    tax += (x - 104859) * 0.50
    return Math.round(tax * 100) / 100
  }
  tax += (1000000 - 104859) * 0.50  // = 447,570.50

  // Bracket 7: Above 1,000,000 @ 55% (extended until 2029)
  tax += (x - 1000000) * 0.55

  return Math.round(tax * 100) / 100
}
