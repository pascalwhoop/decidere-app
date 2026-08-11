# ChangelogEntry Schema

TypeScript source: `src/types/changelog.ts`

```typescript
interface ChangelogEntry {
  version: string        // semver without "v", e.g. "0.2.12"
  date: string           // ISO date from tag, e.g. "2026-03-05"
  highlight?: string     // One-sentence hero — landmark releases only
  new_countries?: { code: string; name: string }[]
  new_variants?: { country_code: string; country: string; label: string }[]
  new_year_data?: { year: number; countries: { code: string; name: string }[] }[]
  improvements?: string[]
  fixes?: string[]
}
```

## Classification Rules

### new_countries
Country code directory (`configs/<code>/`) did **not** exist in the previous tag.
Use `git ls-tree` diff to confirm. Use proper display names (e.g. "South Korea" not "kr").

### new_year_data
Country directory existed, but a new tax year subdirectory was added (e.g. `configs/nl/2026/`).
Group by year — most releases add one year at a time.

### new_variants
Only files with status **`A` (Added)** in `git diff --name-status -- configs/ | grep "variants/"`.
Ignore `M` (Modified) variant files — those belong in `fixes` if calculation-relevant, or omitted.

### improvements
Plain English sentences describing what changed for the user. Examples:
- "The country configuration panel now opens as a full-height side sheet on desktop"
- "Exchange rate lookups are cached for one hour so switching currencies is instant"

No PR numbers, no technical jargon, no "feat:" prefixes.

### fixes
Only user-visible bugs: wrong calculation results, broken UI interactions. Examples:
- "Corrected the Spain Beckham Law calculation: personal allowance credit now correctly removed under the flat-rate regime"

Skip: lint fixes, TypeScript errors, CI failures, internal tooling bugs.

### highlight
Optional. Use only for:
- 5+ new countries in one release
- A landmark UI redesign (entire layout replaced)
- The initial launch

Skip for: routine patches, single-country additions, minor UI tweaks.

## Example Output

```json
{
  "version": "0.2.11",
  "date": "2026-03-01",
  "highlight": "Six new countries join the calculator, bringing total coverage to 27.",
  "new_countries": [
    { "code": "at", "name": "Austria" },
    { "code": "fi", "name": "Finland" }
  ],
  "new_variants": [
    { "country_code": "at", "country": "Austria", "label": "Researcher/Scientist Tax Relief (Zuzugsfreibetrag)" }
  ],
  "new_year_data": [
    {
      "year": 2026,
      "countries": [
        { "code": "gb", "name": "United Kingdom" }
      ]
    }
  ],
  "improvements": [
    "The country configuration panel now opens as a full-height side sheet on desktop and a bottom drawer on mobile"
  ],
  "fixes": [
    "Corrected the Spain Beckham Law calculation: the personal allowance credit is now properly removed under the flat-rate regime"
  ]
}
```
