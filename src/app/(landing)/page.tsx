import { Metadata } from "next"
import { HeroSection } from "@/components/landing/hero-section"
import { PresetCards } from "@/components/landing/preset-cards"
import { FeaturesSection } from "@/components/landing/features-section"
import { VisionSection } from "@/components/landing/vision-section"

export const metadata: Metadata = {
  title: "Decidere — Tax-Advisor-Level Salary Comparisons for Mobile Professionals",
  description:
    "If I move to [country/city], what would I actually take home? Tax-advisor-level accuracy for EU free movers, expats, remote workers. Canton/municipality level, expat regimes, free & open source.",
}

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <PresetCards />
      <FeaturesSection />
      <VisionSection />
    </>
  )
}
