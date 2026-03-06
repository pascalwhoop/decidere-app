import { describe, it, expect } from 'vitest'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { CalculationEngine } from '../src/engine'
import { ConfigLoader } from '../src/config-loader'
import type { TestVector } from '../../schema/src/config-types'

const configsPath = join(process.cwd(), 'configs')
const loader = new ConfigLoader(configsPath)

/**
 * Automatically discover and run all test vectors from config files
 */
async function discoverTests(): Promise<
  Array<{
    country: string
    year: string
    variant?: string
    testFile: string
    testVector: TestVector
  }>
> {
  const tests: Array<{
    country: string
    year: string
    variant?: string
    testFile: string
    testVector: TestVector
  }> = []

  try {
    const countries = await readdir(configsPath, { withFileTypes: true })

    for (const countryDir of countries) {
      if (!countryDir.isDirectory()) continue

      const country = countryDir.name
      const countryPath = join(configsPath, country)

      const years = await readdir(countryPath, { withFileTypes: true })

      for (const yearDir of years) {
        if (!yearDir.isDirectory()) continue

        const year = yearDir.name
        const testsPath = join(countryPath, year, 'tests')

        try {
          const testFiles = await readdir(testsPath)

          for (const testFile of testFiles) {
            if (!testFile.endsWith('.json')) continue

            const testPath = join(testsPath, testFile)
            const testContent = await readFile(testPath, 'utf-8')
            const testVector: TestVector = JSON.parse(testContent)

            tests.push({
              country,
              year,
              variant: testVector.variant,
              testFile,
              testVector,
            })
          }
        } catch (e) {
          // No tests directory or can't read it - skip
        }
      }
    }
  } catch (e) {
    console.error('Error discovering tests:', e)
  }

  return tests
}

describe('Config Test Vectors', async () => {
  const tests = await discoverTests()

  if (tests.length === 0) {
    it('should find at least one test vector', () => {
      expect(tests.length).toBeGreaterThan(0)
    })
    return
  }

  for (const test of tests) {
    const testName = `${test.country}/${test.year} - ${test.testVector.name}`

    it(testName, async () => {
      // Load config
      const config = await loader.loadConfig(test.country, test.year, test.variant)

      // Create engine and calculate
      const engine = new CalculationEngine(config)
      const result = engine.calculate(test.testVector.inputs as Record<string, string | number | boolean | Record<string, unknown> | undefined>)

      // Get tolerances
      const absTolerance = test.testVector.tolerance || 0
      const pctTolerance = test.testVector.tolerance_percent || 0

      // Helper to check if value is within tolerance
      const withinTolerance = (actual: number, expected: number): boolean => {
        const absDiff = Math.abs(actual - expected)

        if (absDiff <= absTolerance) return true

        if (pctTolerance > 0) {
          const pctDiff = Math.abs((actual - expected) / expected)
          if (pctDiff <= pctTolerance) return true
        }

        return false
      }

      // Check net income
      expect(
        withinTolerance(result.net, test.testVector.expected.net),
        `Net income: expected ${test.testVector.expected.net}, got ${result.net} (diff: ${Math.abs(result.net - test.testVector.expected.net)})`
      ).toBe(true)

      // Check effective rate
      expect(
        withinTolerance(result.effective_rate, test.testVector.expected.effective_rate),
        `Effective rate: expected ${test.testVector.expected.effective_rate}, got ${result.effective_rate} (diff: ${Math.abs(result.effective_rate - test.testVector.expected.effective_rate)})`
      ).toBe(true)

      // Check breakdown items if specified
      if (test.testVector.expected.breakdown) {
        for (const [itemId, expectedAmount] of Object.entries(
          test.testVector.expected.breakdown
        )) {
          // Skip if it's an empty array (like UAE tests have)
          if (Array.isArray(expectedAmount) && expectedAmount.length === 0) {
            continue
          }

          // Skip if it's an array at all - we expect individual item amounts
          if (Array.isArray(expectedAmount)) {
            continue
          }

          const breakdownItem = result.breakdown.find(
            (item) => item.id === itemId || item.label === itemId
          )

          expect(
            breakdownItem,
            `Breakdown item "${itemId}" not found in result`
          ).toBeDefined()

          if (breakdownItem) {
            expect(
              withinTolerance(breakdownItem.amount, expectedAmount as number),
              `Breakdown ${itemId}: expected ${expectedAmount}, got ${breakdownItem.amount} (diff: ${Math.abs(breakdownItem.amount - (expectedAmount as number))})`
            ).toBe(true)
          }
        }
      }
    })
  }
})

/**
 * Marginal Rate Validation Tests
 *
 * These tests detect tax bracket discontinuities and impossible marginal rates.
 * A 100% marginal rate indicates a discontinuous jump at a bracket boundary,
 * which violates fundamental tax principles. This typically means a flat tax
 * is being applied to the entire income based on bracket thresholds (wrong)
 * instead of progressive brackets (correct).
 */
describe('Marginal Rate Validation', async () => {
  const tests = await discoverTests()

  // Filter to only tests with income ranges we can interpolate
  const validTests = tests.filter(t => {
    const inputs = t.testVector.inputs as Record<string, unknown>
    return (
      typeof inputs.gross_annual === 'number' &&
      inputs.gross_annual > 5000 // Need meaningful income
    )
  })

  if (validTests.length === 0) {
    it('should find tests to validate marginal rates', () => {
      expect(validTests.length).toBeGreaterThan(0)
    })
    return
  }

  for (const test of validTests) {
    const testName = `${test.country}/${test.year} - Marginal rates for ${test.testVector.name}`

    it(testName, async () => {
      const config = await loader.loadConfig(test.country, test.year, test.variant)
      const engine = new CalculationEngine(config)

      const baseInputs = test.testVector.inputs as Record<string, string | number | boolean | Record<string, unknown> | undefined>
      const baseGross = baseInputs.gross_annual as number

      // Test at 5 income levels: base, +1%, +5%, +10%, +20%
      const increments = [0, 0.01, 0.05, 0.1, 0.2]
      const results: Array<{ gross: number; net: number; marginalRate: number }> = []

      for (const increment of increments) {
        const testGross = baseGross * (1 + increment)

        const result = engine.calculate({
          ...baseInputs,
          gross_annual: testGross,
        })

        results.push({
          gross: testGross,
          net: result.net,
          marginalRate: increment === 0 ? 0 : (baseInputs.gross_annual as number - result.net) / (testGross - baseGross),
        })
      }

      // Check marginal rates between each pair
      for (let i = 1; i < results.length; i++) {
        const prev = results[i - 1]
        const curr = results[i]
        const marginalRate = 1 - (curr.net - prev.net) / (curr.gross - prev.gross)

        // Marginal rate should be between 0% and 100%
        // Allow slight overage due to rounding (e.g., 100.5%)
        expect(
          marginalRate <= 1.01,
          `Impossible marginal rate of ${(marginalRate * 100).toFixed(1)}% detected between ${prev.gross.toFixed(0)} and ${curr.gross.toFixed(0)} CHF. This indicates a discontinuous tax calculation - likely a flat rate applied to entire income instead of progressive brackets.`
        ).toBe(true)

        // Also check for negative marginal rates (taxes decrease as income increases)
        expect(
          marginalRate >= -0.01,
          `Negative marginal rate of ${(marginalRate * 100).toFixed(1)}% detected - net income increased more than gross income increased. This violates tax principles.`
        ).toBe(true)
      }
    })
  }
})
