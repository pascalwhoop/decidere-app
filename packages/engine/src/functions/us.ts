import type { CalculationContext } from '../../../schema/src/config-types'
import { getBrackets, computeBracketTax } from './shared'

/**
 * US Alternative Minimum Tax
 * Computes both regular income tax and AMT, returns whichever is higher.
 */
export function alternativeMinimumTax(
  inputs: Record<string, number>,
  context: CalculationContext
): number {
  const {
    gross,
    regular_brackets: regularRef,
    amt_brackets: amtRef,
    amt_exemption,
  } = inputs as any

  const regularTax = computeBracketTax(gross, getBrackets(regularRef, context))

  const amtBase = Math.max(0, gross - (amt_exemption || 0))
  const amt = computeBracketTax(amtBase, getBrackets(amtRef, context))

  return Math.max(regularTax, amt)
}
