---
name: changelog-entry
description: >
  Generates a user-facing changelog JSON entry for a new release of the Decidere salary calculator
  and prepends it to src/data/changelog/index.ts. Use when asked to "generate changelog for X.Y.Z",
  "add changelog entry", "changelog for this release", or any similar request to document a new version.
---

# Changelog Entry Generator

## Workflow

### 1. Determine tags

If the user provided a version (e.g. "0.2.12"), use tag `v0.2.12`. Otherwise use the latest tag:
```bash
git tag --sort=-version:refname | head -1
```

Find the previous tag:
```bash
git describe --tags --abbrev=0 <tag>^
```

### 2. Research the release

```bash
git log <prev>..<tag> --oneline
git show <tag> --format="%ai" -s
git diff --name-status <prev> <tag> -- configs/
git diff --stat <prev> <tag> -- src/
# Distinguish new countries from new year configs:
git ls-tree -r <prev> --name-only | grep "configs/.*/base.yaml" | sed 's|/[0-9]*/base.yaml||;s|configs/||' | sort -u
git ls-tree -r <tag>  --name-only | grep "configs/.*/base.yaml" | sed 's|/[0-9]*/base.yaml||;s|configs/||' | sort -u
# New vs modified variants:
git diff --name-status <prev> <tag> -- configs/ | grep "variants/"
```

Read changed files in `src/` to understand user-visible UI/UX changes.

### 3. Write `src/data/changelog/<version>.json`

See `references/schema.md` for the full schema and classification rules.

Key rules at a glance:

| Field | Rule |
|---|---|
| `new_countries` | Country dir **did not exist** in prev tag |
| `new_year_data` | Country existed; new year subdir added (e.g. `configs/nl/2026/`) |
| `new_variants` | Files marked **`A` (Added)** under `configs/*/variants/` — ignore `M` |
| `improvements` | User-visible UI/UX changes, plain English, no PR numbers |
| `fixes` | Calculation or UX bugs that affected users |

**EXCLUDE entirely:** `chore: bump version`, CI/CD, dependency bumps, lint fixes, internal tooling, docs-only commits.

`highlight` only for landmark releases (6+ new countries, major UI overhaul) — skip for routine patches.

### 4. Update `src/data/changelog/index.ts`

Read the file first, then **prepend** — never overwrite existing entries:

```typescript
import type { ChangelogData } from "@/types/changelog"
import v0212 from "./0.2.12.json"   // ← new
import v0211 from "./0.2.11.json"
// ... existing ...

export const changelog: ChangelogData = {
  versions: [v0212, v0211, ...]     // ← new first
}
```

Variable naming: `v` + version with dots removed (`0.2.12` → `v0212`).
