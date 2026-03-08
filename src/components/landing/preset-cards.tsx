"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

type PresetCountry = { label: string; param: string }

const presets: {
  id: string
  title: string
  description: string
  countries: PresetCountry[]
  variants?: string
  icon: string
}[] = [
  {
    id: "tech-hubs",
    title: "Tech Hubs",
    description: "Compare salaries in the world's top tech centers",
    countries: [
      { label: "San Francisco, California", param: "us---state:california" },
      { label: "New York", param: "us---state:new_york" },
      { label: "London", param: "gb" },
      { label: "Berlin", param: "de" },
      { label: "Paris", param: "fr" },
    ],
    icon: "🏙️",
  },
  {
    id: "eu-comparison",
    title: "EU Comparison",
    description: "Navigate European tax systems side-by-side",
    countries: [
      { label: "Germany", param: "de" },
      { label: "France", param: "fr" },
      { label: "Netherlands", param: "nl" },
      { label: "Italy", param: "it" },
    ],
    icon: "🇪🇺",
  },
  {
    id: "expat-havens",
    title: "Expat Havens",
    description: "Explore tax-optimized destinations for international workers",
    countries: [
      { label: "Switzerland", param: "ch" },
      { label: "Netherlands", param: "nl" },
      { label: "Portugal", param: "pt" },
      { label: "United Arab Emirates", param: "ae" },
    ],
    variants: "nl:30-ruling",
    icon: "✈️",
  },
  {
    id: "impatriate-regimes",
    title: "Impatriate Regimes",
    description: "Compare high-income outcomes across US states, Southern Europe, and Zurich",
    countries: [
      { label: "California", param: "us-2026-180000-filing_status:single-state:california" },
      { label: "Texas", param: "us-2026-180000-filing_status:single-state:texas" },
      { label: "Greece", param: "gr-2026-152785-filing_status:single" },
      { label: "Portugal", param: "pt-2026-152785-filing_status:single" },
      {
        label: "Italy, Lazio",
        param: "it-2026-152785-region_level_1:lazio-has_minor_children:false",
      },
      {
        label: "Switzerland, Zurich",
        param:
          "ch-2026-140755-filing_status:single-region_level_1:zurich-pillar_3a_contributions:0-mortgage_interest_paid:0-investment_income_annual:0-childcare_costs:0-number_of_children_eligible:1-medical_expenses:0",
      },
    ],
    variants: "gr:article-5c,pt:ifici,it:impatriate",
    icon: "🌍",
  },
]

export function PresetCards() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Common Comparisons</h2>
          <p className="text-lg text-muted-foreground">
            Quick-start scenarios for professionals considering a move
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {presets.map((preset) => {
            const cParam = preset.countries.map((c) => c.param).join(",")
            const href = `/calculator?c=${cParam}${preset.variants ? `&v=${preset.variants}` : ""}`
            return (
              <Card
                key={preset.id}
                className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <div className="p-6">
                  <div className="text-4xl mb-4">{preset.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{preset.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {preset.description}
                  </p>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full gap-2 mb-6 group-hover:border-primary group-hover:text-primary"
                  >
                    <Link href={href}>
                      Compare
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>

                  <div className="flex flex-wrap gap-2">
                    {preset.countries.map((country) => (
                      <span
                        key={country.param}
                        className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                      >
                        {country.label}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
