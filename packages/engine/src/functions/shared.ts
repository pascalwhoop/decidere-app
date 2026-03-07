import type { CalculationContext, BracketEntry } from '../../../schema/src/config-types'

export function getBrackets(bracketsRef: any, context: CalculationContext): BracketEntry[] {
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

export function computeBracketTax(income: number, brackets: BracketEntry[]): number {
  return computeProgressiveBracketTax(income, brackets)
}

/**
 * Standard progressive bracket tax calculation
 * Used by multiple country implementations
 */
export function computeProgressiveBracketTax(income: number, brackets: BracketEntry[]): number {
  if (income <= 0) return 0

  let tax = 0
  let previousThreshold = 0

  for (const bracket of brackets) {
    if (income <= bracket.threshold) {
      if (bracket.rate > 0) {
        tax += (income - previousThreshold) * bracket.rate
      }
      break
    } else {
      if (bracket.rate > 0 && bracket.threshold > previousThreshold) {
        tax += (bracket.threshold - previousThreshold) * bracket.rate
      }
      previousThreshold = bracket.threshold
    }
  }

  const lastBracket = brackets[brackets.length - 1]
  if (income > lastBracket.threshold) {
    tax += (income - lastBracket.threshold) * lastBracket.rate
  }

  return Math.round(tax)
}
