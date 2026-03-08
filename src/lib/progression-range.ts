export const PROGRESSION_MIN_STEP_SIZE = 5_000
export const PROGRESSION_TARGET_MAX_POINTS = 120
export const PROGRESSION_DEFAULT_RANGE = {
  minGross: 10_000,
  maxGross: 300_000,
  stepSize: 10_000,
}

const NICE_STEPS = [5_000, 10_000, 20_000, 50_000, 100_000, 200_000, 500_000]

export interface ProgressionRange {
  minGross: number
  maxGross: number
  stepSize: number
}

export interface ProgressionSalary {
  gross: number
  rateToBase: number
}

export function countProgressionPoints(minGross: number, maxGross: number, stepSize: number): number {
  if (stepSize <= 0 || maxGross < minGross) return 0
  return Math.floor((maxGross - minGross) / stepSize) + 1
}

export function getProgressionRange(salaries: number[]): ProgressionRange {
  const validSalaries = salaries.filter((salary) => Number.isFinite(salary) && salary > 0)
  if (validSalaries.length === 0) return PROGRESSION_DEFAULT_RANGE

  const lo = Math.min(...validSalaries)
  const hi = Math.max(...validSalaries)
  const rawMin = Math.max(0, Math.floor((lo * 0.5) / 10_000) * 10_000)
  const rawMax = Math.ceil((hi * 3) / 10_000) * 10_000
  const rawRange = rawMax - rawMin

  const stepSize =
    NICE_STEPS.find((step) => countProgressionPoints(rawMin, rawMax, step) <= PROGRESSION_TARGET_MAX_POINTS) ??
    Math.max(
      PROGRESSION_MIN_STEP_SIZE,
      Math.ceil(rawRange / PROGRESSION_TARGET_MAX_POINTS / PROGRESSION_MIN_STEP_SIZE) * PROGRESSION_MIN_STEP_SIZE
    )

  return {
    minGross: rawMin,
    maxGross: Math.ceil(rawMax / stepSize) * stepSize,
    stepSize,
  }
}

export function normalizeProgressionSalariesToBaseCurrency(salaries: ProgressionSalary[]): number[] {
  return salaries
    .filter(
      ({ gross, rateToBase }) =>
        Number.isFinite(gross) && gross > 0 && Number.isFinite(rateToBase) && rateToBase > 0
    )
    .map(({ gross, rateToBase }) => gross * rateToBase)
}

export function convertBaseGrossToLocalGross(baseGross: number, rateToBase: number): number {
  if (!Number.isFinite(baseGross) || baseGross <= 0) return 0
  if (!Number.isFinite(rateToBase) || rateToBase <= 0) return baseGross
  return baseGross / rateToBase
}
