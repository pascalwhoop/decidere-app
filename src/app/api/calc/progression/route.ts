import { NextRequest, NextResponse } from "next/server"
import { CalculationEngine, ConfigLoader } from "../../../../../packages/engine/src"
import { join } from "path"
import {
  convertBaseGrossToLocalGross,
  countProgressionPoints,
  PROGRESSION_MIN_STEP_SIZE,
  PROGRESSION_TARGET_MAX_POINTS,
} from "@/lib/progression-range"

const configLoader = new ConfigLoader(join(process.cwd(), "configs"))

export interface CalcRequestWithId {
  id: string
  country: string
  year: string | number
  gross_annual: number
  variant?: string
  progression_rate_to_base?: number
  [key: string]: string | number | boolean | undefined | unknown // Allow dynamic inputs
}

const MAX_REQUESTS = 8

interface ProgressionRequest {
  requests: CalcRequestWithId[]
  min_gross?: number
  max_gross?: number
  step_size?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: ProgressionRequest = await request.json()
    const { requests, min_gross = 5000, max_gross = 900000, step_size = 17000 } = body

    if (!requests || !Array.isArray(requests)) {
      return NextResponse.json({ error: "Invalid request, expected requests array" }, { status: 400 })
    }

    if (requests.length > MAX_REQUESTS) {
      return NextResponse.json({ error: `Too many requests; maximum is ${MAX_REQUESTS}` }, { status: 400 })
    }

    const range = max_gross - min_gross
    if (range <= 0) {
      return NextResponse.json({ error: "Gross range must be greater than 0" }, { status: 400 })
    }

    if (step_size < PROGRESSION_MIN_STEP_SIZE) {
      return NextResponse.json({ error: `step_size must be at least ${PROGRESSION_MIN_STEP_SIZE}` }, { status: 400 })
    }

    if (countProgressionPoints(min_gross, max_gross, step_size) > PROGRESSION_TARGET_MAX_POINTS) {
      return NextResponse.json(
        { error: `Too many progression points; maximum is ${PROGRESSION_TARGET_MAX_POINTS}` },
        { status: 400 }
      )
    }

    const results: Record<string, Array<{ gross: number, net: number, currency: string, effective_rate: number, marginal_rate?: number }>> = {}

    for (const req of requests) {
      if (!req.country || !req.year) continue

      try {
        const config = await configLoader.loadConfig(req.country, req.year, req.variant)
        const engine = new CalculationEngine(config)

        const dataPoints = []
        
        const rateToBase =
          typeof req.progression_rate_to_base === "number" && req.progression_rate_to_base > 0
            ? req.progression_rate_to_base
            : 1

        for (let baseGross = min_gross; baseGross <= max_gross; baseGross += step_size) {
          // Exclude transport fields before passing dynamic inputs into the engine.
          const {
            id: _id,
            gross_annual: _ga,
            progression_rate_to_base: _progressionRateToBase,
            ...engineInputs
          } = req

          const localGross = convertBaseGrossToLocalGross(baseGross, rateToBase)
          
          const engineInputsForCalc = {
            ...engineInputs,
            gross_annual: localGross
          } as Record<string, string | number | boolean | Record<string, unknown> | undefined>

          const result = engine.calculate(engineInputsForCalc)
          const marginalRate = engine.calculateMarginalRate(engineInputsForCalc)
          
          dataPoints.push({
            gross: baseGross,
            net: result.net,
            currency: config.meta.currency,
            effective_rate: result.effective_rate,
            marginal_rate: marginalRate
          })
        }
        
        results[req.id] = dataPoints
      } catch (err) {
        console.error(`Error calculating progression for ${req.country}:`, err)
        // Skip this country on error
      }
    }

    return NextResponse.json({ results })
  } catch (error: unknown) {
    console.error("Progression calculation error:", error)
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 })
  }
}
