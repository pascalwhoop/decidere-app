import type { CalculationContext } from '../../../schema/src/config-types'
import { getBrackets, computeProgressiveBracketTax } from './shared'

/**
 * French Quotient Familial (family quotient)
 * Divides income by family units, computes tax, multiplies back.
 *
 * Note: brackets are read from context.parameters (passed as a $reference string)
 * because the evaluator can only pass scalar numbers, not arrays.
 */
export function familyQuotientTax(
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
  return computeProgressiveBracketTax(quotient, brackets) * family_units
}
