# Product Vision

## The Core Philosophy

**Decidere distills complexity into answers. It does not aggregate information.**

A tax calculator distills thousands of pages of tax law into one number: your take-home pay.
A community index distills the social fabric of a city into groups you can actually join.
A trajectory model distills career uncertainty into a projection you can reason about.

We are not building a wikipedia. Every feature takes something overwhelming and produces
something you can act on.

> Decidere (Latin: "to cut away options") — the act of moving from deliberation to action.

## The Question We Answer

**"If I move to [country/city], what would my life actually look like?"**

Starting with the question everyone asks first: what would I take home? Not approximately.
Not with hand-wavy averages. With the actual tax rules, the actual deductions you'd qualify
for — so you can make a real decision.

But a paycheck number alone doesn't make a decision. Decidere is expanding into the dimensions
that actually determine whether a move compounds your life or becomes a detour.

## Who This Is For

**Primary user: the geographically mobile professional.**

Gen Z and Millennials who can move relatively freely — remote workers, people on employer-of-record
contracts, consultants at large firms who can transfer internationally, and Americans weighing a
move between states. They're educated, financially literate enough to ask the right questions, but
not tax experts. They don't want to hire a tax advisor just to evaluate whether a move makes sense.

**Secondary user: the HR professional or recruiter** helping employees or candidates navigate
international mobility — understanding what a compensation package actually means in take-home terms
in different locations.

**Beachhead market: EU free movers.** People who can legally work anywhere in the EU and are
actively evaluating their options. This is where we go deep first.

**We are not building for:** companies running payroll, accountants filing returns, or anyone
who needs authoritative legal tax advice. We're an informational tool, not a tax authority.

## The Problem With Everything Else

Tools like Numbeo and Expatistan give you rough cost-of-living comparisons but treat taxes as a
blunt percentage. Actual tax calculators are per-country silos that don't let you compare.
Neither accounts for the things that genuinely change your tax burden — the Dutch mortgage
interest deduction that could be worth €700/month, the Swiss canton-level variation that makes
Zug and Geneva wildly different, the 30% ruling for Dutch expats.

**Our edge is depth at scale.** The kind of detail you'd normally pay a tax advisor for — canton +
municipality level in Switzerland, expat regimes, the top deductions per country — distilled into
a config-driven engine, available free, for any country we support. And this pattern — distill,
don't aggregate — extends to every dimension we add.

## What the Product Does (in layers)

### Layer 1: Gross → Net (live)
Enter your gross salary, get your net after all taxes and social contributions. Multiple countries
side by side. This exists.

### Layer 2: Tax deductions (in progress)
For each country, surface the top ways to reduce your tax burden — mortgage interest, pension
contributions, childcare, etc. User inputs their situation, the engine calculates the actual tax
impact. The goal is also educational: you might not know you can deduct your mortgage interest
in the Netherlands until this tool tells you.

### Layer 3: Cost of living (next)
Post-tax, what are your fixed costs? Rent/mortgage, healthcare, food, mobility, travel. User
enters their own numbers — we're not averaging their life. Eventually pre-fill based on city data
or logged medians, but user input first.

The combination of Layer 1 + 2 + 3 answers the first real question: **disposable income per month,
per country, for your specific situation.**

### Layer 4: Career trajectory modeling
Will this move compound or become a detour? Given your career goals, salary trajectory data, and
the job market depth in each city — model where you'll be in 5-10 years. This is the question
behind the question: not just "what do I earn now" but "what does this move do to my career arc."

### Layer 5: Community index
Map the real social fabric of each city. Not "Berlin has a startup scene" — but the actual
climbing clubs, running groups, coworking spaces, tech meetups, hobby communities. With real
links, Instagram profiles, contact info. The things that determine whether you'll actually
build a life there or feel isolated.

This is novel. Nobody has built a structured, browsable index of the communities that exist
in each city for people who are considering moving there.

### Layer 6: Job board
Once we have traffic from geographically mobile professionals, surface relevant opportunities.
Think remoteok.com or levels.fyi but integrated into the decision flow — you're already comparing
cities, now see what's actually hiring there.

## Growth & Community Strategy

Build a followership of geographically mobile professionals. Collect user data to understand
where people are considering moving, what matters to them, and where they end up. Use this to:

- Create city-specific communities for people who've made (or are considering) the same move
- Power the community index with real signal from real movers
- Inform the job board with actual demand patterns
- Build network effects: more users → better data → better product → more users

Open-source at its core, community-driven by design. The contribution model (anyone can add
a country config) becomes the growth model.

## UX Direction

The current single-column-per-country layout works for quick comparisons but gets cluttered as
inputs grow. The direction is a **wizard-style editor** separated from the results view:

- **Edit mode**: walk through income → deductions → costs in steps, per country
- **Results view**: clean comparison across countries once configured
- **Synchronized salary mode**: toggle that locks your gross salary across all countries,
  so you're always comparing apples to apples

## What We're Not Doing

- Becoming a wikipedia/encyclopedia of labor laws, visa rules, or country information
- Becoming a payroll or accounting tool
- Modeling every possible deduction (80/20 — top 5 per country that cover the majority of impact)
- Building information indexes that don't distill into something actionable
