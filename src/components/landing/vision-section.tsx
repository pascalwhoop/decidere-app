import { Card } from "@/components/ui/card"
import { DollarSign, Home, Heart, Truck, Users } from "lucide-react"

const roadmapSteps = [
  {
    icon: DollarSign,
    label: "Financial",
    description: "After-tax income comparison",
    active: true,
  },
  {
    icon: Home,
    label: "Cost of Living",
    description: "Real purchasing power",
    active: false,
  },
  {
    icon: Heart,
    label: "Lifestyle",
    description: "Quality of life factors",
    active: false,
  },
  {
    icon: Truck,
    label: "Logistics",
    description: "Visa, healthcare, admin",
    active: false,
  },
  {
    icon: Users,
    label: "Community",
    description: "People like you who moved",
    active: false,
  },
]

export function VisionSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            We&apos;re building the decision companion for life&apos;s biggest move
          </h2>
          <p className="text-lg text-muted-foreground">
            Financial clarity is just the beginning. We&apos;re building Decidere in public — here&apos;s where we&apos;re headed.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch gap-4 max-w-4xl mx-auto mb-12">
          {roadmapSteps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.label} className="flex-1 flex flex-col items-center">
                <Card
                  className={`w-full p-4 text-center flex flex-col items-center gap-2 ${
                    step.active
                      ? "border-primary bg-primary/5"
                      : "border-dashed opacity-60"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${step.active ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="font-semibold text-sm">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                  {step.active && (
                    <span className="text-xs font-medium text-primary mt-1">Live now</span>
                  )}
                </Card>
                {i < roadmapSteps.length - 1 && (
                  <div className="hidden md:block absolute" />
                )}
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Have thoughts on what should come next?
          </p>
          <a
            href="https://github.com/pascalwhoop/decidere/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Tell us what matters to you
          </a>
        </div>
      </div>
    </section>
  )
}
