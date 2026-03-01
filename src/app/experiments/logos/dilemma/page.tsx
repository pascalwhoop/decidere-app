import React from "react"

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Card({
  bg = "#F9FAFB",
  children,
}: {
  bg?: string
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl flex items-center justify-center p-10"
      style={{ background: bg }}
    >
      {children}
    </div>
  )
}

// ─── CONCEPT A: Stay vs Leave ─────────────────────────────────────────────────
// One arm loops back (orbit/staying). One arm escapes into the distance.

function StayLeaveArt({ w = 220, dark = false }: { w?: number; dark?: boolean }) {
  const c = dark ? "white" : "#4F46E5"
  const h = Math.round(w * 0.82)
  const id = dark ? "sl-d" : "sl-l"
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 180" width={w} height={h}>
      <defs>
        {/* Leave path fades into distance */}
        <linearGradient id={id} x1="80" y1="148" x2="205" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c} stopOpacity="1" />
          <stop offset="100%" stopColor={c} stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* STAY: arm that loops out and curves back — an orbit around home */}
      <path
        d="M80 148 C55 128 22 98 32 64 C42 30 80 28 88 52 C96 76 84 136 82 150"
        stroke={c}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity={dark ? 0.4 : 0.38}
      />
      {/* LEAVE: arm that escapes cleanly into the horizon */}
      <path
        d="M80 148 C100 120 148 76 205 15"
        stroke={`url(#${id})`}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Person / you */}
      <circle cx="80" cy="148" r="8" fill={c} />

      {/* Tiny destination hints */}
      <circle cx="38" cy="66" r="4" fill={c} opacity="0.28" />
      <circle cx="205" cy="15" r="3" fill={c} opacity="0.12" />

      {/* Labels */}
      <text x="20" y="26" fontFamily="system-ui,sans-serif" fontSize="11" fill={c} opacity="0.55" fontWeight="600">STAY</text>
      <text x="168" y="14" fontFamily="system-ui,sans-serif" fontSize="11" fill={c} opacity="0.55" fontWeight="600">LEAVE</text>
    </svg>
  )
}

// Small icon — 32px
function StayLeaveIcon({ size = 32 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
      <defs>
        <linearGradient id="sl-i" x1="12" y1="26" x2="30" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="1" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path d="M12 26 C6 22 2 14 5 8 C8 2 16 4 15 10 C14 16 12 24 12 26" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.45" />
      <path d="M12 26 C17 20 22 13 30 4" stroke="url(#sl-i)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="26" r="3" fill="#4F46E5" />
    </svg>
  )
}

// ─── CONCEPT B: Safe vs Explore ───────────────────────────────────────────────
// Tight protective arc (Safe) vs wildly branching paths (Explore)

function SafeExploreArt({ w = 220, dark = false }: { w?: number; dark?: boolean }) {
  const c = dark ? "white" : "#4F46E5"
  const h = Math.round(w * 0.95)
  const id = dark ? "se-d" : "se-l"
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 210" width={w} height={h}>
      <defs>
        <linearGradient id={id} x1="95" y1="158" x2="175" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c} stopOpacity="1" />
          <stop offset="100%" stopColor={c} stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="175" y1="75" x2="215" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c} stopOpacity="0.8" />
          <stop offset="100%" stopColor={c} stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="175" y1="75" x2="215" y2="98" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c} stopOpacity="0.8" />
          <stop offset="100%" stopColor={c} stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* SAFE: short protective arc — stays close, curves back */}
      <path
        d="M95 158 C74 148 56 130 62 110 C68 90 90 96 90 112 C90 130 94 155 96 160"
        stroke={c}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity={dark ? 0.38 : 0.35}
      />

      {/* EXPLORE: main trunk goes up, then forks into three */}
      <path
        d="M95 158 C106 136 138 98 175 75"
        stroke={`url(#${id})`}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      {/* Branch 1 — upper */}
      <path
        d="M175 75 C182 58 184 40 178 18"
        stroke={`url(#${id}b)`}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Branch 2 — right */}
      <path
        d="M175 75 C188 72 204 72 218 64"
        stroke={`url(#${id}c)`}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Branch 3 — lower-right */}
      <path
        d="M175 75 C186 88 200 98 212 110"
        stroke={c}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.12"
      />

      {/* Person */}
      <circle cx="95" cy="158" r="8" fill={c} />

      {/* Labels */}
      <text x="42" y="124" fontFamily="system-ui,sans-serif" fontSize="11" fill={c} opacity="0.5" fontWeight="600">SAFE</text>
      <text x="148" y="18" fontFamily="system-ui,sans-serif" fontSize="11" fill={c} opacity="0.5" fontWeight="600">EXPLORE</text>
    </svg>
  )
}

function SafeExploreIcon({ size = 32 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
      <path d="M14 26 C8 23 5 17 7 12 C9 7 14 9 13 14 C12 19 13 24 14 26" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M14 26 C18 20 24 14 28 9" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M28 9 C28 4 26 2 24 2" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M28 9 C30 8 31 6 31 4" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.6" />
      <circle cx="14" cy="26" r="3" fill="#4F46E5" />
    </svg>
  )
}

// ─── CONCEPT C: Heart vs Head ─────────────────────────────────────────────────
// Organic heartbeat wave (Heart) vs ruler-straight geometric line (Head)

function HeartHeadArt({ w = 220, dark = false }: { w?: number; dark?: boolean }) {
  const c = dark ? "white" : "#4F46E5"
  const h = Math.round(w * 0.82)
  const id = dark ? "hh-d" : "hh-l"
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 180" width={w} height={h}>
      <defs>
        <linearGradient id={id} x1="90" y1="155" x2="10" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c} stopOpacity="1" />
          <stop offset="100%" stopColor={c} stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="90" y1="155" x2="205" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c} stopOpacity="1" />
          <stop offset="100%" stopColor={c} stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* HEAD: perfectly straight line, upper-right — rational, measured */}
      <path
        d="M90 155 L205 15"
        stroke={`url(#${id}r)`}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      {/* Small tick marks along head path to suggest measurement */}
      {[[115, 125], [140, 95], [166, 63]].map(([x, y], i) => (
        <line
          key={i}
          x1={x - 6} y1={y - 4}
          x2={x + 6} y2={y + 4}
          stroke={c}
          strokeWidth="2"
          opacity="0.35"
        />
      ))}

      {/* HEART: organic, irregular, emotionally driven */}
      <path
        d="M90 155 C78 136 62 128 68 108 C74 88 88 94 80 74 C72 54 48 50 40 28 C36 16 30 8 15 8"
        stroke={`url(#${id})`}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      {/* Heartbeat spike at the peak */}
      <path
        d="M68 108 C70 100 74 90 80 74"
        stroke={c}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
        opacity="0.18"
      />

      {/* Person */}
      <circle cx="90" cy="155" r="8" fill={c} />

      {/* Labels */}
      <text x="8" y="8" fontFamily="system-ui,sans-serif" fontSize="11" fill={c} opacity="0.5" fontWeight="600">HEART</text>
      <text x="172" y="14" fontFamily="system-ui,sans-serif" fontSize="11" fill={c} opacity="0.5" fontWeight="600">HEAD</text>
    </svg>
  )
}

function HeartHeadIcon({ size = 32 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
      {/* Head: straight line */}
      <path d="M14 28 L30 4" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* Heart: organic wave */}
      <path d="M14 28 C10 22 6 19 8 14 C10 9 14 11 11 6 C8 2 4 2 2 2" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.75" />
      <circle cx="14" cy="28" r="3" fill="#4F46E5" />
    </svg>
  )
}

// ─── CONCEPT D: The Three Tensions (Star) ────────────────────────────────────
// All three dilemmas in one mark — 6 arms in 3 opposing pairs from a center

function ThreeTensionsArt({ w = 220, dark = false }: { w?: number; dark?: boolean }) {
  const c = dark ? "white" : "#4F46E5"
  const h = w
  const cx = 110, cy = 110
  const id = dark ? "tt-d" : "tt-l"
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" width={w} height={h}>
      <defs>
        {/* Fade for escaping arms */}
        {["a","b","c","d","e","f"].map((k,i) => {
          const coords: [number,number,number,number][] = [
            [cx,cy,210,cx],    // Leave →
            [cx,cy,32,cx],     // Stay ←
            [cx,cy,188,22],    // Explore ↗
            [cx,cy,32,198],    // Safe ↙
            [cx,cy,32,22],     // Heart ↖
            [cx,cy,188,198],   // Head ↘
          ]
          const [x1,y1,x2,y2] = coords[i]
          return (
            <linearGradient key={k} id={`${id}-${k}`} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={c} stopOpacity="1" />
              <stop offset="100%" stopColor={c} stopOpacity="0.07" />
            </linearGradient>
          )
        })}
      </defs>

      {/* ── LEAVE (→ right): straight, decisive */}
      <path d={`M${cx} ${cy} L 210 ${cy}`} stroke={`url(#${id}-a)`} strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* ── STAY (← left): loops out and comes back */}
      <path d={`M${cx} ${cy} C 85 95 60 75 68 56 C 76 38 104 42 106 58 C 108 74 105 108 108 112`} stroke={`url(#${id}-b)`} strokeWidth="7" strokeLinecap="round" fill="none" opacity={dark ? 0.45 : 0.4} />

      {/* ── EXPLORE (↗ upper-right): branches */}
      <path d={`M${cx} ${cy} C 132 88 158 60 185 24`} stroke={`url(#${id}-c)`} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M185 24 C190 14 190 6 185 2" stroke={c} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.3" />
      <path d="M185 24 C196 22 206 24 214 18" stroke={c} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.3" />

      {/* ── SAFE (↙ lower-left): tight protective arc */}
      <path d={`M${cx} ${cy} C 94 126 80 148 90 164 C 100 180 116 172 114 160 C 112 148 108 114 110 112`} stroke={`url(#${id}-d)`} strokeWidth="7" strokeLinecap="round" fill="none" opacity={dark ? 0.38 : 0.35} />

      {/* ── HEART (↖ upper-left): organic waves */}
      <path d={`M${cx} ${cy} C 94 90 82 82 88 64 C 94 46 108 50 102 36 C 96 22 76 18 58 12`} stroke={`url(#${id}-e)`} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.85" />

      {/* ── HEAD (↘ lower-right): perfectly straight */}
      <path d={`M${cx} ${cy} L 190 200`} stroke={`url(#${id}-f)`} strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* Tick marks on head arm */}
      {[[128,122],[146,134],[164,146]].map(([x,y],i) => (
        <line key={i} x1={x-5} y1={y-5} x2={x+5} y2={y+5} stroke={c} strokeWidth="2" opacity="0.3" />
      ))}

      {/* Center — the person in the middle of all tensions */}
      <circle cx={cx} cy={cy} r="9" fill={c} />
      <circle cx={cx} cy={cy} r="14" fill="none" stroke={c} strokeWidth="1.5" opacity="0.2" />
    </svg>
  )
}

function ThreeTensionsIcon({ size = 32 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
      {/* Leave → */}
      <path d="M16 16 L30 16" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.9" />
      {/* Stay ← loop */}
      <path d="M16 16 C10 13 5 9 8 5 C11 1 16 3 15 8 C14 13 15 15 16 16" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.45" />
      {/* Explore ↗ */}
      <path d="M16 16 C20 12 24 8 28 3" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.9" />
      {/* Safe ↙ arc */}
      <path d="M16 16 C14 20 12 26 16 29 C20 32 22 28 20 24 C18 20 16 16 16 16" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.4" />
      {/* Heart ↖ wave */}
      <path d="M16 16 C12 12 8 10 10 6 C12 2 16 4 14 2" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.75" />
      {/* Head ↘ straight */}
      <path d="M16 16 L28 28" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.75" />
      {/* Center */}
      <circle cx="16" cy="16" r="3.5" fill="#4F46E5" />
    </svg>
  )
}

// ─── CONCEPT E: The Pull ──────────────────────────────────────────────────────
// Like a river delta in reverse — a web of paths all converging on YOU,
// each pulling from a different direction. You are the knot of all tensions.

function ThePullArt({ w = 220, dark = false }: { w?: number; dark?: boolean }) {
  const c = dark ? "white" : "#4F46E5"
  const h = w
  const px = 110, py = 130
  const id = dark ? "tp2-d" : "tp2-l"

  // 6 source points pulling at the person
  const sources = [
    { x: 208, y: 26,  label: "LEAVE",   opacity: 1 },
    { x: 15,  y: 26,  label: "EXPLORE", opacity: 1 },
    { x: 208, y: 200, label: "HEAD",    opacity: 0.95 },
    { x: 15,  y: 200, label: "HEART",   opacity: 0.85 },
    { x: 190, y: 110, label: "STAY",    opacity: 0.45 },
    { x: 30,  y: 110, label: "SAFE",    opacity: 0.4 },
  ]

  // control point pulls each path slightly toward center, creating tension curve
  const ctrl = (sx: number, sy: number) => {
    const mx = (sx + px) / 2
    const my = (sy + py) / 2
    const dx = mx - px, dy = my - py
    const len = Math.sqrt(dx*dx+dy*dy)
    const nx = -dy/len * 18, ny = dx/len * 18
    return [mx+nx, my+ny]
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" width={w} height={h}>
      <defs>
        {sources.map((s, i) => (
          <linearGradient key={i} id={`${id}-${i}`} x1={s.x} y1={s.y} x2={px} y2={py} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={c} stopOpacity="0.08" />
            <stop offset="100%" stopColor={c} stopOpacity="1" />
          </linearGradient>
        ))}
      </defs>

      {sources.map((s, i) => {
        const [cx2, cy2] = ctrl(s.x, s.y)
        return (
          <g key={i}>
            <path
              d={`M${s.x} ${s.y} Q${cx2} ${cy2} ${px} ${py}`}
              stroke={`url(#${id}-${i})`}
              strokeWidth="6.5"
              strokeLinecap="round"
              fill="none"
              opacity={s.opacity}
            />
            <circle cx={s.x} cy={s.y} r="4" fill={c} opacity="0.18" />
          </g>
        )
      })}

      {/* Labels at sources */}
      {sources.map((s, i) => {
        const anchor = s.x > 110 ? "end" : s.x < 110 ? "start" : "middle"
        const dy = s.y < 110 ? -10 : 16
        return (
          <text key={i} x={s.x} y={s.y + dy} textAnchor={anchor as "end"|"start"|"middle"} fontFamily="system-ui,sans-serif" fontSize="10" fill={c} opacity="0.48" fontWeight="600">
            {s.label}
          </text>
        )
      })}

      {/* The person — the knot */}
      <circle cx={px} cy={py} r="10" fill={c} />
      <circle cx={px} cy={py} r="16" fill="none" stroke={c} strokeWidth="2" opacity="0.15" />
      <circle cx={px} cy={py} r="24" fill="none" stroke={c} strokeWidth="1" opacity="0.08" />
    </svg>
  )
}

function ThePullIcon({ size = 32 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
      <defs>
        {[[2,2],[30,2],[2,30],[30,30],[32,16],[0,16]].map(([x,y],i) => (
          <linearGradient key={i} id={`tpi-${i}`} x1={x} y1={y} x2="16" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="1" />
          </linearGradient>
        ))}
      </defs>
      {[[2,2],[30,2],[2,30],[30,30],[30,16],[2,16]].map(([x,y],i) => (
        <path key={i} d={`M${x} ${y} L16 20`} stroke={`url(#tpi-${i})`} strokeWidth="2" strokeLinecap="round" fill="none" opacity={i >= 4 ? 0.45 : 0.9} />
      ))}
      <circle cx="16" cy="20" r="4" fill="#4F46E5" />
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const CONCEPTS = [
  {
    id: "stay-leave",
    title: "Stay vs Leave",
    subtitle: "One arm loops you back. One arm sets you free.",
    description: "The orbit path curves away and returns — you keep circling the same world. The escape path breaks free toward the horizon, fading into possibility. These are the two forces that never leave you alone.",
    ArtComp: StayLeaveArt,
    IconComp: StayLeaveIcon,
  },
  {
    id: "safe-explore",
    title: "Safe vs Explore",
    subtitle: "A sheltering arc versus a branching world.",
    description: "The safe arm stays close, curving back in a protective radius — you know its limits. The explore arm goes far and then splits again, then again — the further you go, the more possibilities open up.",
    ArtComp: SafeExploreArt,
    IconComp: SafeExploreIcon,
  },
  {
    id: "heart-head",
    title: "Heart vs Head",
    subtitle: "A feeling versus a calculation.",
    description: "The head path is a straight measured line — rational, direct, efficient. The heart path meanders: it dips, surges, and finds its own route. Both leave from the same place.",
    ArtComp: HeartHeadArt,
    IconComp: HeartHeadIcon,
  },
  {
    id: "three-tensions",
    title: "The Three Tensions",
    subtitle: "All six forces, one mark.",
    description: "This is where all three dilemmas live together. The person at center is pulled by six forces simultaneously — leave, stay, explore, safe, heart, head. Each arm has its own visual character: the loop, the branch, the wave, the straight line.",
    ArtComp: ThreeTensionsArt,
    IconComp: ThreeTensionsIcon,
  },
  {
    id: "the-pull",
    title: "The Pull",
    subtitle: "Six paths converge on you. You are the decision.",
    description: "Flip the perspective: instead of paths opening outward from you, all forces flow inward toward you — you are the knot that every tension is tied to. The possibilities are out there. You're here, at the centre of it all.",
    ArtComp: ThePullArt,
    IconComp: ThePullIcon,
  },
]

const sizes = [16, 24, 32, 48, 64, 128]
const bgs = ["#F9FAFB", "#030712", "#4F46E5", "#FAF8F5"]

export default function DilemmaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-12 py-10">
        <a href="/experiments/logos" className="text-sm text-indigo-600 hover:underline mb-4 inline-block">← Back to all concepts</a>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">The Dilemma</h1>
        <p className="text-gray-500 max-w-2xl text-lg leading-relaxed">
          Behind every relocation decision are three fundamental tensions —{" "}
          <strong>stay vs leave</strong>, <strong>safe vs explore</strong>,{" "}
          <strong>heart vs head</strong>. These are the emotions Decidere lives in.
          <br />
          <span className="text-sm mt-1 block text-gray-400">Visual concepts in the language of paths, rays, and arms.</span>
        </p>
      </div>

      <div className="px-12 py-12 space-y-28 max-w-5xl">
        {CONCEPTS.map(({ id, title, subtitle, description, ArtComp, IconComp }) => (
          <section key={id}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
              <p className="text-indigo-600 font-medium text-sm mb-3">{subtitle}</p>
              <p className="text-gray-500 max-w-xl text-sm leading-relaxed">{description}</p>
            </div>

            {/* 2×2 background grid */}
            <div className="grid grid-cols-2 gap-5 mb-7">
              {bgs.map((bg, i) => (
                <Card key={i} bg={bg}>
                  <ArtComp w={200} dark={bg === "#030712" || bg === "#4F46E5"} />
                </Card>
              ))}
            </div>

            {/* Icon sizes */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Icon · light</p>
                <div className="flex items-end gap-7 bg-gray-50 rounded-xl px-8 py-5 flex-wrap">
                  {sizes.map(s => (
                    <div key={s} className="flex flex-col items-center gap-2">
                      <IconComp size={s} />
                      <span className="text-xs text-gray-400">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Icon · dark + sidebar</p>
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-end gap-7 bg-gray-900 rounded-xl px-8 py-5 flex-wrap">
                    {sizes.slice(0,4).map(s => (
                      <div key={s} className="flex flex-col items-center gap-2">
                        <IconComp size={s} />
                        <span className="text-xs text-gray-600">{s}</span>
                      </div>
                    ))}
                  </div>
                  {/* Sidebar mockup */}
                  <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                    <div className="bg-indigo-600 rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <IconComp size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Decidere</div>
                      <div className="text-xs text-gray-500">Decide where to live</div>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-3 bg-gray-900 rounded-xl px-4 py-3 shadow-sm">
                    <div className="bg-indigo-500 rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <IconComp size={16} />
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
        ))}
      </div>
    </div>
  )
}
