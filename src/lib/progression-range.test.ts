import { describe, expect, it } from "vitest"

import {
  convertBaseGrossToLocalGross,
  countProgressionPoints,
  getProgressionRange,
  normalizeProgressionSalariesToBaseCurrency,
  PROGRESSION_DEFAULT_RANGE,
  PROGRESSION_TARGET_MAX_POINTS,
} from "./progression-range"

describe("getProgressionRange", () => {
  it("returns the default range when no valid salaries are present", () => {
    expect(getProgressionRange([NaN, -1, 0])).toEqual(PROGRESSION_DEFAULT_RANGE)
  })

  it("keeps point counts bounded for high-nominal salaries like Sweden", () => {
    const range = getProgressionRange([1_653_342])

    expect(range.stepSize).toBe(50_000)
    expect(countProgressionPoints(range.minGross, range.maxGross, range.stepSize)).toBeLessThanOrEqual(
      PROGRESSION_TARGET_MAX_POINTS
    )
  })

  it("still uses dense sampling for normal salary ranges", () => {
    const range = getProgressionRange([139_286, 152_785])

    expect(range.stepSize).toBeLessThanOrEqual(10_000)
    expect(countProgressionPoints(range.minGross, range.maxGross, range.stepSize)).toBeGreaterThan(20)
  })

  it("normalizes high-nominal local salaries before deriving the shared range (fixes #111)", () => {
    const normalized = normalizeProgressionSalariesToBaseCurrency([
      { gross: 180_000, rateToBase: 1 },
      { gross: 1_875_000, rateToBase: 0.096 },
    ])

    const range = getProgressionRange(normalized)

    expect(normalized).toEqual([180_000, 180_000])
    expect(range).toEqual({
      minGross: 90_000,
      maxGross: 540_000,
      stepSize: 5_000,
    })
  })

  it("converts each base-currency progression point back to local gross for engine requests", () => {
    expect(convertBaseGrossToLocalGross(540_000, 0.096)).toBeCloseTo(5_625_000)
    expect(convertBaseGrossToLocalGross(180_000, 1)).toBe(180_000)
  })
})
