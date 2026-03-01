"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

export function DecidereLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative", className)}
      style={{
        WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 50%, transparent 100%)",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 50%, transparent 100%)",
      }}
    >
      <Image
        src="/logo.jpg"
        alt="Decidere Logo"
        fill
        className="object-cover transition-all duration-300 dark:invert-0 dark:hue-rotate-0 invert hue-rotate-180"
        priority
      />
    </div>
  )
}
