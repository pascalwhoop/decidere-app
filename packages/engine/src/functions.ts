/**
 * Registry of built-in functions for complex tax calculations
 * that cannot be expressed in pure YAML config nodes.
 *
 * Each function is implemented in its own country module under functions/.
 * To add a new country function:
 *   1. Create packages/engine/src/functions/<country-code>.ts
 *   2. Export your function(s) from it
 *   3. Register them below with functions.set('<name>', <fn>)
 */

import { incomeSplittingTax } from './functions/de'
import { familyQuotientTax } from './functions/fr'
import { alternativeMinimumTax } from './functions/us'
import { swissFederalTax } from './functions/ch'
import { austriaFullYearTax } from './functions/at'

export function resolveFunctions(): Map<string, Function> {
  const functions = new Map<string, Function>()

  functions.set('income_splitting_tax', incomeSplittingTax)   // DE
  functions.set('family_quotient_tax', familyQuotientTax)      // FR
  functions.set('alternative_minimum_tax', alternativeMinimumTax) // US
  functions.set('swiss_federal_tax', swissFederalTax)          // CH
  functions.set('austria_full_year_tax', austriaFullYearTax)   // AT

  return functions
}
