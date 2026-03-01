import React from "react"
import fs from "fs"
import path from "path"
import Image from "next/image"

// ─── Existing concept icons ───────────────────────────────────────────────────

function GlobePinIcon({ size = 32 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
      <defs>
        <clipPath id="gp-clip">
          <circle cx="16" cy="12" r="9" />
        </clipPath>
      </defs>
      <path d="M16 30L8 16.5A9 9 0 1 1 24 16.5Z" fill="#4F46E5" />
      <g clipPath="url(#gp-clip)" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="1.3">
        <line x1="7" y1="12" x2="25" y2="12" />
        <ellipse cx="16" cy="12" rx="3.5" ry="9" />
      </g>
    </svg>
  )
}

function CompassIcon({ size = 32 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
      <circle cx="16" cy="16" r="13.5" fill="none" stroke="#4F46E5" strokeWidth="1.5" />
      <path d="M16 4L19 15H13Z" fill="#4F46E5" />
      <path d="M16 28L13 17H19Z" fill="#4F46E5" opacity="0.25" />
      <path d="M28 16L17 13V19Z" fill="#4F46E5" opacity="0.45" />
      <path d="M4 16L15 19V13Z" fill="#4F46E5" opacity="0.45" />
      <circle cx="16" cy="16" r="2" fill="#4F46E5" />
    </svg>
  )
}

function NetworkNodesIcon({ size = 32 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
      <g stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" opacity="0.45">
        <line x1="16" y1="8" x2="6" y2="23" />
        <line x1="16" y1="8" x2="26" y2="23" />
        <line x1="6" y1="23" x2="26" y2="23" />
      </g>
      <circle cx="16" cy="7" r="4" fill="#4F46E5" />
      <circle cx="6" cy="24" r="4" fill="#4F46E5" />
      <circle cx="26" cy="24" r="4" fill="#10B981" />
      <path
        d="M24.2 24L25.5 25.5L28.3 22.2"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

// ─── NEW: Three Paths concept ─────────────────────────────────────────────────

/** Small icon version (works at 16–128px) */
function ThreePathsIcon({ size = 32 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
      {/* Left sinuous path */}
      <path
        d="M16 28 C12 23 5 19 6 13 C7 8 4 5 5 2"
        stroke="#4F46E5"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      {/* Centre path */}
      <path
        d="M16 28 C16 22 14 16 16 11 C18 6 16 4 16 2"
        stroke="#4F46E5"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right sinuous path */}
      <path
        d="M16 28 C20 23 27 19 26 13 C25 8 28 5 27 2"
        stroke="#4F46E5"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      {/* Person / viewer position */}
      <circle cx="16" cy="28" r="2.5" fill="#4F46E5" />
    </svg>
  )
}

/** Large artistic version — shown on the concept page as a showcase */
function ThreePathsArt({ width = 200 }: { width?: number }) {
  const h = Math.round(width * 1.3)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 130"
      width={width}
      height={h}
      style={{ display: "block" }}
    >
      <defs>
        {/* Fade paths into the distance (bottom = near, top = far) */}
        <linearGradient id="tp-fade" x1="0" y1="120" x2="0" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="1" />
          <stop offset="65%" stopColor="#4F46E5" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="tp-fade-side" x1="0" y1="120" x2="0" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.65" />
          <stop offset="55%" stopColor="#4F46E5" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* Left path — S-curves toward upper-left */}
      <path
        d="M50 120 C42 110, 24 96, 24 78 C24 62, 32 48, 18 28 C12 18, 8 10, 10 6"
        stroke="url(#tp-fade-side)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Centre path — gentle S-wave straight up */}
      <path
        d="M50 120 C50 108, 46 96, 50 82 C54 68, 50 54, 50 36 C50 24, 50 14, 50 6"
        stroke="url(#tp-fade)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Right path — S-curves toward upper-right */}
      <path
        d="M50 120 C58 110, 76 96, 76 78 C76 62, 68 48, 82 28 C88 18, 92 10, 90 6"
        stroke="url(#tp-fade-side)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Viewer / person at the bottom — covers the join */}
      <circle cx="50" cy="120" r="6" fill="#4F46E5" />
      {/* Small feet hint */}
      <line x1="48" y1="126" x2="46" y2="130" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
      <line x1="52" y1="126" x2="54" y2="130" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Same art but inverted for dark backgrounds */
function ThreePathsArtLight({ width = 200 }: { width?: number }) {
  const h = Math.round(width * 1.3)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 130"
      width={width}
      height={h}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="tp-fade-l" x1="0" y1="120" x2="0" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="65%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="tp-fade-ls" x1="0" y1="120" x2="0" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.65" />
          <stop offset="55%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <path d="M50 120 C42 110, 24 96, 24 78 C24 62, 32 48, 18 28 C12 18, 8 10, 10 6" stroke="url(#tp-fade-ls)" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M50 120 C50 108, 46 96, 50 82 C54 68, 50 54, 50 36 C50 24, 50 14, 50 6" stroke="url(#tp-fade-l)" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M50 120 C58 110, 76 96, 76 78 C76 62, 68 48, 82 28 C88 18, 92 10, 90 6" stroke="url(#tp-fade-ls)" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="50" cy="120" r="6" fill="white" />
      <line x1="48" y1="126" x2="46" y2="130" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="52" y1="126" x2="54" y2="130" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── Current logo ─────────────────────────────────────────────────────────────

function CurrentLogo({ size = 32 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
      <path
        fill="white"
        d="M8 4h16v12c0 4.418-3.582 8-8 8s-8-3.582-8-8V4zm3 2v10c0 2.761 2.239 5 5 5s5-2.239 5-5V6H11z"
      />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

type ConceptConfig = {
  name: string
  description: string
  Icon: React.ComponentType<{ size?: number }>
}

const concepts: ConceptConfig[] = [
  {
    name: "Concept 1: Globe Pin",
    description:
      "Location pin with globe latitude/longitude lines inside. Direct — 'where in the world are you going?' Instantly communicates international + location.",
    Icon: GlobePinIcon,
  },
  {
    name: "Concept 2: Compass Rose",
    description:
      "'Decidere' is Latin for 'to decide' (literally: to cut away options). A compass points the way — timeless symbol of navigation and direction.",
    Icon: CompassIcon,
  },
  {
    name: "Concept 3: Network Nodes",
    description:
      "Three connected country-nodes, one highlighted green as the chosen destination. Shows the comparison → decision flow directly.",
    Icon: NetworkNodesIcon,
  },
]

const emotionalTensions = [
  {
    name: "1. Stay vs Leave",
    description: "one arm loops back into an orbit (you keep circling the same life), one arm breaks cleanly into the distance, fading toward the horizon",
    filename: "stay-vs-leave.png"
  },
  {
    name: "2. Safe vs Explore",
    description: "a tight protective arc that stays close to home, versus a path that goes far and then forks into multiple branches",
    filename: "safe-vs-explore.png"
  },
  {
    name: "3. Heart vs Head",
    description: "a perfectly straight geometric line (measured, rational) versus an organic wave that dips and rises unpredictably (like an ECG / pulse)",
    filename: "heart-vs-head.png"
  },
  {
    name: "4. The Three Tensions",
    description: "all six forces in one mark radiating from a single center",
    filename: "the-three-tensions.png"
  },
  {
    name: "5. The Pull",
    description: "flipped perspective: you're at the knot, and all six forces converge on you from the outside",
    filename: "the-pull.png"
  }
]

const sizes = [16, 24, 32, 48, 64, 128]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LogoExperimentsPage() {
  // Dynamic scanning of public/generated/logos
  const generatedLogosDir = path.join(process.cwd(), "public/generated/logos")
  let generatedLogos: string[] = []
  
  if (fs.existsSync(generatedLogosDir)) {
    generatedLogos = fs.readdirSync(generatedLogosDir)
      .filter(file => /\.(png|jpe?g|svg|webp)$/i.test(file))
  }

  return (
    <div className="min-h-screen bg-white p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Decidere Logo Concepts</h1>
        <p className="text-gray-500 mb-12">
          Current logo: a generic &ldquo;U&rdquo; shape — no connection to the brand.
          <br />
          Exploring new directions for <strong>Decidere</strong> — &ldquo;decide where to live&rdquo;.
        </p>

        {/* Current logo */}
        <section className="mb-16">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Current logo (for comparison)</h2>
          <p className="text-sm text-gray-400 mb-6">Generic shape, no clear brand meaning</p>
          <div className="flex items-end gap-8 flex-wrap bg-gray-50 rounded-xl p-6 mb-4">
            {sizes.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <div
                  className="bg-indigo-600 rounded-lg flex items-center justify-center"
                  style={{ width: size * 1.33, height: size * 1.33 }}
                >
                  <CurrentLogo size={size} />
                </div>
                <span className="text-xs text-gray-400">{size}px</span>
              </div>
            ))}
          </div>
          <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
            <div className="bg-indigo-600 rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0">
              <CurrentLogo size={16} />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Decidere</div>
              <div className="text-xs text-gray-500">Decide where to live</div>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 mb-16" />

        {/* ─── NEW CONCEPTS: Emotional Tensions ─────────────────────────────── */}
        <section className="mb-20">
          <div className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            Latest concepts
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Emotional Tensions</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-xl">
            Five concepts exploring the emotional tensions behind every relocation decision.
            Generated using AI to explore abstract, richer visual metaphors.
          </p>

          <div className="space-y-16">
            {emotionalTensions.map((tension) => (
              <div key={tension.name} className="border-l-4 border-indigo-100 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tension.name}</h3>
                <p className="text-sm text-gray-500 mb-6 italic">{tension.description}</p>
                <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center border border-gray-100 shadow-inner overflow-hidden">
                  <Image 
                    src={`/generated/logos/${tension.filename}`} 
                    alt={tension.name} 
                    width={400} 
                    height={400} 
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-200 mb-16" />

        {/* ─── DYNAMICALLY LOADED LOGOS ──────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Generated Logos</h2>
          <p className="text-sm text-gray-500 mb-8">
            Showing both the original file and an inverted version to preview light/dark mode adaptability.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {generatedLogos.map((filename) => (
              <div key={filename} className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="grid grid-cols-2 aspect-[2/1] border-b border-gray-100">
                  {/* Original */}
                  <div className="relative bg-gray-950 flex items-center justify-center">
                    <span className="absolute top-2 left-2 z-10 text-[9px] font-bold text-gray-500 uppercase tracking-wider">Original</span>
                    <Image 
                      src={`/generated/logos/${filename}`} 
                      alt={`${filename} original`} 
                      fill 
                      className="object-contain p-4 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  {/* Inverted */}
                  <div className="relative bg-white flex items-center justify-center border-l border-gray-100">
                    <span className="absolute top-2 left-2 z-10 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Inverted</span>
                    <Image 
                      src={`/generated/logos/${filename}`} 
                      alt={`${filename} inverted`} 
                      fill 
                      className="object-contain p-4 group-hover:scale-105 transition-transform"
                      style={{ filter: "invert(1) hue-rotate(180deg)" }}
                    />
                  </div>
                </div>
                <div className="p-3 bg-gray-50">
                  <p className="text-[10px] font-mono text-gray-500 truncate">{filename}</p>
                </div>
              </div>
            ))}
            {generatedLogos.length === 0 && (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400">No logos found in generated directory.</p>
              </div>
            )}
          </div>
        </section>

        <hr className="border-gray-200 mb-16" />

        {/* ─── NEW CONCEPT: Three Paths ─────────────────────────────────────── */}
        <section className="mb-20">
          <div className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            Vector concept
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Concept 4: Three Paths</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-xl">
            You stand at the beginning. Three sinuous paths open up before you — each winding into
            the distance. You must choose one. Fades toward the horizon to suggest depth and
            possibility. Directly embodies &ldquo;decide where to live&rdquo;.
          </p>

          {/* Large artistic showcase */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Light */}
            <div className="rounded-2xl bg-gray-50 p-10 flex items-center justify-center">
              <ThreePathsArt width={160} />
            </div>
            {/* Dark */}
            <div className="rounded-2xl bg-gray-950 p-10 flex items-center justify-center">
              <ThreePathsArtLight width={160} />
            </div>
            {/* Indigo */}
            <div className="rounded-2xl p-10 flex items-center justify-center" style={{ background: "#4F46E5" }}>
              <ThreePathsArtLight width={160} />
            </div>
            {/* Warm cream */}
            <div className="rounded-2xl p-10 flex items-center justify-center" style={{ background: "#FAF8F5" }}>
              <ThreePathsArt width={160} />
            </div>
          </div>

          {/* Icon sizes */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Icon at all sizes — light background
              </p>
              <div className="flex items-end gap-8 flex-wrap bg-gray-50 rounded-xl p-6">
                {sizes.map((size) => (
                  <div key={size} className="flex flex-col items-center gap-2">
                    <ThreePathsIcon size={size} />
                    <span className="text-xs text-gray-400">{size}px</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Icon at all sizes — dark background
              </p>
              <div className="flex items-end gap-8 flex-wrap bg-gray-900 rounded-xl p-6">
                {sizes.map((size) => (
                  <div key={size} className="flex flex-col items-center gap-2">
                    <ThreePathsIcon size={size} />
                    <span className="text-xs text-gray-600">{size}px</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Sidebar mockup
              </p>
              <div className="flex gap-6 flex-wrap">
                <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                  <div className="bg-indigo-600 rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <ThreePathsIcon size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Decidere</div>
                    <div className="text-xs text-gray-500">Decide where to live</div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-3 bg-gray-900 rounded-xl px-4 py-3 shadow-sm">
                  <div className="bg-indigo-500 rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <ThreePathsIcon size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Decidere</div>
                    <div className="text-xs text-gray-400">Decide where to live</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 mb-16" />

        {/* Earlier concepts */}
        <h2 className="text-xl font-bold text-gray-900 mb-8">Earlier concepts</h2>
        {concepts.map(({ name, description, Icon }) => (
          <section key={name} className="mb-16">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xl">{description}</p>

            <div className="space-y-5">
              <div className="flex items-end gap-8 flex-wrap bg-gray-50 rounded-xl p-6">
                {sizes.map((size) => (
                  <div key={size} className="flex flex-col items-center gap-2">
                    <Icon size={size} />
                    <span className="text-xs text-gray-400">{size}px</span>
                  </div>
                ))}
              </div>
              <div className="flex items-end gap-8 flex-wrap bg-gray-900 rounded-xl p-6">
                {sizes.map((size) => (
                  <div key={size} className="flex flex-col items-center gap-2">
                    <Icon size={size} />
                    <span className="text-xs text-gray-600">{size}px</span>
                  </div>
                ))}
              </div>
              <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <div className="bg-indigo-600 rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Decidere</div>
                  <div className="text-xs text-gray-500">Decide where to live</div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
