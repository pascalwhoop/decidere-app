import type { CalculationContext } from '../../../schema/src/config-types'
import { getBrackets, computeBracketTax } from './shared'

/**
 * Swiss Federal Tax
 * Applies different rate schedules depending on filing status (single vs married).
 */
export function swissFederalTax(
  inputs: Record<string, number>,
  context: CalculationContext
): number {
  const { gross, filing_status, single_brackets: singleRef, married_brackets: marriedRef } =
    inputs as any

  const bracketsRef = filing_status === 'married' ? marriedRef : singleRef
  return computeBracketTax(gross, getBrackets(bracketsRef, context))
}
