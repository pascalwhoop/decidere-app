import { describe, it, expect } from 'vitest'
import { CalculationEngine } from '../src/engine'
import { ConfigLoader } from '../src/config-loader'
import type { TaxConfig } from '../../schema/src/config-types'

const configsPath = join(process.cwd(), 'configs')
const loader = new ConfigLoader(configsPath)

import { join } from 'path'

// ============================================================================
// SHARED HELPERS
// ============================================================================

type ConfigEntry = {
  country: string
  year: string
  variant?: string
  label: string
}

/**
 * Discover all country/year/variant combinations.
 */
async function discoverConfigs(): Promise<ConfigEntry[]> {
  const configs: ConfigEntry[] = []
  const countries = await loader.listCountries()

  for (const country of countries) {
    const years = await loader.listYears(country)
    for (const year of years) {
      configs.push({ country, year, label: `${country}/${year}` })

      const variants = await loader.listVariants(country, year)
      for (const variant of variants) {
        configs.push({ country, year, variant, label: `${country}/${year}/${variant}` })
      }
    }
  }

  return configs
}

/**
 * Build a complete set of valid baseline inputs for a config.
 * Handles required numbers, enums (with defaults/first option),
 * dependent enums (options_by_parent), and booleans.
 */
function buildBaselineInputs(
  config: TaxConfig,
  overrides: Record<string, string | number | boolean> = {}
): Record<string, string | number | boolean> {
  const inputs: Record<string, string | number | boolean> = {}

  // First pass: resolve non-dependent inputs
  for (const [key, def] of Object.entries(config.inputs)) {
    if (def == null) continue

    if (def.type === 'number') {
      if (key === 'gross_annual') {
        inputs[key] = overrides.gross_annual ?? 80000
      } else if (def.required) {
        inputs[key] = overrides[key] ?? def.default ?? 0
      }
      // skip optional number inputs (deductions) in baseline
    } else if (def.type === 'enum') {
      if (!('depends_on' in def) || !def.depends_on) {
        // Independent enum
        if ('default' in def && def.default) {
          inputs[key] = def.default
        } else if ('options' in def && def.options) {
          inputs[key] = Object.keys(def.options)[0]
        }
      }
      // Dependent enums handled in second pass
    } else if (def.type === 'boolean') {
      inputs[key] = overrides[key] ?? def.default ?? false
    }
  }

  // Second pass: resolve dependent enums (e.g. region_level_1 depends on region_level_0)
  for (const [key, def] of Object.entries(config.inputs)) {
    if (def == null) continue
    if (def.type !== 'enum') continue
    if (!('depends_on' in def) || !def.depends_on) continue

    const parentValue = inputs[def.depends_on]

    // Try options_by_parent first
    if ('options_by_parent' in def && def.options_by_parent && parentValue != null) {
      const parentOptions = def.options_by_parent[String(parentValue)]
      if (parentOptions) {
        inputs[key] = Object.keys(parentOptions)[0]
        continue
      }
    }

    // Fall back to default or first option
    if ('default' in def && def.default) {
      inputs[key] = def.default
    } else if ('options' in def && def.options) {
      inputs[key] = Object.keys(def.options)[0]
    }
  }

  // Apply explicit overrides last
  for (const [key, value] of Object.entries(overrides)) {
    inputs[key] = value
  }

  return inputs
}

// ============================================================================
// 1. INPUT EFFECT MONOTONICITY
// ============================================================================
// Inputs annotated with effect: reduces_tax must not decrease net.
// Inputs annotated with effect: increases_tax must not increase net.
// Inputs without effect annotation are skipped (no assumption about direction).

describe('Input Effect Monotonicity', async () => {
  const allConfigs = await discoverConfigs()

  for (const entry of allConfigs) {
    const config = await loader.loadConfig(entry.country, entry.year, entry.variant)
    const engine = new CalculationEngine(config)

    // Find inputs with an explicit effect annotation
    const annotatedInputs = Object.entries(config.inputs).filter(
      ([, def]) =>
        def != null &&
        !def.required &&
        'effect' in def &&
        (def.effect === 'reduces_tax' || def.effect === 'increases_tax')
    )

    if (annotatedInputs.length === 0) continue

    const baselineInputs = buildBaselineInputs(config)
    const baselineResult = engine.calculate(baselineInputs)

    for (const [inputKey, inputDef] of annotatedInputs) {
      const effect = (inputDef as { effect: string }).effect
      const testValue = inputDef.type === 'boolean' ? true : 12000

      if (effect === 'reduces_tax') {
        it(`${entry.label} — ${inputKey} (reduces_tax) must not decrease net`, () => {
          const testResult = engine.calculate({ ...baselineInputs, [inputKey]: testValue })

          expect(
            testResult.net,
            `Net decreased from ${baselineResult.net} to ${testResult.net} when adding ${inputKey}=${testValue}. Input is marked reduces_tax but net went down.`
          ).toBeGreaterThanOrEqual(baselineResult.net - 1)
        })
      } else if (effect === 'increases_tax') {
        it(`${entry.label} — ${inputKey} (increases_tax) must not increase net`, () => {
          const testResult = engine.calculate({ ...baselineInputs, [inputKey]: testValue })

          expect(
            testResult.net,
            `Net increased from ${baselineResult.net} to ${testResult.net} when adding ${inputKey}=${testValue}. Input is marked increases_tax but net went up.`
          ).toBeLessThanOrEqual(baselineResult.net + 1)
        })
      }
    }
  }
})

// ============================================================================
// 2. NET BOUNDS
// ============================================================================
// Net must always be between 0 and gross.

describe('Net Income Bounds', async () => {
  const allConfigs = await discoverConfigs()
  const testGrossValues = [1000, 25000, 50000, 100000, 200000, 500000]

  for (const entry of allConfigs) {
    it(`${entry.label} — net is between 0 and gross for all income levels`, async () => {
      const config = await loader.loadConfig(entry.country, entry.year, entry.variant)
      const engine = new CalculationEngine(config)
      const inputs = buildBaselineInputs(config)

      for (const gross of testGrossValues) {
        const result = engine.calculate({ ...inputs, gross_annual: gross })

        expect(result.net, `Net (${result.net}) is negative at gross=${gross}`)
          .toBeGreaterThanOrEqual(0)
        expect(result.net, `Net (${result.net}) exceeds gross (${gross})`)
          .toBeLessThanOrEqual(gross + 1)
      }
    })
  }
})

// ============================================================================
// 3. EFFECTIVE RATE BOUNDS
// ============================================================================
// Effective rate must be between 0% and 100%.

describe('Effective Rate Bounds', async () => {
  const allConfigs = await discoverConfigs()

  for (const entry of allConfigs) {
    it(`${entry.label} — effective rate is between 0 and 1`, async () => {
      const config = await loader.loadConfig(entry.country, entry.year, entry.variant)
      const engine = new CalculationEngine(config)
      const inputs = buildBaselineInputs(config, { gross_annual: 75000 })
      const result = engine.calculate(inputs)

      expect(result.effective_rate, `Effective rate ${result.effective_rate} is negative`)
        .toBeGreaterThanOrEqual(-0.001)
      expect(result.effective_rate, `Effective rate ${result.effective_rate} exceeds 100%`)
        .toBeLessThanOrEqual(1.001)
    })
  }
})

// ============================================================================
// 4. INCOME MONOTONICITY
// ============================================================================
// Higher gross should always yield higher net.

describe('Income Monotonicity', async () => {
  const allConfigs = await discoverConfigs()
  const grossLevels = [10000, 30000, 50000, 75000, 100000, 150000, 250000, 500000]

  for (const entry of allConfigs) {
    it(`${entry.label} — higher gross always yields higher net`, async () => {
      const config = await loader.loadConfig(entry.country, entry.year, entry.variant)
      const engine = new CalculationEngine(config)
      const inputs = buildBaselineInputs(config)

      let prevNet = -Infinity
      let prevGross = 0

      for (const gross of grossLevels) {
        const result = engine.calculate({ ...inputs, gross_annual: gross })

        expect(
          result.net,
          `Net decreased from ${prevNet.toFixed(0)} (at gross=${prevGross}) to ${result.net.toFixed(0)} (at gross=${gross}). Higher income should always yield higher take-home pay.`
        ).toBeGreaterThanOrEqual(prevNet - 1)

        prevNet = result.net
        prevGross = gross
      }
    })
  }
})

// ============================================================================
// 5. BREAKDOWN CONSISTENCY
// ============================================================================
// Breakdown items should sum to (gross - net).

describe('Breakdown Consistency', async () => {
  const allConfigs = await discoverConfigs()

  for (const entry of allConfigs) {
    it(`${entry.label} — breakdown sums to gross minus net`, async () => {
      const config = await loader.loadConfig(entry.country, entry.year, entry.variant)
      const engine = new CalculationEngine(config)
      const inputs = buildBaselineInputs(config)
      const result = engine.calculate(inputs)

      const totalFromGrossNet = result.gross - result.net
      let breakdownTotal = 0
      for (const item of result.breakdown) {
        breakdownTotal += item.amount
      }

      expect(
        Math.abs(totalFromGrossNet - breakdownTotal),
        `Breakdown total (${breakdownTotal.toFixed(2)}) doesn't match gross-net (${totalFromGrossNet.toFixed(2)}). Diff: ${(totalFromGrossNet - breakdownTotal).toFixed(2)}.`
      ).toBeLessThan(5)
    })
  }
})

// ============================================================================
// 6. VARIANT VS BASE SANITY CHECK
// ============================================================================
// Variants are typically tax-advantaged — flag if they produce >10% worse net.
// Some variants legitimately produce higher tax than base. These are listed
// below with the reason they are expected to be worse.

/**
 * Variants that are known to legitimately produce higher tax than the base
 * config at 100k gross. Keyed by "<country>/<variant>".
 *
 * CA provincials: base is federal-only; provincial variants ADD provincial
 *   income tax on top, so total tax is always higher.
 * DK researcher: flat 27% + 8% AM-bidrag with no deductions; worse than
 *   progressive system at moderate income (scheme targets high earners).
 * JP non-resident: flat 20.42% with no deductions or credits.
 * KR flat-tax: 20.9% (19% + 10% local) with no deductions; foreign worker
 *   simplified scheme that trades deductions for simplicity.
 * NO paye: flat 25% for foreign workers with no deductions allowed.
 * PL b2b-*: B2B variants include ZUS social contributions + health insurance
 *   that the employment base does not have; different cost structure.
 */
const VARIANTS_LEGITIMATELY_HIGHER_TAX = new Set([
  // Canada — provincial variants add provincial tax to federal-only base
  'ca/manitoba',
  'ca/new-brunswick',
  'ca/newfoundland',
  'ca/nova-scotia',
  'ca/pei',
  'ca/quebec',
  'ca/saskatchewan',
  // Denmark — researcher scheme is worse at moderate income
  'dk/researcher',
  // Japan — non-resident flat rate with no deductions
  'jp/non-resident',
  // South Korea — flat tax for foreign workers, no deductions
  'kr/flat-tax',
  // Norway — PAYE flat 25% for foreign workers, no deductions
  'no/paye',
  // Poland — B2B variants include social contributions not in employment base
  'pl/b2b-flat-tax',
  'pl/b2b-ryczalt-it',
])

describe('Variant vs Base Sanity Check', async () => {
  const allConfigs = await discoverConfigs()
  const variants = allConfigs.filter((c) => c.variant)

  for (const entry of variants) {
    const variantKey = `${entry.country}/${entry.variant}`
    const isExpectedHigherTax = VARIANTS_LEGITIMATELY_HIGHER_TAX.has(variantKey)

    it(`${entry.label} — variant does not produce significantly higher tax than base`, async () => {
      const baseConfig = await loader.loadConfig(entry.country, entry.year)
      const variantConfig = await loader.loadConfig(entry.country, entry.year, entry.variant)

      const baseEngine = new CalculationEngine(baseConfig)
      const variantEngine = new CalculationEngine(variantConfig)

      // Use base config inputs (variant may add inputs but base inputs should work)
      const inputs = buildBaselineInputs(baseConfig, { gross_annual: 100000 })

      const baseResult = baseEngine.calculate(inputs)
      const variantResult = variantEngine.calculate(inputs)

      if (isExpectedHigherTax) {
        // For variants known to produce higher tax, just verify they still
        // compute a reasonable result (net > 0 and net < gross)
        expect(
          variantResult.net,
          `Variant "${entry.variant}" net (${variantResult.net.toFixed(0)}) should be positive.`
        ).toBeGreaterThan(0)
        expect(
          variantResult.net,
          `Variant "${entry.variant}" net (${variantResult.net.toFixed(0)}) exceeds gross.`
        ).toBeLessThanOrEqual(100001)
      } else {
        expect(
          variantResult.net,
          `Variant "${entry.variant}" net (${variantResult.net.toFixed(0)}) is >10% worse than base (${baseResult.net.toFixed(0)}).`
        ).toBeGreaterThanOrEqual(baseResult.net * 0.90)
      }
    })
  }
})

// Zero Income test removed: all configs compute effective_rate as (gross-net)/gross,
// which is undefined at gross=0. The invariants (no free money, no negative net) are
// already covered by Net Income Bounds and Income Monotonicity at realistic incomes.
